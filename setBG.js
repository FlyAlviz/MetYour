import { getLocalStorage } from "./localStorage.js"

export default function() {
   document.documentElement.style.setProperty('--background-url', getLocalStorage('game_info')["custom-visual"]["custom-bg"].active ? getLocalStorage('game_info')["custom-visual"]["custom-bg"].color : `url(.${getLocalStorage('game_info').game_visual['visual-background'].src})`)
}



