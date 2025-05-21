
var isAuth=false
var authID=''
var authEmail=''


auth.onAuthStateChanged((user)=>{
    if(user){
        var uid=user.uid
        isAuth= true
        authID=uid
        dbFirestore.collection("Users").doc(authID).get().then((userCred)=>{
            var userEmail = userCred.data().em;
             authEmail = userEmail;
            var userName = userCred.data().name;
            localStorage.setItem("userNameEst",userName)
            localStorage.setItem("userEmailEst",userEmail)
            document.getElementById("libUserName").innerText=userName;
            document.getElementById("libUserEmail").innerText=userEmail;
         
       })
    
    }else{
         isAuth=false
    }
})


async function searchWikipedia() {
  let query = document.getElementById('librarySearch').value.trim();
  if (!query) {
    //   Swal.fire("Please enter a topic!");
      const Toast = Swal.mixin({
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        didOpen: (toast) => {
          toast.onmouseenter = Swal.stopTimer;
          toast.onmouseleave = Swal.resumeTimer;
        }
      });
      Toast.fire({
        icon: "warning",
        title: "Enter a topic to search"
      });
      return;
  }

  let url = `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(query)}&format=json&origin=*`;

  try {
      let response = await fetch(url);
      let data = await response.json();
      displayResults(data.query.search);
  } catch (error) {
      console.error("Error fetching data:", error);
  }
}
async function rndmsearchWikipedia() {
  let query = "PHP coding language";
  if (!query) {
      Swal.fire("Please enter a topic!");
      return;
  }

  let url = `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(query)}&format=json&origin=*`;

  try {
      let response = await fetch(url);
      let data = await response.json();
      displayResults(data.query.search);
  } catch (error) {
      console.error("Error fetching data:", error);
  }
}

function displayResults(results) {
  var smpTopic=''


  if (results.length === 0) {
      document.getElementById("libRightBottomWrap").innerHTML=`
      <div class="noTopicLib">
					<i class="icofont-search-document"></i>

      <p>No related topic found</p>
      </div>
      `
      return;

  }


  results.forEach(item => {
        let cleanSnippet = item.snippet.replace(/<[^>]*>/g, ""); // Remove HTML tags
        let sentences = cleanSnippet.split(/[.!?]+/g).filter(s => s.trim().length > 0); // Split into sentences
        let shortSnippet = sentences.slice(0, 4).join(". ") + "."; // Take first 3 sentences


  
      smpTopic+=`
                     <div class="sampleTopic">
                                <div class="sampPleTopicWrapper">
                                    <div class="smpTopicTop">
                                        <div class="smpTopicTopLeft">
                                             <div class="smpTopicTopLeftIcon">
                                                <i class="fa-solid fa-pen-nib"></i>
                                             </div>
                                             <div class="smpTopicTopLeftTopicName">
                                                <h4>${item.title}</h4>
                                             </div>

                                        </div>
                                        <div class="smpTopicTopRight">
                                            <div class="smpTopicTopRightIcon">
                                                <i class="fa-regular fa-bookmark"></i>
                                            </div>
                                        </div>

                                    </div>
                                    <div class="smpTopicMid">
                                        <p>${shortSnippet}</p>
                                    </div>
                                    <div class="smpTopicBtm">
                                    <p>Level : <span>Intermediate</span></p>
                                        <button onclick="toTest('${item.title}')"> Take Test</button>
                                    </div>
                                </div>
                            </div>
      
      `

  });

  document.getElementById("libRightBottomWrap").innerHTML=smpTopic
}

rndmsearchWikipedia()


function toTest(e){

   if(isAuth){
       
       localStorage.setItem("EstudeUserID",authID)
       localStorage.setItem("EstudeUserEmail",authEmail)
       window.location.href='checkout.html'+"?"+e+"?"+authID

      
   }else{
       const Toast = Swal.mixin({
           toast: true,
           position: "top-end",
           showConfirmButton: false,
           timer: 3000,
           timerProgressBar: true,
           didOpen: (toast) => {
             toast.onmouseenter = Swal.stopTimer;
             toast.onmouseleave = Swal.resumeTimer;
           }
         });
         Toast.fire({
           icon: "warning",
           title: "Sign in to proceed"
         });
   }

   
}



document.addEventListener("keydown",function(event){
    if(event.key==="Enter"){
        searchWikipedia()
    }
})