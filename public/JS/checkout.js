function payNow(){
    try{

    
    var cn = 12424343535;
    var cvv = 321;
    var mmyy = 2404;
    var url ="http://localhost:1738/payTest"
    const response = fetch(url,{

        method:"POST",
        headers:{
            "Content-type":"application/json",
        },
        body:JSON.stringify({cn,cvv,mmyy})


    })

    const result=response.json()
    console.log(result)
}catch(err){
    console.log(err)

}
}