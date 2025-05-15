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
  if (uid) {
    var affLink = document.getElementById("affLink").value.trim();
    const expectedDomain = "https://estudetest.web.app/checkout.html";

    // Split the link into parts
    const parts = affLink.split("?");
    
    // Validate the format: [base, uid, title]
    if (
      parts.length === 3 &&
      parts[0] === expectedDomain &&
      parts[1].trim() !== "" && // existing UID
      parts[2].trim() !== ""    // title
    ) {
      // Save user info
      localStorage.setItem("EstudeUserID", uid);
      localStorage.setItem("EstudeUserEmail", em);

      // Replace UID with logged-in user's uid
      const newUrl = `${parts[0]}?${uid}?${parts[2]}`;
      console.log("Redirecting to:", newUrl);
      window.location.href = newUrl;
    } else {
      console.error("Invalid link format");
      Swal.fire("Invalid Link", "Please enter a valid test link.", "error");
    }
  } else {
    Swal.fire("Sign In Required", "Kindly sign in to proceed to test", "info");
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
