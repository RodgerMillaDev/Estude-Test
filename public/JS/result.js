const deURL = decodeURIComponent(window.location.search);
const SU = deURL.split("?");
var uid=SU[1]
var score=parseInt(SU[2])
var topic=SU[3]
var cheat=SU[4]
var perc=score*10;
var userName=localStorage.getItem("userNameEst")
var userEmail=localStorage.getItem("userEmailEst")

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
console.log("Your Grade: " + getGrade(score)); // Output: Your Grade: B+

var userDetQr=uid+"?"+topic+"?"+cheat+"?"+getGrade(score)+"?"+perc;

function getFormattedDate() {
    const today = new Date();
    const day = String(today.getDate()).padStart(2, '0');
    const month = String(today.getMonth() + 1).padStart(2, '0'); // Months are 0-based
    const year = today.getFullYear();

    return `${day}/${month}/${year}`;
}
console.log(userName)
document.getElementById("certDate").innerText=getFormattedDate()
document.getElementById("certOwner").innerText=userName;
document.getElementById("certTopic").innerText=topic;
document.getElementById("certGrade").innerText=getGrade(score);

async function downloadCertificate() {
    document.getElementById("qrImage").src=`https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=https://estudetest.web.app/qrCheck.html?${userDetQr}`
    const { jsPDF } = window.jspdf;

    const certificate = document.getElementById("certWrap");

    // Capture the div as a canvas
    const canvas = await html2canvas(certificate, {
        scale: 2, // Higher scale for better quality
        useCORS: true // Handles external images if any
    });

    const imgData = canvas.toDataURL("image/png");
    const certImage=imgData

    // Initialize jsPDF with landscape mode
    const pdf = new jsPDF({
        orientation: "landscape",
        unit: "mm",
        format: "a4"
    });

    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();

    // Adjust image size to fit the PDF
    const imgWidth = pageWidth - 20;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    pdf.addImage(imgData, "PNG", 10, (pageHeight - imgHeight) / 2, imgWidth, imgHeight);
    pdf.save("EstudeCert.pdf");

        // Convert base64 image to Blob
        const blob = await fetch(imgData).then(res => res.blob());
        const file = new File([blob], "certificate.png", { type: "image/png" });
    saveToFirebase(file)

}
    

   

async function saveToFirebase(file) {
    try {
      const formData = new FormData();
      formData.append("image",file)
      // formData.append("certDet",userDetQr)
      formData.append("userUID",uid)
      formData.append("topicDid",topic)
      formData.append("date",getFormattedDate())
      formData.append("score",score)
      formData.append("grade",getFormattedDate() )
      const url="https://edutestbackend-wss.onrender.com/savePdf"
      // const url="http://localhost:1738/savePdf"
      const response = await fetch(url, {
        method: "POST",
        body: formData,
      });
  
      const result = await response.json();
      console.log(result); // { message: "PDF uploaded successfully", url: "https://..." }
      Swal.fire("Success", "Certificate downloaded!", "success").then(()=>{
        window.location.href="index.html"
      })
  
    } catch (err) {
      console.error(err);
    }
  }


