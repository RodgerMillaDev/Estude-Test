firebase.auth().onAuthStateChanged((user)=>{
    if(user){
        document.getElementById("navAuth").innerText="Sign Out"

    }else{
        document.getElementById("navAuth").innerText="Sign In"
    }
})