const deURL = decodeURIComponent(window.location.search);
const SU = deURL.split("?");
const uid = SU[1];
let userAnswers = [];
let urlTopic = SU[4];
let questions;
let quizIndex=0; // Current question index
let timeLeft = 90; // Each question has 1.5 minutes
let timerInterval;
// Initialize the Web Worker
const quizTimerWorker = new Worker("JS/timerWorker.js");
var canDoExams=localStorage.getItem("canDoExams")
var cdtReason=localStorage.getItem("cdtReason")
console.log(urlTopic)

let isTestCompleted = false;
let userID;
if(canDoExams=="true"){
    firebase.auth().onAuthStateChanged((user)=>{
        if(user){
    
             userID=user.uid
            if(userID === uid){
                connectionWbSocket(userID)
                localStorage.getItem('refCode')
    
            }else{
                window.location.href="index.html"
      
            }
    
        }else{
            window.location.href="index.html"
        }
    })
}else{
    Swal.fire("Test Done!","You have already done this test. Pay again to redo.", "warning").then(()=>{
        window.location.href="index.html"

    })
}

let socket;

function connectionWbSocket(userID) {

    console.log("Connecting WebSocket...");
    // socket = new WebSocket('ws://localhost:1738'); // Change to your actual WebSocket server
    socket = new WebSocket('wss://edutestbackend-wss.onrender.com'); 
    socket.onopen = () => {
        socket.send(JSON.stringify({ 
            type: 'socketAuth', 
            socketID: userID,
            currentQuizNo: quizIndex,
            userSocketAnswers: userAnswers,
            quizIndexTimeLeft: timeLeft,
            quizData: questions
        
        }));
        document.getElementById("testTopicExam").innerText = urlTopic;
        console.log('WebSocket connected');

        
    };
    

    socket.onmessage = (wsText) => {
        const msgData = JSON.parse(wsText.data);
        console.log(msgData.type)

        if (msgData.type === "socketAuth") {
            console.log(msgData.status);
            currentQuizNo=0
            userAnswers=[]
            timeLeft=90
            questions=[]
            generateQuiz(socket)
            document.getElementById("preloader").style.display="none"

        }
     
        if (msgData.type === "socketQuizData"){
             timeLeft=msgData.status.quizIndexTimeLeft;
             questions=msgData.status.quizData;
             renderQuestions(questions)
             startQuizTimer(timeLeft)           
        }
        if (msgData.type === "examInProgress"){
            quizIndex = msgData.status.currentQuizNo;
            timeLeft = parseInt(msgData.status.quizIndexTimeLeft);
            
    let newQuestions = msgData.status.quizData || [];
    let newUserAnswers = msgData.status.userSocketAnswers || [];

    // ✅ Preserve user-selected answers before updating
    userAnswers = newQuestions.map((q, index) => {
        let existingAnswer = userAnswers[index]; // Get the previously selected answer
        let backendAnswer = newUserAnswers[index]; // Get the answer from the backend

        return existingAnswer && existingAnswer.selectedAnswer
            ? existingAnswer // Keep user selection if available
            : backendAnswer || { answerIndex: null, selectedAnswer: "" }; // Use backend if no previous selection
    });

    // ✅ Update the questions list
          questions = newQuestions;
  
            renderQuestions(questions)
            startQuizTimer(timeLeft)
            tocurrentQuiz(quizIndex)
        };
        if (msgData.type === "socketQuizSubmit"){
            localStorage.setItem("canDoExams","false")
            analyseResult(msgData.dataResult);
            collapseExamRoom()
        }
        if (msgData.type === 'examBlocked') {
            console.log(msgData)
            if (msgData.reason === 'already_completed') {
              if (msgData.paymentRequired) {
                showPaymentModal();
              } 
              socket.close();
            }
          }
        
        
        function showPaymentModal() {
          // Implement your payment UI flow
         Swal.fire("Payment Needed", "Kindly pay for your test to proceed", "warning").then(()=>{
            window.location.href="library.html"
         })
        }
    

    };

    socket.onclose = (event) => {
        console.log("WebSocket closed:", event);
        // setTimeout(() => {
        //     console.log("Reconnecting...");
        //     connectWebSocket(); // Call the function again to reconnect
        // }, 2000);
    };

    socket.onerror = (error) => {
        console.error("WebSocket error:", error);
    };
}

// Reconnect function
function reconnectWebSocket(userID) {
    console.log("Reconnecting WebSocket in 3 seconds...");
    setTimeout(() => connectionWbSocket(userID), 3000);
}

// Call function on page load
const storedUserID = localStorage.getItem("userID"); 
if (storedUserID) {
    connectionWbSocket(storedUserID);
}


let awayTimer;

document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
        // User switched tab, start the timer
        awayTimer = setTimeout(() => {
            localStorage.setItem("canDoExams","false")
            localStorage.setItem("cdtReason","Test Irregularity")

            Swal.fire("Test Irregularity", "You have been kicked out due to test irregularity!", "error", ).then(()=>{
               
            }).then(()=>{
                collapseExamRoom();
                window.location.href="index.html"
            })
            alert("You have been away for more than 5 seconds!");
        }, 5000);
    } else {
        // User returned, clear the timer
        clearTimeout(awayTimer);
    }
});

async function generateQuiz(socket){
    if(socket.readyState===1){
        try {
            const bUrl = 'https://edutestbackend-wss.onrender.com/generateQuiz'
            // const bUrl = 'http://localhost:1738/generateQuiz'
            const response = await fetch(bUrl,{
                method:'POST',
                headers: {
                    'Content-Type':'application/json'
                },
                body:JSON.stringify({uid:uid,urlTopic:urlTopic})
    
            })
    
            const result = await response.json()
            console.log(result)
            questions =result.data
            renderQuestions(questions)
            socket.send(JSON.stringify({type:"socketQuizData", socketQuizData:questions,socketID:uid,userSocketAnswers:userAnswers,currentQuizNo:quizIndex,quizIndexTimeLeft:timeLeft}))

        } catch (error) {
             console.log(error)
        }
    }else{
        Console.log("socket haiko on")
    }
  
}
function renderQuestions(questions) {
    let deQuiz = "";

    questions.forEach((question) => {
        let deQ = question.question;
        let opts = question.options;
        let quizIndex = question.index;
        let quizID = question.id;
        let questionNumber = quizIndex + 1;
        let deOpt = "";

        opts.forEach((opt, optIndex) => {
            // Check if this option was previously selected
            let isSelected = userAnswers[quizIndex] && userAnswers[quizIndex].answerIndex === optIndex;
            let selectedClass = isSelected ? "sltChoiceUser" : ""; // Add selected class if chosen

            deOpt += `
                <div class="testChoices ${selectedClass}" onclick="sltAnswer(${quizIndex}, ${optIndex}, '${opt}')">
                    <span></span>
                    <p>${opt}</p>
                </div>
            `;
        });

        deQuiz += `
            <div class="deQuiz">
                <div class="quizInfo">
                    <p class="quizIndex">${quizIndex}</p>
                    <p class="quizId">z${quizID}</p>
                </div>
                <div class="testQuestion">
                    <p>${questionNumber + ". " + deQ}</p>
                </div>
                <div class="testChoicesWrap">
                    ${deOpt}
                </div>
            </div>
        `;
    });

    document.querySelector(".deQuizes").innerHTML = deQuiz;
    document.getElementById("preloader").style.display = "none";
}


function sltAnswer(questionIndex, answerIndex, selectedAnswer) {
    // Store the selected answer
    userAnswers[questionIndex] = {
        questionIndex,
        answerIndex,
        selectedAnswer
    };

    // Re-render questions to reflect selection
    console.log(userAnswers[questionIndex]);
    console.log(userAnswers);
}

function analyseResult(testResult){
    var exmCheat=false;
    console.log(testResult)
    const ticks=testResult.filter(c =>c.isCorrect).length;
    setTimeout(() => {
        localStorage.setItem("ticks",ticks)
        window.location.href="result.html"+"?"+uid+"?"+ticks+"?"+urlTopic+"?"+exmCheat
    }, 4000);

}

document.getElementById("nextBtnQuiz").addEventListener('click',()=>{
    tonxtQuiz(quizIndex)
})

function tonxtQuiz(quizIndex){
    
  var quizes=document.querySelectorAll(".deQuiz")
  var quizesWrap=document.querySelector(".deQuizes")
  if(parseInt(quizIndex) < quizes.length -1){
    quizIndex++;
    const offset = -quizIndex* 100 + '%'
    quizesWrap.style.transform=`translateY(${offset})`
    const messageData = JSON.stringify({
        type: "examInProgress",
        socketID: uid,
        currentQuizNo: quizIndex,
        userSocketAnswers: userAnswers,
        quizIndexTimeLeft: 90,
        quizData: questions
    });
    
    socket.send(messageData);
  
  }
  if(quizIndex==8){
    document.getElementById('nextBtnQuiz').innerText="Submit";
  }
  if(quizIndex+1 == quizes.length){
    console.log('no more test')
    submitTest()
  }


}


function tocurrentQuiz(){
    
  var quizesWrap=document.querySelector(".deQuizes")
  if(quizIndex){
    const offset = -quizIndex* 100 + '%'
    quizesWrap.style.transform=`translateY(${offset})`
  
  }

}


function submitTest(){
    localStorage.setItem("canDoExams","false")
    localStorage.setItem("cdtReason","Test Completed")
    document.getElementById("makingResult").style.display="flex"
    socket.send(JSON.stringify({
        type:"socketQuizSubmit",
        socketID:uid, 
        userSocketAnswers:userAnswers,
        socketQuizData:questions
    }))
}


document.querySelector(".deQuizes").addEventListener("click", function (event) {
    if (event.target.closest(".testChoices")) {

        // Remove the "sltChoiceUser" class from all choices
        document.querySelectorAll(".testChoices").forEach((c) => c.classList.remove("sltChoiceUser"));

        // Add the class to the clicked element
        event.target.closest(".testChoices").classList.add("sltChoiceUser");
    }
});

quizTimerWorker.onmessage = function (event) {
    if (event.data.action === "updateTime") {
        const timeLeft = event.data.timeLeft;
        document.getElementById("quizTime").innerText = formatTime(timeLeft);
        
        if (socket.readyState === 1) {
            const messageData = JSON.stringify({
                type: "examInProgress",
                socketID: uid,
                currentQuizNo: quizIndex,
                userSocketAnswers: userAnswers,
                quizIndexTimeLeft: timeLeft,
                quizData: questions
            });
            socket.send(messageData);
        }
    } else if (event.data.action === "timeUp") {
        console.log("to next quiz called")
        tonxtQuiz();
    }
};

function startQuizTimer(timeLeft) {
    quizTimerWorker.postMessage({ action: "start", timeLeft });
}

function stopQuizTimer() {
    quizTimerWorker.postMessage({ action: "stop" });
}


function formatTime(seconds) {
    let minutes = Math.floor(seconds / 60);
    let secs = seconds % 60;
    return `${minutes}:${secs < 10 ? "0" : ""}${secs}`;
}



async function collapseExamRoom(){
    try {
            
        const url="https://edutestbackend-wss.onrender.com/removeSocket"
        // const url="http://localhost:1738/removeSocket"
        const response= await fetch(url,{
            method:"POST",
            headers:{
                'Content-type':'application/json'
            },
            body:JSON.stringify({socketID:uid})
        })
        
    } catch (error) {
        console.log(error)
    }
}