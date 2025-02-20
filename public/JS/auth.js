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
                    window.location.href='index.html'
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
                document.getElementById("authBtnSign").style.display = "none";
                document.getElementById("authBtnLoderSign").style.display = "flex";
                firebase.auth().createUserWithEmailAndPassword(em,pass).then((userCred)=>{
                    var user = (userCred.user)
                        firebase.firestore().collection("Users").doc(user.uid).set({
                            name:fn,
                            em:em,
                            uid:user.uid
                        }).then(()=>{
                        document.getElementById("authBtnSign").style.display="block"
                        document.getElementById("authBtnLoderSign").style.display="none"
                        const Toast = Swal.mixin({
                            toast: true,
                            position: "top-end",
                            showConfirmButton: false,
                            timer: 4000,
                            timerProgressBar: true,
                            didOpen: (toast) => {
                                toast.onmouseenter = Swal.stopTimer;
                                toast.onmouseleave = Swal.resumeTimer;
                            }
                        });
                        Toast.fire({
                            icon: "success",
                            title: "Signed Up successfully."
                        }).then(()=>{
                            window.location.href="index.html"
                        })
                        })
                 }).catch((error)=>{
                    document.getElementById("authBtnSign").style.display = "block";
                    document.getElementById("authBtnLoderSign").style.display = "none";
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

 async   function resetPass(){
            const { value: email } = await Swal.fire({
              input: "email",
              inputLabel: "Reset Your Password",
              inputPlaceholder: "Enter email"
            });
            if (email) {
              firebase.auth().sendPasswordResetEmail(email)
            .then(() => {
              // Password reset email sent!
              // ..
              Swal.fire('Password reset link sent. Check your email.');
              }) .catch((error) => {
              var errorCode = error.code;
              var errorMessage = error.message;
              Swal.fire('Please try again');
              // ..
            });
            }
          }
    