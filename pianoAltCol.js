const keyArray = document.querySelectorAll('key')
console.log(keyArray)
// document.querySelector('#b2').style.background = 'red'

const cMajor = [0, 2, 4, 5, 7, 9, 11, 12, 14, 16, 17, 19, 21, 23, 24, 26, 28, 29, 31, 33, 35, 36]
const dMajor = [1, 2, 4, 6, 7, 9, 11, 13, 14, 16, 18, 19, 21, 23, 25, 26, 28, 30, 31, 33, 35, 36]
let count = 0
let key = cMajor
const binds = new Map()
binds.set('KeyQ', keyArray[key[count++]])
binds.set('KeyA', keyArray[key[count++]])
binds.set('KeyZ', keyArray[key[count++]])
binds.set('KeyW', keyArray[key[count++]])
binds.set('KeyS', keyArray[key[count++]])
binds.set('KeyX', keyArray[key[count++]])
binds.set('KeyE', keyArray[key[count++]])
binds.set('KeyD', keyArray[key[count++]])
binds.set('KeyC', keyArray[key[count++]])
binds.set('KeyR', keyArray[key[count++]])
binds.set('KeyF', keyArray[key[count++]])
binds.set('KeyV', keyArray[key[count++]])
// binds.set('KeyT', keyArray[count++])
// binds.set('KeyG', keyArray[count++])
// binds.set('KeyB', keyArray[count++])
// binds.set('KeyY', keyArray[count++])
// binds.set('KeyH', keyArray[count++])
// binds.set('KeyN', keyArray[count++])
binds.set('KeyU', keyArray[key[count++]])
binds.set('KeyJ', keyArray[key[count++]])
binds.set('KeyM', keyArray[key[count++]])
binds.set('KeyI', keyArray[key[count++]])
binds.set('KeyK', keyArray[key[count++]])
binds.set('Comma', keyArray[key[count++]])
binds.set('KeyO', keyArray[key[count++]])
binds.set('KeyL', keyArray[key[count++]])
binds.set('KeyP', keyArray[key[count++]])
binds.set('Semicolon', keyArray[key[count++]])

//cycle between identical audios to prevent delays:
function Channel(audio_uri) {
	this.audio_uri = audio_uri;
	this.resource = new Audio(audio_uri);
}

Channel.prototype.play = function() {
	// Try refreshing the resource altogether
	this.resource.play();
}

function Switcher(audio_uri, num) {
	this.channels = [];
	this.num = num;
	this.index = 0;

	for (var i = 0; i < num; i++) {
		this.channels.push(new Channel(audio_uri));
	}
}

Switcher.prototype.play = function() {
	this.channels[this.index++].play();
	this.index = this.index < this.num ? this.index : 0;
}

for (let item of keyArray) {
    item.addEventListener('mousedown', keyDown)
}

for (let item of keyArray) {
    item.addEventListener('mouseover', glissando)
}

window.addEventListener('mouseup', keyUp)

let lastKey = null
let pressed = false
function keyDown(e) {
    e.preventDefault()
    lastKey = e.target
	pressed = true
    new Switcher(e.target.firstChild.src, 1).play()
	e.target.style.background = 'white'
}

function keyUp() {
    // lastKey.className === 'wKey' ? lastKey.style.background = 'white' : lastKey.style.background = 'black'
	if (lastKey !== null) lastKey.style.background = 'black'
	pressed = false
}

let lastGliss = null
function glissando(e) {
	if (pressed === true) {
		new Switcher(e.target.firstChild.src, 1).play()
		// lastKey.className === 'wKey' ? lastKey.style.background = 'white' : lastKey.style.background = 'black'
		lastKey.style.background = 'black'
		if (lastGliss !== null) {
			lastGliss.className === 'wKey' ? lastGliss.style.background = 'white' : lastGliss.style.background = 'black'
			lastGliss.style.background = 'black'
		}
		e.target.style.background = 'white'
		lastGliss = e.target
		lastKey = lastGliss
	}
}

//keyboard inputs
window.addEventListener('keydown', e => {
    console.log(e)
    const key = binds.get(e.code)
    key.dispatchEvent(new MouseEvent('mousedown'))
})

window.addEventListener('keyup', e => {
    const key = binds.get(e.code)
    // key.className === 'wKey' ? key.style.background = 'black' : key.style.background = 'white'
	key.style.background = 'black'
	pressed = false
})

let sheets = ['C', 'D', 'E', 'F', 'G', 'A', 'G', 'F', 'E', 'D', 'C']
const garden = document.querySelector('.sheets')
garden.innerHTML = sheets