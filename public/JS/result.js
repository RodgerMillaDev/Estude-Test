const deURL = decodeURIComponent(window.location.search);
const SU = deURL.split("?");
console.log(SU)
var uid=SU[1]
var score=parseInt(SU[2])
var topic=SU[3]
var cheat=SU[4]
var perc=score*10;
console.log(score)

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
