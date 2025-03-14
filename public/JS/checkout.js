const deURL= decodeURIComponent(window.location.search)
const SU=deURL.split("?")
const uid= SU[1]
const urlTopic= SU[2]
var offUID=localStorage.getItem("EstudeUserID")
var offEmail=localStorage.getItem("EstudeUserEmail")
document.getElementById("payEmailAdress").value=offEmail;

if(uid !=offUID){
    Swal.fire("Error! Incorrect credentials").then(()=>{
        window.location.href='library.html'

    })
}

if(urlTopic=='' || undefined){
   window.location.href='library.html'
}else{
    document.getElementById("checkoutTopic").innerText=urlTopic;
    document.getElementById("checkoutTopicMini").innerText=urlTopic;

}

if(uid==""){
    window.location.href="index.html"
}else{

}

async function payNow(){
    var payEmail = document.getElementById("payEmailAdress").value;


        if(payEmail!=''){
            try{
                document.getElementById("checkoutPayNow").style.display="none"
                document.getElementById("checkoutPayFeeLoader").style.display="block"
                // var url ="https://edutestbackend.onrender.com/payTest"
                var url ="http://localhost:1738/payTest"
                const response = await fetch(url,{

                    method:"POST",
                    headers:{
                        "Content-type":"application/json",
                    },
                    body:JSON.stringify({uid,payEmail})


                })

                    const result= await response.json()
                    if(result.status==true){
                        var accessCode=result.data.accessCode;
                        var refCode=result.data.reference;
                        var authUrl=result.data.authorization_url
                        localStorage.setItem('refCodePay',refCode)
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

