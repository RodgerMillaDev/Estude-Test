
const mainURL=decodeURIComponent(window.location.search)
const urlArray =  mainURL.split("?")
const urlSp=urlArray[1].split("&")
const userID=urlSp[0]
const urlTopic=urlArray[2]
const cleanUrlTopic=urlTopic.split("&")
const actTopic=cleanUrlTopic[0]
var isPaid=false
var signature;

console.log(actTopic)

if(actTopic=='' || actTopic==undefined ||!actTopic){
    window.location.href="index.html"
}

async function checkPayment(){



    var stBtn=document.getElementById("statusBtn").innerText;
    var refCode=localStorage.getItem("refCodePay")
    document.getElementById("statusBtn").style.display="none"
    document.getElementById("cnfPayLoader").style.display="block"
    if(stBtn=="Confirm Payment"){
        try {
        
            // const cfmUrl="https://edutestbackend.onrender.com/trxnStatus"
            const cfmUrl="http://localhost:1738/trxnStatus"
            const response = await fetch(cfmUrl,{
            method:"POST",
            headers:{
                'Content-type':'application/json'
            },
            body:JSON.stringify({refCode})
            })
            const result= await response.json()
            console.log(result)
            if(result.status==false){
                    document.getElementById("statusBtn").innerText="Confirm Payment"
                    document.getElementById("cnfPayLoader").style.display="none"
                    document.getElementById("statusBtn").style.display="block"
                if(result.code==="transaction_not_found"){
                    Swal.fire({
                        title: "You haven't paid",
                        text: "Your transaction is not complete",
                        icon: "error",
                        showCancelButton: true,
                        confirmButtonColor: "#3085d6",
                        cancelButtonColor: "#d33",
                        cancelButtonText: "Check again",
                        confirmButtonText: "Try again"
                      }).then((result) => {
                        if (result.isConfirmed) {
                          window.location.href="checkout.html"
                        }
                      });
                }
                 
            }else if(result.status==true){
                if(result.message=="Verification successful"){
                    var paidAmount = result.data.requested_amount;
                    var datePaid = result.data.transaction_date;
                    signature = result.data.authorization.signature;
                    console.log(signature)
                    isPaid=true;
                    console.log(result)


                    firebase.firestore().collection("Users").doc(userID).update({
                        signature:signature
                    }).then(()=>{

                        document.getElementById("paidDate").innerText=formatDate(paidAmount)
                        document.getElementById("payStatusH4").innerText="Payment Received"
                        document.getElementById("payStatusP").innerText="Proceed to your test"
                        document.getElementById("paymentStatusDate").style.display='flex'
                        document.getElementById("paymentStatusMethod").style.display='flex'
                        document.getElementById("paymentStatusSt").style.display='flex'
                        document.getElementById("cnfPayLoader").style.display="none"
                        document.getElementById("statusBtn").style.display="block"
                        document.getElementById("statusBtn").innerText="Proceed To Test"
                            if (result.isConfirmed && signature) {
    
                                window.location.href="exam.html"+"?"+userID+"?"+isPaid+"?"+signature+"?"+actTopic;    
                                
                            }
                    })

                  
        
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
                        icon: "success",
                        title: `Your $ ${paidAmount} transaction has been received`
                      })
                }

            }
        
        } catch (error) {
            console.log(error)
            document.getElementById("statusBtn").innerText="Confirm Payment"
            document.getElementById("statusBtn").style.display="block"
            document.getElementById("cnfPayLoader").style.display="none"

            Swal.fire("An error occured.Try Again Later")
        }
    }else if(stBtn==="Proceed To Test" && isPaid==true){
        window.location.href="exam.html"+"?"+userID+"?"+isPaid+"?"+signature+"?"+actTopic;    }
   
}


function formatDate(isoString) {
    let date = new Date(isoString);

    let options = {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
    };

    return date.toLocaleString("en-US", options).replace(",", "") + " at " + date.toLocaleString("en-US", { hour: 'numeric', minute: '2-digit', hour12: true }).toLowerCase();
}

