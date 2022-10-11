const grid = document.querySelector(".grid");
const doodler = document.createElement('div');
let doodlerLS = 50;
let startPoint = 100;
let doodlerBS = startPoint;
let isGameOver = false;
let platCount = 6;
let platforms = [];
let upTimerID;
let downTimerID;
let isJumping = true;
let isGoingLeft = false;
let isGoingRight = false;
let leftTimerID;
let rightTimerID;
let score = -1;

class Platform {
  constructor(newPlatBottom) {
    this.bottom = newPlatBottom;
    this.left = Math.random() * 315;
    this.visual = document.createElement('div');

    const visual = this.visual;
    visual.classList.add('platform');
    visual.style.left = this.left + 'px';
    visual.style.bottom = this.bottom + 'px';
    grid.appendChild(visual);
  }
}


createPlatforms = () => {
    for (let i = 0; i < platCount; i++) {
      let platGap = 600 / platCount;
      let newPlatBottom = 100 + i * platGap;
      let newPlat = new Platform(newPlatBottom);
      platforms.push(newPlat);
    }
}


movePlatforms = () => {
    if(doodlerBS > 200) {
      platforms.forEach(platform => {
        platform.bottom -= 5;
        let visual = platform.visual;
        visual.style.bottom = platform.bottom + 'px';

        if (platform.bottom < 10) {
          let firstPlat = platforms[0].visual;
          firstPlat.classList.remove("platform");
          platforms.shift();
          let newPlatform = new Platform(600);
          platforms.push(newPlatform);
        }
      });

    }
}

createDoodler = () => {
  grid.appendChild(doodler);
  doodler.classList.add('doodler');
  doodlerLS = platforms[0].left;
  doodler.style.left = doodlerLS + "px";
  doodler.style.bottom = doodlerBS + "px";
}

jump = () => {
    clearInterval(downTimerID);
    isJumping = true;
    score++;
    upTimerID = setInterval(() => {
    doodlerBS += 10;
    doodler.style.bottom = doodlerBS + 'px';
    if (doodlerBS > startPoint + 200) {
      fall();
    }
  } , 20)
}

fall = () => {
  clearInterval(upTimerID);
  isJumping = false;
  downTimerID = setInterval(() => {
    doodlerBS -= 5;
    doodler.style.bottom = doodlerBS + 'px';
    if (doodlerBS <= 0) {
      gameOver();
    }

    platforms.forEach(platform => {
      if (
        (doodlerBS >= platform.bottom) &&
        (doodlerBS <= platform.bottom + 15) &&
        ((doodlerLS + 60) >= platform.left) &&
        (doodlerLS <= (platform.left + 85)) &&
        !isJumping
      ) {
        startPoint = doodlerBS;
        jump();
      }
    });

  } , 25)
}

moveLeft = () => {
  if (isGoingRight) {
    clearInterval(rightTimerID);
    isGoingRight = false;
  }
  isGoingLeft = true;
  leftTimerID = setInterval(() => {
    if (doodlerLS >= 0) {
      doodlerLS -= 4;
      doodler.style.left = doodlerLS + 'px';
    } else moveRight();
  } , 15)
}

moveRight = () => {
  if (isGoingLeft) {
    clearInterval(leftTimerID);
    isGoingLeft = false;
  }
  isGoingRight = true;
  rightTimerID = setInterval(() => {
     if (doodlerLS <= 320) {
       doodlerLS += 4;
       doodler.style.left = doodlerLS + 'px';
     } else moveLeft();
  } , 15)
}

moveStraight = () => {
  isGoingLeft = false;
  isGoingRight = false;
  clearInterval(leftTimerID);
  clearInterval(rightTimerID);
}

control = (e) => {
  if (e.key === "ArrowLeft") {
    moveLeft();
  } else if(e.key === "ArrowRight") {
    moveRight();
  } else if(e.key === "ArrowUp") {
    moveStraight();
  }

}

refresh = () => {
    window.location.reload();
}

gameOver = () => {
  isGameOver = true;
  while (grid.firstChild) {
    grid.removeChild(grid.firstChild);
  }
  grid.innerHTML = score;
  grid.addEventListener('click' , refresh);
  clearInterval(upTimerID);
  clearInterval(downTimerID);
  clearInterval(leftTimerID);
  clearInterval(rightTimerID);
}

start = () => {
   if(!isGameOver) {
     createPlatforms();
     createDoodler();
     setInterval(movePlatforms , 30);
     jump();
     document.addEventListener('keyup' , control);
   }
 }

start();
