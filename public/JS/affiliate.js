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
function fromAff() {
  if (uid !="") {
    const affLink = document.getElementById("affLink").value.trim();
    const expectedDomain = "https://estudetest.web.app/checkout.html";
    const parts = affLink.split("?");
    if (
      parts.length === 3 &&
      parts[0] === expectedDomain &&
      parts[1].trim() !== "" && // Title
      parts[2].trim() !== ""    // Random string
    ) {
      const title = parts[1].trim();
      const newUrl = `${expectedDomain}?${parts[1]}?${parts[2]}`;
      window.location.href = newUrl;
    } else {
      console.error("Invalid link format");
      Swal.fire("Invalid Link", "Please enter a valid test link.", "error");
    }
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
