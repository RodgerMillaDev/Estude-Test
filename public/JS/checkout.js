const deURL= decodeURIComponent(window.location.search)
const SU = deURL.split("?");
let authEmail='';
let urlTopic;
let urlTopicClean;
let clnName;
if (SU.length > 1 && SU[1].trim() !== "") {
auth.onAuthStateChanged((user)=>{
    if(user){
         uid=user.uid
        dbFirestore.collection("Users").doc(uid).get().then((userCred)=>{
            var userEmail = userCred.data().em;
             authEmail = userEmail;
             userName = userCred.data().name;
             clnName=userName;
            localStorage.setItem("userNameEst",userName)
            document.getElementById("payEmailAdress").value=authEmail
       })
    }else{
         isAuth=false;
        window.location.href='library.html'

    }
})
const urlTopicD= SU[1]
urlTopic= SU[1].replace(" ","%20")

urlTopicClean=urlTopicD.replace("%20"," ")
document.getElementById("payEmailAdress").value=authEmail;

if(urlTopic=='' || undefined){
   window.location.href='library.html'
}else{
    document.getElementById("checkoutTopic").innerText=urlTopicClean;
    document.getElementById("checkoutTopicMini").innerText=urlTopicClean;

}


} else {
     window.location.href='library.html'
}

async function payNow(){
    var payEmail = document.getElementById("payEmailAdress").value;
        if(payEmail!=''){
            try{
                document.getElementById("checkoutPayNow").style.display="none"
                document.getElementById("checkoutPayFeeLoader").style.display="block"
                var url ="https://edutestbackend-wss.onrender.com/payTest"
                const response = await fetch(url,{

                    method:"POST",
                    headers:{
                        "Content-type":"application/json",
                    },
                    body:JSON.stringify({uid,payEmail,urlTopic,clnName})
                })

                    const result= await response.json()
                    if(result.status==true){
                        var accessCode=result.data.accessCode;
                        var refCode=result.data.reference;
                        var authUrl=result.data.authorization_url
                        localStorage.setItem('refCodePay',refCode)
                        document.getElementById("checkoutPayNow").style.display="block"
                        document.getElementById("checkoutPayFeeLoader").style.display="none"
                        window.location.href=authUrl
                    }
                            }catch(err){
                                    document.getElementById("checkoutPayNow").style.display="block"
                                    document.getElementById("checkoutPayFeeLoader").style.display="none"
                                    console.log(err)

                            }
            }else{
                Swal.fire("Input your payment email")
            }
 
}

