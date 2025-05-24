const deURL = decodeURIComponent(window.location.search);
const SU = deURL.split("?");
var uid=SU[1]
var score=parseInt(SU[2])
var topic=SU[3]
var cheat=SU[4]
var perc=score*10;
var userName;
var userEmail;

auth.onAuthStateChanged((user)=>{
    if(user){
        var uid=user.uid
        isAuth= true
        authID=uid
        dbFirestore.collection("Users").doc(authID).get().then((userCred)=>{
             userEmail = userCred.data().em;
             userName = userCred.data().name;
             document.getElementById("certOwner").innerText=userName;

           
       })
    
    }else{
         isAuth=false
    }
})


window.history.pushState(null, "", window.location.href);
window.addEventListener("popstate", function () {
  window.history.pushState(null, "", window.location.href);
});

const progress=perc-100


function getGrade(score) {
    if (score >= 9) return "A";
    if (score === 8) return "A-";
    if (score === 7) return "B+";
    if (score === 6) return "B";
    if (score === 5) return "B-";
    if (score === 4) return "C+";
    if (score === 3) return "C";
    if (score === 2) return "C-";
    if (score === 1) return "D";
    return "E"; // 0 marks
}

document.getElementById("topicTaken").innerText=topic
document.getElementById("circleGrade").innerText=getGrade(score)
document.getElementById("scorePerc").innerText=perc
document.getElementById("percentageValue").textContent=perc+"%"
document.getElementById("progress--circle").style.strokeDashoffset=progress

var userDetQr=uid+"?"+topic+"?"+cheat+"?"+getGrade(score)+"?"+perc;

function getFormattedDate() {
    const today = new Date();
    const day = String(today.getDate()).padStart(2, '0');
    const month = String(today.getMonth() + 1).padStart(2, '0'); // Months are 0-based
    const year = today.getFullYear();

    return `${day}/${month}/${year}`;
}
document.getElementById("certDate").innerText=getFormattedDate()
document.getElementById("certTopic").innerText=topic;
document.getElementById("certGrade").innerText=getGrade(score);

async function downloadCertificate() {
    document.getElementById("qrImage").src = `https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=https://estudetest.com/qrCheck.html?${userDetQr}`;
    const { jsPDF } = window.jspdf;

    const certificate = document.getElementById("certWrap");

    const canvas = await html2canvas(certificate, {
        scale: 2,
        useCORS: true
    });

    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF({
        orientation: "landscape",
        unit: "mm",
        format: "a4"
    });

    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const imgWidth = pageWidth - 20;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    pdf.addImage(imgData, "PNG", 10, (pageHeight - imgHeight) / 2, imgWidth, imgHeight);
    pdf.save("EstudeCert.pdf"); // Not async, so we simulate a short delay

    // Wait a little to ensure file download starts before uploading
    setTimeout(async () => {
        const blob = await fetch(imgData).then(res => res.blob());
        const file = new File([blob], "certificate.png", { type: "image/png" });
        
        // Move Swal.fire here, inside saveToFirebase success
        await saveToFirebase(file);
    }, 500); // 0.5 second delay
}

async function saveToFirebase(file) {
    try {
        const formData = new FormData();
        formData.append("image", file);
        formData.append("userUID", uid);
        formData.append("topicDid", topic);
        formData.append("date", getFormattedDate());
        formData.append("score", score);
        formData.append("grade", getFormattedDate());

        const url = "https://edutestbackend-wss.onrender.com/savePdf";

        const response = await fetch(url, {
            method: "POST",
            body: formData,
        });

        const result = await response.json();
        console.log(result);

        // Show Swal after Firebase saving is successful
        Swal.fire("Success", "Certificate downloaded!", "success").then(() => {
          window.location.href="index.html"
         });

    } catch (err) {
        console.error(err);
        Swal.fire("Error", "Something went wrong saving the certificate.", "error");
    }
}


