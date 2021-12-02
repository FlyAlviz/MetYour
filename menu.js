import { INIT } from "./app.js";
import meteors from "./visualization-js/meteors.js";
import lasers from "./visualization-js/lasers.js";
import players from "./visualization-js/players.js";
import backgrounds from "./visualization-js/backgrounds.js"
import { getLocalStorage, defaultLS } from "./localStorage.js";

Object.defineProperty(HTMLImageElement.prototype, "relativeSrc", {
  get: function relativeSrc() {
    return '.' + new URL(this.src).pathname;
  }
});

const html = (s) => s[0];

const ENUJF388 = {
  'meteor':meteors,
  'laser': lasers,
  'player': players,
  'background': backgrounds
}

function listOfImgs(name) {
  name = name.split('-')[1];
  return ENUJF388[name].map(function(element){
    return `./img/${name}s/${element}`  
  })
}



const $modalView = document.querySelector('.modal-view');
const $startUpBtns = Array.from(document.querySelectorAll('button[name=start-up-btn]'));

let VISUAL_BODY_FLAG;

const add_htp = function () {
  document.body.classList.add('htp-open');

}

const remove_htp = function () {
  document.body.classList.remove('htp-open');
}

const add_modal = function () {
  document.body.classList.add('open-modal');
}

const remove_modal = function () {
  document.body.classList.remove('open-modal');
  remove_htp();
  remove_settings_visualization();
  remove_history();
}

const add_settings = function () {
  remove_htp();
}

const add_settings_visualization = function () {
  document.body.classList.add('settings-visualization-open');
}
const remove_settings_visualization = function () {
  document.body.classList.remove('settings-visualization-open');
}

const add_history = function() {
  document.body.classList.add('history-open')
}
const remove_history = function() {
  document.body.classList.remove('history-open')
}

function saveSettingsLocalStorage(e) {
  const input = e.target;
  const small = input.parentElement.querySelector('small');
  small.textContent = `${input.type != 'range' ? '' : input.value}`;

  const pathName = input.dataset.pathname.split('/');
  if(pathName.includes('game-audio')){
    this[pathName[0]][pathName[1]].volume = parseFloat(input.value);
  }
  if(pathName.includes('game-settings') || pathName.includes('player')){
    this[pathName[0]][pathName[1]] = parseFloat(input.value)
  }

  if(pathName.includes('custom-bg')){
    const colorInput = input.parentElement.querySelector('input[type=color]');
    const checkInput = input.parentElement.querySelector('input[type=checkbox]');

    this[pathName[0]][pathName[1]].active = checkInput.checked; 
    this[pathName[0]][pathName[1]].color = colorInput.value; 

    document.documentElement.style.setProperty('--background-url', checkInput.checked ? colorInput.value :`url(${getLocalStorage('game_info').game_visual['visual-background'].src})`)
    small.textContent = colorInput.value;  
  }


  localStorage.setItem('game_info', JSON.stringify(this))

}


const openArg = {
  'htp': {
    name: 'htp', textContent: html`
<button type="button" class="close-btn">
  <ion-icon name="close-outline"></ion-icon>
</button>
<div class="img-magnifier-container">
  <h1>this is how u play the game</h1>
  <img src="./images/keyboard-layout.png" class="modal-big-image-layout" />
</div>`,
    action: add_htp
  },
  'settings': {
    name: 'settings', textContent: html`
    <button type="button" class="close-btn">
  <ion-icon name="close-outline"></ion-icon>
</button>
<header class="settings-header">
  <ul>
    <li class="settings-li-active">
      <button type="button" name="settings-general-btn" class="settings-nav-btn" data-arg="SGT">General</button>
    </li>
    <li>
      <button type="button" name="settings-visualization-btn" class="settings-nav-btn"
        data-arg="SVT">Visual</button>
    </li>
  </ul>
</header>
<article class="settings-content-container">

</article>
 `,
    action: add_settings
  },
  'SGT': () => {
    return `<section class="settings-general-section">
  <h1>SOUND</h1>
  <ul>
    <li>
      <label for="blast-audio"> Blast Audio: </label>
      <input type="range" name="blast-audio" min="0" step="0.01" max="1" value="${getLocalStorage('game_info')['game-audio']['blast-audio'].volume}" data-pathName="game-audio/blast-audio"/>
      <small>${getLocalStorage('game_info')['game-audio']['blast-audio'].volume}</small>
      </li>
      <li>
      <label for="laser-shoot-audio"> Laser shoot Audio:</label>
      <input type="range" name="laser-shoot-audio" min="0" step="0.01" max="1" value="${getLocalStorage('game_info')['game-audio']['shoot-audio'].volume}" data-pathName="game-audio/shoot-audio"/>
      <small>${getLocalStorage('game_info')['game-audio']['shoot-audio'].volume}</small>
    </li>
    <li>
      <label for="background-music-settings">Background music</label>
      <input type="range" name="background-music-settings" min="0" step="0.01" max="1" value="${getLocalStorage('game_info')['game-audio']['shoot-audio'].volume}" data-pathName="game-audio/bg-audio"/>
      <small>${getLocalStorage('game_info')['game-audio']['bg-audio'].volume}</small>
    </li>
  </ul>
  <h1>PLAYER</h1>
  <ul>
    <li>
      <label for="player-acceleration">Player Acceleration</label>
      <input type="range" name="player-acceleration" min="0.1" step="0.1" max="300" value="${getLocalStorage('game_info').player['acceleration']}" data-pathName="player/acceleration"/>
      <small>${getLocalStorage('game_info').player['acceleration']}</small>
    </li>
  </ul>
  <h1>GAME</h1>
  <ul>
    <li>
      <label for="game-maxScore-settings">Max score</label>
      <input type="range" name="game-maxScore-settings" min="5" max="200" value="${getLocalStorage('game_info')['game-settings']['max-score']}" data-pathName="game-settings/max-score"/>
      <small>${getLocalStorage('game_info')['game-settings']['max-score']}</small>
    </li>
    <li>
      <label for="game-upgradeLevel-settings">Upgrade Level</label>
      <input type="range" name=game-upgradeLevel-settings min="5" max="200" value="${getLocalStorage('game_info')['game-settings']['upgrade-score']}" data-pathName="game-settings/upgrade-score"/>
      <small>${getLocalStorage('game_info')['game-settings']['upgrade-score']}</small>
    </li>
  </ul>
  <h1>CUSTOM VISUAL</h1>
  <ul> 
  <li>
  <label for="custom-background-color">Custom Background Color</label>
  <input type="checkbox" name="custom-bg-check" data-pathName="custom-visual/custom-bg" ${getLocalStorage('game_info')['custom-visual']['custom-bg'].active ? 'checked' : ''}>  <br>
  <input type="color" name="custom-background-color" data-pathName="custom-visual/custom-bg" value="${getLocalStorage('game_info')['custom-visual']['custom-bg'].color}">
  <small>${getLocalStorage('game_info')['custom-visual']['custom-bg'].color}</small>
  </li>
  </ul>
  <button name="gen-default-btn">Set all settings to default</button>
</section>`
  },
  'SVT': () => {
    return `<header>
    <ul class="nav-bodies-of-arena">
      <li><button type="button" name="visualization-bodies-btn" data-type="visual-background">Background</button></li>
      <li><button type="button" name="visualization-bodies-btn" data-type="visual-meteor">Meteor</button></li>
      <li><button type="button" name="visualization-bodies-btn" data-type="visual-laser">Laser</button></li>
      <li class="bodies-li-active"><button type="button" name="visualization-bodies-btn"
          data-type="visual-player">Player</button></li>
    </ul>
  </header>
  <article class="img-list">
    <ul>
    </ul>
  </article>`
  },
'history': {
  name: 'history',
  textContent: `
<button type="button" class="close-btn">
<ion-icon name="close-outline"></ion-icon>
</button>
 
         <button type="button" class="close-btn">
         <ion-icon name="close-outline"></ion-icon>
       </button>

       <section>
         <h1>Info</h1>
         <ul>
           <li>Games: <span>${getLocalStorage('game_info').gamePlay_info.length}</span></li>
         </ul>
       </section>

       <section class="container-data column-data">
         <div class="layout-btn-container">
           <button class="layout-btn active" name="column-data">Column</button>
         <button class="layout-btn" name="grid-data">Grid</button>
         </div>
         <section class="container-of-article">
         
         </section>
       </section>

    
       </section>
   `,
  action: add_history
}
}
;


function openModal(select) {
  const promise = new Promise((resolve, reject) => {
    if (select != 'start') {
      const elInHTML = openArg[select];
      if(select == 'history'){
        if(!getLocalStorage('game_info')['gamePlay_info'].length){
          elInHTML.textContent = `
          <button type="button" class="close-btn">
          <ion-icon name="close-outline"></ion-icon>
          </button>
          <small>no games yet</small>
          `
        }
      }
      add_modal();
      elInHTML.action();
      $modalView.innerHTML = elInHTML.textContent;
      resolve(select)
      return
    }
    
    INIT();
    resolve()
  })
  promise.then((select) => {
 
    if (select) {
      const funcx = function (e) {
        if (e.target.classList.contains('modal-view-container')) {
          window.removeEventListener('click', funcx)
          remove_modal();
        }
      }
      window.addEventListener('click', funcx)
      const $closeBtn = document.body.querySelector('.close-btn');
      $closeBtn.onclick = remove_modal;
      if(select == 'settings') {
        SETTINGS_FUNCTION();
      }
      if(select == 'history'){
        HISTORY_FUNCTION()
      }
    }
  })
}

function GetFormat(unix){
  this.unix = unix;
}
GetFormat.prototype.get12Hours = function() {
  this.date = new Date(this.unix)
  this.meridiem = this.date.getHours() > 12 ? 'pm' : 'am',
  this.hours = this.date.getHours() % 12,
  this.minutes = this.date.getMinutes(),
  this.seconds = this.date.getSeconds()
  this.formatTime = `${this.hours}:${this.minutes}:${this.seconds} ${this.meridiem}`,
  this.day = this.date.getDate(),
  this.month = this.date.getMonth(),
  this.year = this.date.getFullYear()
  this.formatDate = `${this.year}/${this.month}/${this.day}`,
  this.format = `${this.formatDate} ${this.formatTime}`
}

function HISTORY_FUNCTION() {
  const $container = document.querySelector('.container-of-article');
  const $containerData = document.querySelector('.container-data');
  const $layoutBtns = Array.from(document.querySelectorAll('.layout-btn'));

  let PREV_BTN_FLAG;
  $layoutBtns.forEach((btn) => {
    if(btn.classList.contains('active')){
      $containerData.classList.add(btn.name);
      PREV_BTN_FLAG = btn;
    }
    
    btn.addEventListener('click', function() {
      PREV_BTN_FLAG.classList.remove('active')
      this.classList.add('active')
      $containerData.classList.remove(PREV_BTN_FLAG.name);
      $containerData.classList.add(this.name);
      PREV_BTN_FLAG = this;
      
    })
  })
  const items = getLocalStorage('game_info')['gamePlay_info'];
  if(items.length){
    $container.innerHTML = items.map((data,index) => {
      const D1 = new GetFormat(data["date-initialized"]);
      D1.get12Hours()
      const D2 = new GetFormat(data["date-finished"])
      D2.get12Hours()
      const FS = data["final-score"];
      const TS = data["times-shoot"];
      const ST = data["status"];
      const TG = data["target-score"];
      const UL = data["upgrade-level"];
      const PA = data["player-acceleration"]
      const seconds = Math.abs((D2.unix - D1.unix) / 1000);
      const html = `<article class="article-container">
      <header class="data-title">GAME 1</header>
      <section class="gameInf-container">
        <section class="gameInf-1">
          <ul>
            <li>Game Duration:<span class="answer"> ${seconds} seconds</span></li>
            <li>Start: <span class="answer"> ${D1.format}</span</li>
            <li>Finish: <span class="answer"> ${D2.format}</span</li>
            <li>Status: <span class="answer"> ${ST}</span</li>
          </ul>
        </section>
        <section class="gameInf-2">
          <ul>
            <li>Final Score: <span class="answer"> ${FS}</span</li>
            <li>Upgrade Level:<span class="answer"> ${UL}</span</li>
            <li>Target Score: <span class="answer"> ${TG}</span</li></li>
          </ul>
        </section>
        <section class="gameInf-3">
          <ul>
            <li>Laser shoot:<span class="answer"> ${TS} </span</li>
            <li>Player Acceleration:<span class="answer"> ${PA}</span</li>
          </ul>
        </section>
      </section>
    </article>`
    return html
  }).join("")
  return
  }
}

function SETTINGS_FUNCTION() {
  const $settingsNavBtn = Array.from(document.querySelectorAll('.settings-nav-btn'));
  const $settingsContentContainer = document.querySelector('.settings-content-container');
  $settingsNavBtn.forEach((btn) => {
    if (btn.parentElement.classList.contains('settings-li-active')) {
      $settingsContentContainer.innerHTML = openArg[btn.dataset.arg]();
    }
    SETTINGS_FORM_FUNCTION()
    btn.onclick = function (e) {
      $settingsNavBtn.forEach(btn => btn.parentElement.classList.remove('settings-li-active'));
  
      this.parentElement.classList.add('settings-li-active');

      $settingsContentContainer.innerHTML = openArg[this.dataset.arg]();

      if (this.name == 'settings-visualization-btn') {
        add_settings_visualization();
        const $visualBtns = Array.from(document.querySelectorAll('button[name=visualization-bodies-btn]'));
        const $displayContainer = document.querySelector('.img-list > ul');
        $visualBtns.forEach((btn) => {
          VISUAL_BODY_FLAG = btn.dataset.type;
          $displayContainer.innerHTML = listOfImgs(btn.dataset.type).map((img, index) => {
            var imgIdDisplay = getLocalStorage('game_info').game_visual[btn.dataset.type].id;
            var imgTextContent = `<li class=${imgIdDisplay == index ? 'display' : ''}>
            <img src="${img}" alt="${img}" data-id="${index}"/>
            </li>`
            return imgTextContent
          }).join('');

          var $listImgs = Array.from($displayContainer.querySelectorAll('ul > li'));
          $listImgs.forEach((li) => {
            li.onclick = liCLICKFunction
          })
          btn.onclick = function () {
            $visualBtns.forEach((btn) => btn.parentElement.classList.remove('bodies-li-active'))
            this.parentElement.classList.add("bodies-li-active");
            VISUAL_BODY_FLAG = this.dataset.type;
            $displayContainer.innerHTML = listOfImgs(this.dataset.type).map((img, index) => {
              var imgIdDisplay = getLocalStorage('game_info').game_visual[this.dataset.type].id;
              var imgTextContent = `<li class=${imgIdDisplay == index ? 'display' : ''}>
              <img src="${img}" alt="${img}" data-id="${index}"/>
              </li>`
              return imgTextContent
            }).join('');
            var $listImgs = Array.from($displayContainer.querySelectorAll('ul > li'));
            $listImgs.forEach((img) => {
              img.onclick = liCLICKFunction
            })
          }
          function liCLICKFunction() {
            var $listImgs = Array.from($displayContainer.querySelectorAll('ul > li'));
            var $activeBtn = document.querySelector('.bodies-li-active');
            $listImgs.forEach(li => li.classList.remove('display'))
            this.classList.add('display')
            const img = this.querySelector("img");
            const src = img.relativeSrc;
            const id = parseFloat(img.dataset.id);
            const type = VISUAL_BODY_FLAG;
            const selected = { id, src, type };
            const info = getLocalStorage('game_info');
            info.game_visual[type] = selected;

            localStorage.setItem('game_info', JSON.stringify(info));
            if (type == 'visual-background') {
              document.documentElement.style.setProperty('--background-url', getLocalStorage('game_info')['custom-visual']['custom-bg'].active ? getLocalStorage('game_info')['custom-visual']['custom-bg'].color :`url(${getLocalStorage('game_info').game_visual['visual-background'].src})`)

            }
          }
        })
      }
      if (this.name == 'settings-general-btn') {
        SETTINGS_FORM_FUNCTION()
        remove_settings_visualization();
      }
    }
  })
  return
}


function SETTINGS_FORM_FUNCTION() {
  const inputs = Array.from(document.querySelectorAll(".settings-general-section > ul > li > input"));
  const defaultBtn = document.querySelector('button[name=gen-default-btn]');
  const $settingsContentContainer = document.querySelector('.settings-content-container');
  defaultBtn.addEventListener('click', async function () {
    defaultLS.gamePlay_info = await getLocalStorage('game_info')['gamePlay_info'];
    await localStorage.setItem('game_info', JSON.stringify(defaultLS));
    document.documentElement.style.setProperty('--background-url', getLocalStorage('game_info')['custom-visual']['custom-bg'].active ? getLocalStorage('game_info')['custom-visual']['custom-bg'].color :`url(${getLocalStorage('game_info').game_visual['visual-background'].src})`);
    openModal('settings')
  })
  inputs.forEach((input) => {
    input.addEventListener("input", saveSettingsLocalStorage.bind(getLocalStorage('game_info')));
  })
}

$startUpBtns.forEach((btn) => {
  btn.addEventListener('click', function () {
    openModal(this.dataset.id)
  })
})

