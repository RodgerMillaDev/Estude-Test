const animationPath ='./Media/logoLoader.json';
const animation = lottie.loadAnimation({
container: document.getElementById('actPreLoader'), 
renderer: 'svg',
loop: true,
autoplay: true,
path: animationPath 
});


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
