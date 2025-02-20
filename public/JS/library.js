




function toExam(){

   firebase.auth().onAuthStateChanged((user)=>{
    if(user){
        var uid=user.uid
        console.log(uid)
        window.location.href='test.html'+"?"+uid
    }else{
        console.log("User is not logged in")
    }

   })
    
}