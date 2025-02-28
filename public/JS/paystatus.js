
const mainURL=decodeURIComponent(window.location.search)
const urlArray = mainURL.split("?")
const urlSp=urlArray[1].split("&")
const userID =urlSp[0]

console.log(userID)


async function checkPayment(){
    var stBtn=document.getElementById("statusBtn").innerText;
    var refCode=localStorage.getItem("refCodePay")
    document.getElementById("statusBtn").style.display="none"
    document.getElementById("cnfPayLoader").style.display="block"
    if(stBtn=="Confirm Payment"){
        try {
        
            const cfmUrl="https://edutestbackend.onrender.com/trxnStatus"
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
                        confirmButtonText: "Pay again"
                      }).then((result) => {
                        if (result.isConfirmed) {
                          window.location.href="checkout.html"
                        }
                      });
                }
                 
            }else if(result.status==true){
                if(result.message=="Verification successful"){
                    var paidAmount = result.data.requested_amount;
                    console.log(paidAmount)
                    Swal.fire({
                        title: "Payment Successful",
                        text: `Your $ ${paidAmount} transaction has been received`,
                        icon: "success",
                        showCancelButton: false,
                        confirmButtonColor: "#3085d6",
                        confirmButtonText: "Ok"
                      }).then((result) => {
                        if (result.isConfirmed) {
                                 window.location.href="test.html"+"?"+userID
                        }
                      });
                    
                }

            }
        
        } catch (error) {
            console.log(error)
        }
    }else if(stBtn==="Proceed To Test"){
           window.location.href="test.html"+"?"+userID
    }
   
}