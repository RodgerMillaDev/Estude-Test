const deURL= decodeURIComponent(window.location.search)
const SU=deURL.split("?")
const uid= SU[1]
const urlTopic= SU[2]

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
        body:JSON.stringify({uid})


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
}

