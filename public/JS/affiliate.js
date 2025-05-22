var uid="";
var em="";
let userName;

auth.onAuthStateChanged((user)=>{
    if(user){
         uid =user.uid
        dbFirestore.collection("Users").doc(uid).get().then((doc)=>{
                 var em=doc.data().em;
                 var uid=doc.data().uid;
                 userName = doc.data().name;
;

        })
        

    }else{
    }
})
function fromAff() {
  if (uid !="") {


     Swal.fire({
            title: `Are you ${userName}?`,
            text: `Do you want to continue as ${userName}?`,
            icon: "question",
            showCancelButton: true,
            confirmButtonColor: "#11499E",
            cancelButtonColor: "#11499E", 
            confirmButtonText: "No, sign out",
            cancelButtonText: "Yes, continue",
          }).then((result) => {
               
            if (result.isConfirmed) {
                  auth.signOut().then(() => {
              window.location.href="index.html";    
                }).catch((error) => {
          
                  console.log(error)
                  // An error happened.
                }); 
                // Wrong user 
            } else if (result.dismiss === Swal.DismissReason.cancel) {
           const affLink = document.getElementById("affLink").value.trim();
                  const expectedDomain = "https://estudetest.com/auth.html";
                  const parts = affLink.split("?");
                  if (
                    parts.length === 3 &&
                    parts[0] === expectedDomain &&
                    parts[1].trim() !== "" && // Title
                    parts[2].trim() !== ""    // Random string
                  ) {
                    const newUrl = `${expectedDomain}?${parts[1]}?${parts[2]}`;
                    window.location.href = newUrl;
                  } else {
                    console.error("Invalid link format");
                    Swal.fire("Invalid Link", "Please enter a valid test link.", "error");
                  }
                // Right User
            }
          });   



  } else {
    Swal.fire("Sign In Required", "Kindly sign in to proceed to test", "info").then(()=>{
      window.location.href="auth.html"
    })
  }
}


function pasteLink() {
  const input = document.getElementById("affLink");
  navigator.clipboard.readText()
    .then(text => {
      input.value = text;
    })
    .catch(err => {
      console.error('Failed to read clipboard contents: ', err);
    });
}
