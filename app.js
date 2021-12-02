import { getLocalStorage } from "./localStorage.js";
import './menu.js';

document.documentElement.style.setProperty('--background-url', getLocalStorage('game_info')["custom-visual"]["custom-bg"].active ? getLocalStorage('game_info')["custom-visual"]["custom-bg"].color : `url(${getLocalStorage('game_info').game_visual['visual-background'].src})`)

const $arena = document.querySelector('.arena');
const $scoreBoard = document.querySelector('.status');

const KEY_CODE_SPACE = 32;

const KEY_CODE_LEFT = 37;
const KEY_CODE_A = 65;

const KEY_CODE_UP = 38;
const KEY_CODE_W = 87;

const KEY_CODE_RIGHT = 39;
const KEY_CODE_D = 68;

const KEY_CODE_ENTER = 13;

let PLAYER_ACCELERATION = getLocalStorage('game_info')['player']['acceleration'];
let METEOR_ACCELERATION = 60;
let LASER_ACCELERATION = 60;
let LASER_COOLDOWN = 3;

let ARENA_WIDTH =  parseInt(getComputedStyle(document.documentElement).getPropertyValue('--arena-width'));
let PLAYER_WIDTH = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--player-width'));
let METEOR_WIDTH = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--meteor-width'));
let LASER_WIDTH = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--laser-width'));
let BLAST_WIDTH = 200;



let ARENA_HEIGHT = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--arena-height'));
let BLAST_HEIGHT = 100;
let METEOR_HEIGHT;
let LASER_HEIGHT;

let SCORE = 0;
let BG_AUDIO;
let INT_SPAWN; 
let DEFAULT_METEOR_SPAWN = 1000;

let TARGET_SCORE = getLocalStorage('game_info')['game-settings']['max-score'];
let UPGRADE_LEVEL = getLocalStorage('game_info')['game-settings']['upgrade-score'];
const LEVEL_SKIP = UPGRADE_LEVEL;
let WON_FLAG = false;
let START_FLAG = true;



let requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
let cancelAnimationFrame = window.cancelAnimationFrame || window.mozCancelAnimationFrame;
let myReq;

let timeStamp;
let timesShoot = 0;

const GAME_STATE = {
   lastTime: null,
   leftPressed: false,
   rightPressed: false,
   spacePressed: false,
   playerCoolDown: 0,
   playerX: 0,
   playerY: 0,
   meteors: [],
   lasers: []
}


function getBracketAudio(name) {
   const LS = getLocalStorage('game_info')['game-audio'];
   const object = LS[name];
   const audio = new Audio();
   audio.src =  object.src;
   audio.volume = object.volume;
   audio.loop = object.loop;
   return audio;
 }

function clamp(v, min, max) {
   if (v < min) {
     return min;
   } else if (v > max) {
     return max;
   } else {
     return v;
   }
 }

 function rectsIntersect(r1, r2) {
   return !(
     r2.left > r1.right ||
     r2.right < r1.left ||
     r2.top  > r1.bottom ||
     r2.bottom < r1.top
   );
 }

function setPositon($element, x ,y) {
   $element.style.transform = `translate(${x}px, ${y}px)`;
}

function createPlayer() {
   GAME_STATE.playerX =  (ARENA_WIDTH / 2) - (PLAYER_WIDTH / 2);
   let $player = new Image;
   const src =  getLocalStorage('game_info').game_visual['visual-player'].src
   $player.src = src;
   $player.classList.add('player');
   $arena.appendChild($player);

   PLAYER_WIDTH = $player.getBoundingClientRect().width;
   setPositon($player, GAME_STATE.playerX, GAME_STATE.playerY);
}

function createMeteor(x, y) {
   let $meteor = new Image;
   const src = getLocalStorage('game_info').game_visual['visual-meteor'].src;
   $meteor.src =  src;
   $meteor.classList.add('meteor');
   const meteor = { x, y, element:$meteor};
   GAME_STATE.meteors.push(meteor);
   $arena.appendChild($meteor);
   METEOR_WIDTH = $meteor.getBoundingClientRect().width;
   METEOR_HEIGHT = $meteor.getBoundingClientRect().height;
   setPositon($meteor, x, 100)
}


function createLaser(x,y) {
   const Dif = Math.abs(LASER_WIDTH - PLAYER_WIDTH)
   x += Dif/2 ;
   let $laser = new Image;
   const src =  getLocalStorage('game_info').game_visual['visual-laser'].src;
   $laser.src = src;
   $laser.classList.add('laser');
   $arena.appendChild($laser);

   LASER_WIDTH = $laser.getBoundingClientRect().width;
   LASER_HEIGHT = $laser.getBoundingClientRect().height;
   
   const laser = {x,y,element: $laser};
   GAME_STATE.lasers.push(laser)
   setPositon($laser,x,y);
}

function createTemplate(size,x,y) {
   // creates coordinate trace
   const div = document.createElement('div');
   div.classList.add('template')
   div.style.height = `${size}px`;
   div.style.width = `${size}px`;
   div.style.backgroundColor = 'blue';
   div.style.position = 'absolute';
   $arena.appendChild(div)
   template = document.querySelector('.template');
}

function createBlast(x,y) {
   y -= BLAST_HEIGHT / 2;
   x -= Math.abs(PLAYER_WIDTH - BLAST_WIDTH) / 2
   const $blast = document.createElement('video');
   $blast.src = './videos/blue-blast.mp4';
   $blast.classList.add('blast');
   $blast.autoplay = true;
   setPositon($blast, x ,y)
   $blast.onended = () => {
      $blast.remove()
   }
   $arena.appendChild($blast);
   BLAST_WIDTH = $blast.getBoundingClientRect().width;
   BLAST_HEIGHT = $blast.getBoundingClientRect().height;
}


function updateLaser(DT){
   const lasers = GAME_STATE.lasers;
   for(let i = 0; i < lasers.length; i++){
      const laser = lasers[i];
      laser.y -= DT * LASER_ACCELERATION;
      if(laser.y < 0){  
         addShadowAnimationEnd(laser)
      }
      setPositon(laser.element, laser.x, laser.y);

      const r1 = laser.element.getBoundingClientRect();
      const enemies = GAME_STATE.meteors;
      for (let j = 0; j < enemies.length; j++) {
         const enemy = enemies[j];
         if (enemy.isDead) continue;
         const r2 = enemy.element.getBoundingClientRect();
         if (rectsIntersect(r1, r2)) {
            // Enemy was hit
            getBracketAudio('blast-audio').play();
            SCORE++
            createBlast(laser.x,laser.y) 
            destroyElement(enemy);
            destroyElement(laser);
            updateScore()
           break;
         }
      }
   }
   GAME_STATE.lasers = GAME_STATE.lasers.filter(e => !e.isDead);
}


function updateMeteor(DT) {
   const meteors = GAME_STATE.meteors;
   for(let i = 0; i < meteors.length; i++){
      const meteor = meteors[i];
      meteor.y += DT * METEOR_ACCELERATION;
      if(meteor.y > ARENA_HEIGHT - meteor.element.getBoundingClientRect().height){  
         addShadowAnimationEnd(meteor)
      }
     
      setPositon(meteor.element, meteor.x, meteor.y);

      const r1 = meteor.element.getBoundingClientRect();
      const r2 = document.querySelector('.player').getBoundingClientRect();
      if(rectsIntersect(r1,r2)){
         if(!WON_FLAG){
            
            conclusion('defeated')
         }
      }
   }
   GAME_STATE.meteors = GAME_STATE.meteors.filter(e => !e.isDead);
}

function addShadowAnimationEnd(element) {
   element.element.classList.add('impact');
   setInterval(() => {
      destroyElement(element)
   },1000)
}


function updatePlayer(DT) {
   const $player = document.querySelector('.player');
   if(GAME_STATE.leftPressed){
      GAME_STATE.playerX -= DT * PLAYER_ACCELERATION;
   }
   if(GAME_STATE.rightPressed){
      GAME_STATE.playerX += DT * PLAYER_ACCELERATION;
   }

   GAME_STATE.playerX = clamp(
      GAME_STATE.playerX,
      0,
      ARENA_WIDTH - PLAYER_WIDTH
   )

   GAME_STATE.playerY = ARENA_HEIGHT - PLAYER_WIDTH - 20;

   
   if(GAME_STATE.spacePressed && GAME_STATE.playerCoolDown <= 0) {
   timesShoot++
   createLaser(GAME_STATE.playerX, GAME_STATE.playerY);
   GAME_STATE.playerCoolDown = LASER_COOLDOWN;
   getBracketAudio('shoot-audio').play();
   }

   if(GAME_STATE.playerCoolDown > 0){
      GAME_STATE.playerCoolDown -= DT;
   }

   setPositon($player, GAME_STATE.playerX, GAME_STATE.playerY)
}

function update() {
   const currentTime = Date.now();
   const deltaTime = (currentTime - GAME_STATE.lastTime) / 100.0;
   updateLaser(deltaTime)
   updateMeteor(deltaTime)
   updatePlayer(deltaTime)
   GAME_STATE.lastTime = currentTime;
   myReq = requestAnimationFrame(update)
}

function destroyElement(element) {
   element.element.remove()
   element.isDead = true;
   const RANDOM_NUM = randomNumber(0, ARENA_WIDTH - METEOR_WIDTH)
}

function randomNumber(min, max) {
   return Math.random() * (max - min) + min;
}

function meteorSpawn(n,acceleration = METEOR_ACCELERATION) {
   // n = spawning meteor interval in millisecond
   clearInterval(INT_SPAWN);
   METEOR_ACCELERATION = acceleration;
   INT_SPAWN = setInterval(() => {
      const RN = randomNumber(0, ARENA_WIDTH - METEOR_WIDTH)
      createMeteor(RN, 0)
   },n)
}

function laserSpawn(n, acceleration = LASER_ACCELERATION){
   // n = laser cool down multipled in delta time
   LASER_COOLDOWN = n;
}

function onKeyDown(e) {
   if(e.keyCode == KEY_CODE_LEFT || e.keyCode == KEY_CODE_A){
      GAME_STATE.leftPressed = true;
   }
   if(e.keyCode == KEY_CODE_RIGHT || e.keyCode == KEY_CODE_D){
      GAME_STATE.rightPressed = true;
   }
   if(e.keyCode == KEY_CODE_SPACE){
      GAME_STATE.spacePressed = true;
   }
}

function onKeyUp(e) {
   if(e.keyCode == KEY_CODE_LEFT || e.keyCode == KEY_CODE_A){
      GAME_STATE.leftPressed = false;
   }
   if(e.keyCode == KEY_CODE_RIGHT || e.keyCode == KEY_CODE_D){
      GAME_STATE.rightPressed = false;
   }
   if(e.keyCode == KEY_CODE_SPACE){
      GAME_STATE.spacePressed = false;
   }
}

function showScoreBoard() {
   $scoreBoard.innerHTML = `
   <span class="scoreStatus">SCORE:${SCORE} 🔥</span>
   <span class="maxScoreStatus">TARGETSCORE:${TARGET_SCORE} 😬</span>
   <span class="percentageStatus">WINNING:${Math.round((SCORE/TARGET_SCORE) * 100)}% 😳</span>
   
   `; 
}

 async function updateScore() {
    await showScoreBoard()
    if(SCORE == TARGET_SCORE){
      WON_FLAG = true;
      conclusion('won');
   }

   if(SCORE == UPGRADE_LEVEL){
      UPGRADE_LEVEL += LEVEL_SKIP;     
      DEFAULT_METEOR_SPAWN -= DEFAULT_METEOR_SPAWN / 2;
      METEOR_ACCELERATION *= 1.25;
      meteorSpawn(DEFAULT_METEOR_SPAWN, METEOR_ACCELERATION)
   }
}

async function conclusion(status) {
   // status = won/defeated
   await showScoreBoard()
      const item = await getLocalStorage("game_info");
      let id = item.gamePlay_info.length;
      const scoreItem = {
         id,
         'date-initialized': Date.now(),
         'date-finished': timeStamp,
         'final-score': SCORE,
         'times-shoot': timesShoot,
         'status': status,
         'player-acceleration': PLAYER_ACCELERATION,
         'target-score': TARGET_SCORE,
         'upgrade-level': UPGRADE_LEVEL
      };
      await item.gamePlay_info.push(scoreItem);
      await localStorage.setItem("game_info", JSON.stringify(item));
      await BG_AUDIO.pause();
      await alert(`${status == 'defeated' ? 'You have been defeated!' + id : 'You won!'} Score: ${SCORE} `);
      window.location.reload();
}


function INIT() {
   PLAYER_ACCELERATION = getLocalStorage('game_info')['player']['acceleration'];
   TARGET_SCORE = getLocalStorage('game_info')['game-settings']['max-score'];
   UPGRADE_LEVEL = getLocalStorage('game_info')['game-settings']['upgrade-score'];
   $arena.innerHTML = ``;
   GAME_STATE.lastTime = Date.now();
   timeStamp = Date.now();
   $arena.classList.remove('borderChangeColor');
   START_FLAG = false;
   document.body.classList.remove('gameNotStarted');
   BG_AUDIO = getBracketAudio('bg-audio');
   BG_AUDIO.play()
   createPlayer()
   meteorSpawn(DEFAULT_METEOR_SPAWN);
   showScoreBoard();
   myReq = requestAnimationFrame(update)
   window.addEventListener('keyup', onKeyUp)
   window.addEventListener('keydown', onKeyDown)
}




window.addEventListener('load', function() {
   const $loader = document.querySelector('.loader');
   $loader.classList.add('loaded');
   $loader.addEventListener('animationend', () => {
      $loader.remove()
      window.addEventListener('keydown',function(e) {
         if(START_FLAG){
            if(e.keyCode == KEY_CODE_ENTER || e.keyCode == KEY_CODE_SPACE){
               INIT()
            }
         }
      }, false);
   })
})



export {INIT}
