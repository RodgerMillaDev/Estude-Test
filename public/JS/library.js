




function toTest(){

   firebase.auth().onAuthStateChanged((user)=>{
    if(user){
        var uid=user.uid
      
        window.location.href='checkout.html'+"?"+uid
        
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

   })
    
}