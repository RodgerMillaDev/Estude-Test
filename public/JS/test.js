const deURL = decodeURIComponent(window.location.search);
const SU = deURL.split("?");
const uid = SU[1];
let userAnswers = [];
console.log(userAnswers)
let urlTopic = SU[4];
let questions;
let quizIndex = 0; // Current question index
let timeLeft = 90; // Each question has 1.5 minutes
let timerInterval;
let isTestCompleted = false;

firebase.auth().onAuthStateChanged((user)=>{
    if(user){

        var userID=user.uid
        if(userID === uid){
            connectionWbSocket(userID)
        }else{
            window.location.href="index.html"
  
        }

    }else{
        window.location.href="index.html"
    }
})
let socket;

function connectionWbSocket(userID) {
    if (socket && socket.readyState === WebSocket.OPEN) {
        console.log("WebSocket already connected. Reusing connection.");
        return;
    }

    console.log("Connecting WebSocket...");
    socket = new WebSocket('ws://localhost:1738'); // Change to your actual WebSocket server

    socket.onopen = () => {
        console.log('WebSocket connected');
        socket.send(JSON.stringify({ type: 'socketAuth', socketID: userID }));
        document.getElementById("testTopicExam").innerText = urlTopic;
        generateQuiz(socket);
        startQuizTimer();
    };

    socket.onmessage = (wsText) => {
        const msgData = JSON.parse(wsText.data);

        if (msgData.type === "socketAuth") console.log(msgData.status);
        if (msgData.type === "socketQuizData") console.log(msgData.status);
        if (msgData.type === "socketQuizSubmit") analyseResult(msgData.dataResult);
        if (msgData.type === "examInProgress"){console.log(msgData.status)};
    };

    socket.onclose = (event) => {
        console.log("WebSocket closed:", event);
        reconnectWebSocket(userID);
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

function closeSocket(){
    if (socket && socket.readyState === WebSocket.OPEN) {
        socket.close(); // Close the WebSocket connection
        console.log("WebSocket connection closed.");
    }
    
}


window.addEventListener("beforeunload", async function () {
    if (socket && socket.readyState === 1) {
        socket.close(); // Close WebSocket on page unload
        console.log("WebSocket connection closed.");

    }
    localStorage.setItem("websocketConnected", "false"); // Reset connection status
});

let awayTimer;

document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
        // User switched tab, start the timer
        awayTimer = setTimeout(() => {
            Swal.fire("Quiz Irregularity", "You have been kicked out due to quiz irregularity!", "error", ).then(()=>{
               
            })
            alert("You have been away for more than 5 seconds!");
        }, 5000);
    } else {
        // User returned, clear the timer
        clearTimeout(awayTimer);
    }
});

async function generateQuiz(socket){
    try {
        // const bUrl = 'https://edutestbackend.onrender.com/generateQuiz'
        const bUrl = 'http://localhost:1738/generateQuiz'
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
    } catch (error) {
         console.log(error)
    }
}


function renderQuestions(questions) {
    var deQuiz = "";
    userAnswers = new Array(questions.length).fill({ answerIndex: null, selectedAnswer: "" }); // Initialize blank answers

    questions.forEach((question) => {
        var deQ = question.question;
        var opts = question.options;
        var quizindex = question.index;
        var quizID = question.id;
        var questionNumber = quizindex + 1;
        var deOpt = "";

        opts.forEach((opt, optIndex) => {
            deOpt += `
                <div class="testChoices" onclick="sltAnswer(${quizindex}, ${optIndex}, '${opt}')">
                    <span></span>
                    <p>${opt}</p>
                </div>
            `;
        });

        deQuiz += `
            <div class="deQuiz">
                <div class="quizInfo">
                    <p class="quizIndex">${quizindex}</p>
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
    socket.send(JSON.stringify({type:"socketQuizData", socketQuizData:questions,socketID:uid,userSocketAnswers:""}))

}


function sltAnswer(questionIndex, answerIndex, selectedAnswer) {
    // Store the selected answer
    userAnswers[questionIndex] = {
        questionIndex,
        answerIndex,
        selectedAnswer
    };

    console.log(userAnswers); // Check the selected answers
}

function analyseResult(testResult){
    var exmCheat=false;
    const ticks=testResult.filter(c =>c.isCorrect).length;
    console.log("RESULT:" + `${ticks}/10`)
    setTimeout(() => {
        localStorage.setItem("ticks",ticks)
        window.location.href="result.html"+"?"+uid+"?"+ticks+"?"+urlTopic+"?"+exmCheat
    }, 4000);

}

function tonxtQuiz(){

  var quizes=document.querySelectorAll(".deQuiz")
  var quizesWrap=document.querySelector(".deQuizes")
  if(quizIndex < quizes.length -1){
    quizIndex++;
    const offset = -quizIndex* 100 + '%'
    quizesWrap.style.transform=`translateY(${offset})`
    startQuizTimer()
  
  }
  if(quizIndex==8){
    document.getElementById('nextBtnQuiz').innerText="Submit";
  }
  if(quizIndex+1 == quizes.length){
    console.log('no more test')
    submitTest()
  }


}


function submitTest(){
    document.getElementById("makingResult").style.display="flex"
  socket.send(JSON.stringify({type:"socketQuizSubmit", socketQuizSubmitTest:userAnswers,socketQuizData:questions}))
}


document.querySelector(".deQuizes").addEventListener("click", function (event) {
    if (event.target.closest(".testChoices")) {

        // Remove the "sltChoiceUser" class from all choices
        document.querySelectorAll(".testChoices").forEach((c) => c.classList.remove("sltChoiceUser"));

        // Add the class to the clicked element
        event.target.closest(".testChoices").classList.add("sltChoiceUser");
    }
});


function startQuizTimer() {
    clearInterval(timerInterval);
    timeLeft = 90; // Reset time for the current question
    const timerDisplay = document.getElementById("quizTime"); // Ensure you have an element for this
    timerInterval = setInterval(() => {
        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            tonxtQuiz();
            return;
        }
        timeLeft--;
        if (socket.readyState === 1) { 
            const messageData = JSON.stringify({
                type: "examInProgress",
                socketID: uid,
                currentQuizNo: quizIndex,
                userSocketAnswers: userAnswers,
                quizIndexTimeLeft: formatTime(timeLeft)
            });
            
            socket.send(messageData);
        } else {
            console.log("WebSocket not open. Current state:", socket.readyState);
        }
        
        timerDisplay.innerText = formatTime(timeLeft);
        
    }, 1000);
}

function formatTime(seconds) {
    let minutes = Math.floor(seconds / 60);
    let secs = seconds % 60;
    return `${minutes}:${secs < 10 ? "0" : ""}${secs}`;
}


