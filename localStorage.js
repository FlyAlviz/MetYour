const defaultLS = {
   gamePlay_info: [],
   game_visual: {
      'visual-meteor': {
       id: 0,
       src: './img/meteors/meteor-1.png',
       type: 'visual-meteor'
      },
      'visual-laser': {
       id: 0,
       src: './img/lasers/bullet-purple-1.png',
       type: 'visual-laser'
      },
      'visual-player': {
       id: 0,
      src: './img/players/enemy-black-1.png',
      type: 'visual-laser'
       },
   'visual-background': {
      id: 0,
      src: './img/backgrounds/background-black.png',
      type: 'visual-meteor'
   }
   },
   'game-audio': {
    'shoot-audio':{
       src: './audios/LaserSound.mp3',
       volume: 1,
       loop: false,  
  },
    'bg-audio': {
      src: './audios/BG-music-1.mp3',
      volume: 1,
      loop: true,  
       },
    'blast-audio':{
       src: './audios/Explosion-1.mp3',
       volume: 1,
       loop: false,
    }
  },
  'player': {
     'acceleration': 100,
  },
  'game-settings': {
     'max-score': 40,
     'upgrade-score': 5,
  },
  'custom-visual': {
     'custom-bg': {
        active: false,
        color: '#000000'
     }
  }
}

function getLocalStorage(key) { 
      const info = localStorage.getItem(key)
      ? JSON.parse(localStorage.getItem(key))
      : defaultLS;
      return info;
}


export {getLocalStorage, defaultLS}