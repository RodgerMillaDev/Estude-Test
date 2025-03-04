
const deURL= decodeURIComponent(window.location.search)
const SU=deURL.split("?")
const uid= SU[1]
let userAnswers=[];
let questions;

const animationPath ='./Media/logoLoader.json';
const animation = lottie.loadAnimation({
container: document.getElementById('actPreLoader'), 
renderer: 'svg',
loop: true,
autoplay: true,
path: animationPath 
});
 let socket;

firebase.auth().onAuthStateChanged((user)=>{
    if(user){

        var userID=user.uid
        if(userID === uid){
            //  socket= new WebSocket('ws://localhost:1738')
            // socket = new WebSocket('https://edutestbackend-wss-official.onrender.com');

            socket.onopen = () =>{
                socket.send(JSON.stringify({type:'socketAuth', socketID:userID}))
                console.log('user connected')
            }

            socket.onmessage = (wsText) =>{
                 const msgData = JSON.parse(wsText.data)
                 if(msgData.type==="socketAuth"){
                    console.log(msgData.status)
                    generateQuiz(socket)

                 }else if(msgData.type==='socketQuizData'){
                    console.log(msgData.status)

                 }else if(msgData.type==='socketQuizSubmit'){
                    console.log(msgData.status)
                    var testResult=msgData.dataResult

                    analyseResult(testResult)



                 }
               
            }
            socket.onerror = (error) => {
                console.error('WebSocket error:', error);
            };
        }else{
            window.location.href="index.html"
  
        }

    }else{
        window.location.href="index.html"
    }
})


async function generateQuiz(socket){
    try {
        const bUrl = 'https://edutestbackend.onrender.com/generateQuiz'
        const response = await fetch(bUrl,{
            method:'POST',
            headers: {
                'Content-Type':'application/json'
            },
            body:JSON.stringify({uid:uid})

        })

        const result = await response.json()
        questions =result.data
        localStorage.setItem("quizesData",result.data)
        socket.send(JSON.stringify({type:"socketQuizData", socketQuizData:questions}))
        renderQuestions(questions)
    } catch (error) {
         console.log(error)
    }
}




function renderQuestions(questions) {
    
    var deQuiz = "";
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




let quizIndex=0

function tonxtQuiz(){

  var quizes=document.querySelectorAll(".deQuiz")
  var quizesWrap=document.querySelector(".deQuizes")
  if(quizIndex < quizes.length -1){
    quizIndex++;
    const offset = -quizIndex* 100 + '%'
    quizesWrap.style.transform=`translateY(${offset})`

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


function analyseResult(testResult){
    const ticks=testResult.filter(c =>c.isCorrect).length;
    console.log("RESULT:" + `${ticks}/10`)
    setTimeout(() => {
        window.location.href="result.html"
    }, 4000);

}