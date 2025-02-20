
const deURL= decodeURIComponent(window.location.search)
const SU=deURL.split("?")
const uid= SU[1]


const animationPath ='./Media/logoLoader.json';
const animation = lottie.loadAnimation({
container: document.getElementById('actPreLoader'), 
renderer: 'svg',
loop: true,
autoplay: true,
path: animationPath 
});


firebase.auth().onAuthStateChanged((user)=>{
    if(user){
        document.getElementById("preloader").style.display="none"

        var userID=user.uid
        if(userID === uid){
            const socket= new WebSocket('ws://localhost:1759')
            socket.onopen = () =>{
                socket.send(JSON.stringify({type:'socketAuth', socketID:userID}))
                console.log('user connected')
            }
            socket.onmessage = (wsText) =>{
                 const msgData = JSON.parse(wsText.data)
                 console.log(msgData)
                 if(msgData.type==="socketAuth"){
                    console.log(msgData.status)
                 }else if(msgData.type==='socketQuizSubmit'){
                    
                 }
            }



        }else{
            window.location.href="index.html"
  
        }

    }else{
        window.location.href="index.html"
    }
})


async function generateQuiz(){
    try {
        const bUrl = 'http://localhost:1738/generateQuiz'
        const response = await fetch(bUrl,{
            method:'POST',
            headers: {
                'Content-Type':'application/json'
            },
            body:JSON.stringify({uid:uid})

        })
        console.log("quiz req sent")

        const result = await response.json()
        var questions =result.data
        localStorage.setItem("quizesData",result.data)
        renderQuestions(questions)
    } catch (error) {
         console.log(error)
    }
}




function renderQuestions(questions){
     var deQuiz =''
     questions.forEach(question => {
        var deQ=question.question;
        var opts=question.options;
        var answer=question.answer;
        var quizindex=question.index;
        var quizID=question.id;
        var questionNumber=quizindex + 1;
        var deOpt =''
        opts.forEach((opt)=>{
          deOpt+=`
           <div class="testChoices">
                                <span></span>
                                <p >${opt}</p>
                            </div>
          `
        });

        deQuiz +=`
         <div class="deQuiz">
                    <div class="quizInfo">
                       <p class="quizIndex">${quizindex}</p>
                       <p class="quizId">z${quizID}</p>
                    </div>
                        <div class="testQuestion">
                            <p> ${questionNumber+ ". "+deQ}</p>
    
                        </div>
                        <div class="testChoicesWrap">
                          ${deOpt}
                        </div>
                    </div>
        `
        
     });
     document.querySelector(".deQuizes").innerHTML=deQuiz;




}