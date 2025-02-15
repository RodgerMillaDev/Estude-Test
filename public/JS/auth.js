function toSignUp(){
    document.getElementById("authState").innerText="Sign Up"
    document.getElementById("logIn").style.display="none"
    document.getElementById("signUp").style.display="flex"
    }
    
    function toLogIn(){
        document.getElementById("authState").innerText="Log In"

      document.getElementById("signUp").style.display="none"
      document.getElementById("logIn").style.display="flex"
    }


    function logIn(){

        var em = document.getElementById("logEmail").value;
        var pass = document.getElementById("logPass").value;

        firebase.auth().signInWithEmailAndPassword(em,pass).then((userCred)=>{
           var user =userCred.user
        }).catch((e)=>{
            var errorCode = error.code;
            var errorMessage = error.message;
        })
        
    }

