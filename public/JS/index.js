const animationPath ='./Media/logoLoader.json';
const animation = lottie.loadAnimation({
container: document.getElementById('actPreLoader'), 
renderer: 'svg',
loop: true,
autoplay: true,
path: animationPath 
});

strtBackend()

async function strtBackend() {
  try {
      console.log("Sending request...");
      const url = "https://edutestbackend-wss.onrender.com/Alooo";
      const response = await fetch(url, {
          method: "GET",
          headers: {
              'Content-Type': 'application/json'
          }
      });

      if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const result = await response.json();  // Expecting a JSON response
      console.log(result.message);
  } catch (error) {
      console.error("Error fetching data:", error);
  }
}
window.addEventListener("load",()=>{
    document.getElementById("preloader").style.display="none"
})




const randomX = random(1, 10);
const randomY = random(1, 10);
const randomDelay = random(0, 1);
const randomTime = random(3, 5);
const randomTime2 = random(5, 10);
const randomAngle = random(-10, 10);

const circles = gsap.utils.toArray('.circleColor');
circles.forEach(circle => {
  gsap.set(circle, {
    x: randomX(-1),
    y: randomX(1),
    rotation: randomAngle(-1)
  });

  moveX(circle, 1);
  moveY(circle, -1);
  rotate(circle, 1);
});

function rotate(target, direction) {
  
  gsap.to(target, randomTime2(), {
    rotation: randomAngle(direction),
    // delay: randomDelay(),
    ease: Sine.easeInOut,
    onComplete: rotate,
    onCompleteParams: [target, direction * -1]
  });
}

function moveX(target, direction) {
  
  gsap.to(target, randomTime(), {
    x: randomX(direction),
    ease: Sine.easeInOut,
    onComplete: moveX,
    onCompleteParams: [target, direction * -1]
  });
}

function moveY(target, direction) {
  
  gsap.to(target, randomTime(), {
    y: randomY(direction),
    ease: Sine.easeInOut,
    onComplete: moveY,
    onCompleteParams: [target, direction * -1]
  });
}

function random(min, max) {
  const delta = max - min;
  return (direction = 1) => (min + delta * Math.random()) * direction;
}

function toLibrary(){
  window.location.href="library.html"
}
function toAuth(){
  window.location.href="auth.html"
}



function toHome(){
  window.location.href='index.html'
}

function toFonNav(){
  document.getElementById("fonActNav").style.left="0"
}
function cancelFonNav(){
  document.getElementById("fonActNav").style.left="-102%"

}

function toAffiliation(){
  window.location.href='affiliate.html'

}
function toAbout(){
  window.location.href='index.html#About'
}
// function toReviews(){
//   window.location.href='index.html#Reviews'
// }
function toTrialTest(){
  auth.onAuthStateChanged((user)=>{
    if(user){
      window.location.href='freeTest.html'

    }else{
      Swal.fire("Sign in first to proceed")
    }
  })
}

function toMyAccount(){
  document.getElementById("fonActNav").style.left="-102%"
  document.getElementById("libRight").style.display="none"
  document.getElementById("libLeftTop").style.display="flex"
  document.getElementById("libLeftBtm").style.display="flex"
}
function toListTest(){
  document.getElementById("fonActNav").style.left="-102%"
  document.getElementById("libLeftTop").style.display="none"
  document.getElementById("libLeftBtm").style.display="none"
  document.getElementById("libRight").style.display="block"

}