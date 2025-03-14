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
                    if(user.emailVerified){
                        window.location.href='index.html'
                    
                    }else{
                            // Email is not verified, prevent sign-in
                        firebase.auth().signOut(); // Sign the user out
                        Swal.fire({
                            title: "Email Not Verified",
                            text: "Please verify your email before signing in.",
                            icon: "warning",
                            confirmButtonText: "Resend Verification Email",
                        }).then((result) => {
                            if (result.isConfirmed) {
                            // Resend verification email
                            user.sendEmailVerification().then(() => {
                                Swal.fire("Verification email sent. Please check your inbox.");
                            });
                            }
                        });
           
                    }
                })
                .catch((error) => {
                    document.getElementById("authBtnLog").style.display = "block";
                    document.getElementById("authBtnLoderLog").style.display = "none";
                    
                    var errCode = error.code; 
                    console.log(error)

    
                    if (errCode === "auth/invalid-email" || errCode === "auth/wrong-password" || errCode === "auth/internal-error") {
                        Swal.fire({
                            title: "Invalid email or password",
                            icon: "error",
                            draggable: false
                        });
                    }else{
                        console.log(error)
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

                    user.sendEmailVerification().then(function() {

                        firebase.firestore().collection("Users").doc(user.uid).set({
                            name:fn,
                            em:em,
                            uid:user.uid
                        }).then(()=>{
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
                              title: "Signed Up successfully. Verification email sent."
                          }).then(()=>{
                            document.getElementById("authBtnSign").style.display = "block";
                            document.getElementById("authBtnLoderSign").style.display = "none";
                              Swal.fire("Verification email sent. Please check your inbox.").then(()=>{
                                toLogIn()
                              })
                            
            
                          }) 
            
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
    

          
          const db=firebase.firestore()


          function contWithGoogle() {
              var provider = new firebase.auth.GoogleAuthProvider(); 
            
              firebase.auth()
                .signInWithPopup(provider)
                .then((result) => {
                  /** @type {firebase.auth.OAuthCredential} */
                  var user = result.user;
                  var photoURL=user.photoURL
                  var displayName=user.displayName
                  var email=user.email
                  var uid=user.uid
                  db.collection("Users").doc(uid).get().then((doc)=>{
                    if(doc.exists){
                      window.location.href="index.html"
          
                    }else{
          
                      db.collection("Users").doc(user.uid).set({
                        name:displayName,
                        em:email,
                        uid:user.uid
          
                    }).then(()=>{
                        window.location.href="index.html"
                    })
                    }
          
                  })
          
            
                
                })
                .catch((error) => {
                  var errorCode = error.code;
                  var errorMessage = error.message;
                  Swal.fire(errorMessage)
                  var email = error.email; // The email of the user's account used.
                  var credential = error.credential; // The firebase.auth.AuthCredential type that was used.
                    console.error("Error during sign-in:", errorCode, errorMessage);
                });
            }


            
