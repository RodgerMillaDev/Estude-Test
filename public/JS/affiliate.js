var uid="";
var em="";

auth.onAuthStateChanged((user)=>{
    if(user){
         uid =user.uid
        dbFirestore.collection("Users").doc(uid).get().then((doc)=>{
                 var em=doc.data().em;
                 var uid=doc.data().uid;

        })
        

    }else{
    }
})
function fromAff(){
  if(uid){

    var affLink=document.getElementById("affLink").value;
    localStorage.setItem("EstudeUserID",uid)
    localStorage.setItem("EstudeUserEmail",em)
    // Split on '?'
        let [base, rest] = affLink.split("?");

        // Inject UID between base and the rest
        let newUrl = `${base}?${uid}?${rest}`;
        console.log(newUrl)
        window.location.href=(newUrl)

  }else{
    Swal.fire("Sign In Required", "Kindly sign in to proceed to test", "info")
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
