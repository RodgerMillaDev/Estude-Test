const deURL = decodeURIComponent(window.location.search);
const SU = deURL.split("?");
const uid = SU[1];
let userAnswers = [];
let questions;
let quizIndex=0; // Current question index
let timeLeft = 90; // Each question has 1.5 minutes
let timerInterval;
// Initialize the Web Worker
const quizTimerWorker = new Worker("JS/freeQuizWorker.js");

let isTestCompleted = false;
let userID;
    auth.onAuthStateChanged((user)=>{
        if(user){
             userID=user.uid
             generateQuiz()
        }else{
            window.location.href="index.html"
        }
    })



document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
        // User switched tab, start the timer
        awayTimer = setTimeout(() => {
            localStorage.setItem("canDoExams","false")
            localStorage.setItem("cdtReason","Test Irregularity")

            Swal.fire("Test Irregularity", "You have been kicked out due to test irregularity!", "error", ).then(()=>{
               
            }).then(()=>{
                window.location.href="index.html"
            })
            alert("You have been away for more than 5 seconds!");
        }, 5000);
    } else {
        // User returned, clear the timer
        clearTimeout(awayTimer);
    }
});

async function generateQuiz(){
        try {
            const bUrl = 'https://edutestbackend-wss.onrender.com/generateTestQuiz'
            // const bUrl = 'http://localhost:1738/generateTestQuiz'
            const response = await fetch(bUrl,{
                method:'POST',
                headers: {
                    'Content-Type':'application/json'
                },
                body:JSON.stringify({})
    
            })
    
            const result = await response.json()
            console.log(result)
            questions = result.data.map((q, i) => ({ ...q, index: i }));
            renderQuestions(questions)

        } catch (error) {
             console.log(error)
        }
  
}
function renderQuestions(questions) {
    let deQuiz = "";

    questions.forEach((question,index) => {
        let deQ = question.question;
        let opts = question.options;
        let quizIndex = index;
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
    quizIndex=0

    document.querySelector(".deQuizes").innerHTML = deQuiz;
    document.getElementById("preloader").style.display = "none";
    startQuizTimer(timeLeft)  

}
function sltAnswer(questionIndex, answerIndex, selectedAnswer) {
    // Store the selected answer
    userAnswers[questionIndex] = {
        questionIndex,
        answerIndex,
        selectedAnswer
    };


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
    tonxtQuiz()
})

function tonxtQuiz() {
    const quizes = document.querySelectorAll(".deQuiz");
    const quizesWrap = document.querySelector(".deQuizes");
  
    // We're at the last question (index 9) and user clicks "Submit"
    if (quizIndex === quizes.length - 1) {
      document.getElementById("makingResult").style.display = "flex";
  
      const testResults = submitTest();
      const ticks = testResults.filter(c => c.isCorrect).length;
  
      document.getElementById("markingResultP").innerText = `You scored ${getGrade(ticks)}`;
      Swal.fire(`Grade ${getGrade(ticks)}`, `Your score is ${getGrade(ticks)}`, "info").then(() => {
        window.location.href = "index.html";
      });
      return; // Stop here so we don’t slide further
    }
  
    // Move to the next quiz
    quizIndex++;
    const offset = -quizIndex * 100 + '%';
    quizesWrap.style.transform = `translateY(${offset})`;
    console.log("tuko question number " + (quizIndex + 1));
    startQuizTimer(90);
  
    // If we're now on the last question, update the button text
    if (quizIndex === quizes.length - 1) {
      document.getElementById('nextBtnQuiz').innerText = "Submit";
    }
  }
  
function getGrade(ticks) {
    if (ticks >= 9) return "A";
    if (ticks === 8) return "A-";
    if (ticks === 7) return "B+";
    if (ticks === 6) return "B";
    if (ticks === 5) return "B-";
    if (ticks === 4) return "C+";
    if (ticks === 3) return "C";
    if (ticks === 2) return "C-";
    if (ticks === 1) return "D";
    return "E"; // 0 marks
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
        
       
            const messageData = JSON.stringify({
                type: "examInProgress",
                socketID: uid,
                currentQuizNo: quizIndex,
                userSocketAnswers: userAnswers,
                quizIndexTimeLeft: timeLeft,
                quizData: questions
            });
        
    } else if (event.data.action === "timeUp") {
        console.log("to next quiz called")
        tonxtQuiz(quizIndex);
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
setTimeout(() => {
    submitTest()
}, 2000);

function submitTest() {
   return  userAnswers.map((userAnswer) => {
        let question = questions.find(q => q.index === userAnswer.questionIndex);
        if (question) {
            let isCorrect = userAnswer.selectedAnswer === question.answer;
           return{
                questionIndex: userAnswer.questionIndex,
                questionText: question.question,
                selectedAnswer: userAnswer.selectedAnswer,
                correctAnswer: question.answer,
                isCorrect: isCorrect
            };
        } else {
            return { error: "Question not found", questionIndex: userAnswer.questionIndex };
        }
    });
}
        
     
    

