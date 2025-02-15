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
    function logIn() {
        var em = document.getElementById("logEmail").value;
        var pass = document.getElementById("logPass").value;
    
        if (em && pass) {
            document.getElementById("authBtnLog").style.display = "none";
            document.getElementById("authBtnLoderLog").style.display = "flex";
    
            firebase.auth().signInWithEmailAndPassword(em, pass)
                .then((userCred) => {
                    var user = userCred.user;
                    console.log(user);
                    // window.location.href='index.html'
                })
                .catch((error) => {
                    document.getElementById("authBtnLog").style.display = "block";
                    document.getElementById("authBtnLoderLog").style.display = "none";
                    
                    var errCode = error.code; 

    
                    if (errCode === "auth/invalid-email" || errCode === "auth/wrong-password") {
                        Swal.fire({
                            title: "Invalid email or password",
                            icon: "error",
                            draggable: false
                        });
                    }
                });
        } else {
            Swal.fire("Hhmmm, seems like something is missing");
        }
    }
    


    function SignUp(){
        var fn=document.getElementById("signFullname").value;
        var em=document.getElementById("signEmail").value;
        var pass=document.getElementById("signPass").value;
        var cpass=document.getElementById("signCPass").value;

        if(fn && em && pass && cpass){
            if(pass===cpass){
                firebase.auth().createUserWithEmailAndPassword(em,pass).then((user)=>{
                   var userId=user.uid
                   console.log(uid)

                }).catch((error)=>{
                    console.log(error)
                    if(error.code=="auth/email-already-in-use"){
                        Swal.fire({
                            title: "Email already in use",
                            icon: "warning",
                            draggable: false
                        });
                    }

                }
            )

            }else{
                Swal.fire("Your passwords don't match")
            }
        }else{
            Swal.fire("Hhmmm, seems like something is missing")
        }
    }