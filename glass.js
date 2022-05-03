const triggerArray = document.querySelectorAll('.trigger')
const labelArray = document.querySelectorAll('.label')

const major = [0, 2, 4, 5, 7, 9, 11, 12, 14, 16, 17, 19, 21, 23, 24, 26, 28, 29, 31, 33, 35, 36]
const minor = [0, 2, 3, 5, 7, 8, 10, 12, 14, 15, 17, 19, 20, 22, 24, 26, 27, 29, 31, 32, 34, 36]
let signature = major
let sheets = ''
let legend = ['S', 'X', 'E', 'D', 'C', 'R', 'F', 'V', 'T', 'G', 'B', 'Y', 'H', 'N', 'U', 'J', 'M', 'I', 'K', 'O', 'L', 'P', '|']
const legendDE = ['S', 'X', 'E', 'D', 'C', 'R', 'F', 'V', 'T', 'G', 'B', 'Z', 'H', 'N', 'U', 'J', 'M', 'I', 'K', 'O', 'L', 'P', '|']
const binds = new Map()
const keySwitch = new Map()
keySwitch.set(major, minor)
keySwitch.set(minor, major)
const bass = new Audio('./notes/bass.mp3')
const stick = new Audio('./notes/sidestick.mp3')		//Source: https://theremin.music.uiowa.edu/MISpiano.html
const stand = document.querySelector('.sheets')
stand.innerHTML = '&nbsp;&nbsp;&nbsp;&nbsp;<-&nbsp;select a song from the side bar'

//set all keys to '.'
function dotKeys() {
	labelArray.forEach(label => {
		label.innerHTML = '-'
	})
}

//set all keys to empty
function emptyKeys() {
	labelArray.forEach(label => {
		label.innerHTML = ''
	})
}

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
	
	for (let i = 0; i < num; i++) {
		this.channels.push(new Channel(audio_uri));
	}
}

Switcher.prototype.play = function() {
	this.channels[this.index++].play();
	this.index = this.index < this.num ? this.index : 0;
}

//mouse input
for (let item of triggerArray) {
	item.addEventListener('mousedown', mouseDown)
}

let lastKey = null
let pressed = false
function mouseDown(e) {
	e.preventDefault()
	target = e.target.parentElement
	sibling = e.target.previousElementSibling
    lastKey = e.target
	pressed = true
    new Switcher(target.firstChild.src, 1).play()
	target.style.background = 'white'
	sibling.style.color = 'black'
}

window.addEventListener('mouseup', mouseUp)

function mouseUp() {
	if (lastKey !== null) {
		lastKey.parentElement.style.background = ''
		lastKey.previousElementSibling.style.color = 'white'
	}
	pressed = false
}

for (let item of triggerArray) {
	item.addEventListener('mouseover', glissando)
}

function glissando(e) {
	if (pressed === true) {
		const parent = e.target.parentElement
		new Switcher(parent.firstChild.src, 1).play()
		lastKey.parentElement.style.background = ''
		lastKey.previousElementSibling.style.color = 'white'
		parent.style.background = 'white'
		e.target.previousElementSibling.style.color = 'black'
		lastKey = e.target
	}
}

//key sig switch buttons
let butCount = 0
const left = document.querySelector('.left')
left.addEventListener('mousedown', () => {
	butCount--
	if (butCount < 0) {
		butCount = 11
	}
	keySig(butCount, signature)
})

const right = document.querySelector('.right')
right.addEventListener('mousedown', () => {
	butCount++
	if (butCount > 11) {
		butCount = 0
	}
	keySig(butCount, signature)
})

//keyboard input TODO: should only be active after clicking on a page
let songSig = 0
const keyCounter = document.querySelector('.counter')
const sigCounter = document.querySelector('.signature')
let code = undefined
window.addEventListener('keydown', e => {
	code = e.code
	if (code === 'KeyZ' && e.key !== 'z') {
		germanify()
	}
	if (code === 'KeyY' && e.key !== 'y') {
		germanify()
	}
	console.log(e.key, e.code)
	switch (code) {
		case 'Space':
			e.preventDefault()
			new Switcher(bass.src, 1).play()
			break;
		case 'Enter':
			e.preventDefault()
			new Switcher(stick.src, 1).play()
			break;
		case 'ArrowLeft':
			e.preventDefault
			butCount--
			if (butCount < 0) butCount = 11
			keySig(butCount, signature)
			break;
		case 'ArrowRight':
			e.preventDefault()
			butCount++
			// TODO: make these if statements a function
			if (butCount > 11) butCount = 0
			keySig(butCount, signature)
			break;
		case 'ArrowDown':
			e.preventDefault()
			signature = keySwitch.get(signature)
			keySig(butCount, signature)
			break;
		case 'ArrowUp':
			e.preventDefault()
			signature = keySwitch.get(signature)
			keySig(butCount, signature)
			break;
		case 'KeyQ':	//CHORDS
			e.preventDefault()
			playChord(chord2)
			break;
		case 'KeyA':
			e.preventDefault()
			playChord(chord3)
			break;
		case 'KeyZ':
			e.preventDefault()
			playChord(chord4)
			break;
		case 'Digit1':
			e.preventDefault()
			playChord(chord1)
			break;
		default:
			const key = binds.get(code)
			try {
				key.dispatchEvent(new MouseEvent('mousedown'))
			} catch {
				console.error('key not bound')
			}
			if (active && code === 'Key' + sheets[0]) {
				if (!sheets[0]) break
				sheets.shift()
				while (sheets[0] === '|') {
					pipes--
					sheets.shift()
				}
				stand.innerHTML = visSheets(sheets)
			}
	}
	if (active) {
		keyCounter.innerHTML = sheets.length - pipes
	}
})

let german = false
function germanify() {
	german = true
	labelArray.forEach(label => {
		if (label.innerHTML === 'Y') label.innerHTML = 'Z'
	})
	const notice = document.querySelector('.notice')
	notice.innerHTML = 'german keyboard detected'
	notice.classList.add('noticeActive')
}

window.addEventListener('keyup', e => {
	const key = binds.get(e.code)
	try {
		key.parentElement.style.background = ''
		key.previousElementSibling.style.color = 'white'
	} catch {}
	pressed = false
})

//set appropriate labels for given key signature
function keySig(buffer, sig) {
	emptyKeys()
	let overflow = 0
	let relevantArr = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
		0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
	sig.forEach(key => {
		if (key + buffer > triggerArray.length - 2) {
			overflow = 36
		}
		relevantArr[key + buffer - overflow] = 1
	})
	if (relevantArr[0] === 1) relevantArr[relevantArr.length - 1] = 1
	console.log(relevantArr)
	assignSig(relevantArr)
	sigCounter.innerHTML = signatureMaker(buffer, sig)
}

function assignSig(relevantArr) {
	let count = 0
	let legCount = 0
	labelArray.forEach(label => {
		if (relevantArr[count++] === 1) {
			label.innerHTML = legend[legCount++]
		}
	})
	legCount = 0
	for (let i = 0; i < relevantArr.length; i++) {
		if (relevantArr[i]) {
			binds.set('Key' + legend[legCount++], triggerArray[i])
		}
	}
	if (!relevantArr[relevantArr.length - 1]) {
		binds.set('KeyP', undefined)
	}
}

function signatureMaker(num, sig) {
	(sig === major) ? sig = 'major' : sig = 'minor'
	return `${noteArr[num]} ${sig}`
}

function visSheets(sheets) {
	let string = ''
	let char = undefined
	let count = 0
	let i = 0
	if (sheets.length === 0) {
		string = '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;' +
		'&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;good job friend'
	}
	while (count < 21) {
		char = sheets[i]
		if (char === '|') {
			string += char
			count--
		} else if (sheets[i + 1] === '|') {
			string += char
		} else if (!(char === undefined)) {
			string += char + ' '
		}
		count++
		i++
	}
	if (german) string = string.replaceAll('Y', 'Z')
	return string.trim()
}

const pages = document.querySelectorAll('.page')
pages.forEach(page => {
	page.addEventListener('click', selectPage)
})

let active = false
function selectPage(e) {
	const target = e.target.id
	active = true
	switch (target) {
		case 'allstar':
			sheets = prepareSong(allstarStr)
			keySig(11, major)
			songSig = 11
			keyCounter.innerHTML = sheets.length - pipes
			sigCounter.innerHTML = 'B major'
			break;
		case 'ghost':
			sheets = prepareSong(ghostStr)
			keySig(2, major)
			songSig = 2
			setChords('2b_3f-_3b 2g_3d_3g 2d_3f-_3a 2a_3e_3a')
			keyCounter.innerHTML = sheets.length - pipes
			sigCounter.innerHTML = 'D major'
			break;
		case 'little':
			sheets = prepareSong(littleStr)
			keySig(1, major)
			songSig = 1
			setChords('2a-_3c-_3f 2f-_3c-_3f- 2g-_3c-_3f 2g-_3c-_3f')
			keyCounter.innerHTML = sheets.length - pipes
			sigCounter.innerHTML = 'D flat major'
			break;
		case 'river':
			sheets = prepareSong(riverStr)
			keySig(6, minor)
			songSig = 6
			keyCounter.innerHTML = sheets.length - pipes
			sigCounter.innerHTML = 'A major'
			break;
		case 'lie':
			sheets = prepareSong(lieStr)
			keySig(10, major)
			songSig = 10
			keyCounter.innerHTML = sheets.length - pipes
			sigCounter.innerHTML = 'B flat major'
			break;
		case 'go':
			sheets = prepareSong(goStr)
			keySig(7, major)
			songSig = 7
			setChords('3c_3e_3g 2b_3d_3g 2a_3d_3f- 2b_3e_3g')
			keyCounter.innerHTML = sheets.length - pipes
			sigCounter.innerHTML = 'G major'
			break;
		case 'bluebird':
			sheets = prepareSong(bluebirdStr)
			keySig(9, major)
			songSig = 9
			keyCounter.innerHTML = sheets.length - pipes
			sigCounter.innerHTML = 'A major'
			break;
		case 'still':
			sheets = ['W', 'O', 'O', 'F', '|', '|', '|']//prepareSong(stillStr)
			keySig(9, minor)
			songSig = 9
			keyCounter.innerHTML = sheets.length - pipes
			sigCounter.innerHTML = 'A minor'
			break;
		default:
			sheets = ['S', 'O', 'R', 'R', 'Y']
			keyCounter.innerHTML = 404
			console.error('page not found')
	}
	stand.innerHTML = visSheets(sheets)
}

//sheet music maker
const piano = [
    'C3', 'D3', 'E3', 'F3', 'G3', 'A3', 'B3',
	'C4', 'D4', 'E4', 'F4', 'G4', 'A4', 'B4',
    'C5', 'D5', 'E5', 'F5', 'G5', 'A5', 'B5',
    'C6', '|'
  ]

function arrayMaker(string) {
    return string.trim().split(/\s+/gi)
}

function idNotes() {
    let count = 0;
    const array = new Array()
    piano.forEach(key => {
        array[key] = count++
    })
    return array
}

idArr = idNotes()
let pipes = 0
function findId(key) {
	if(key === '|') pipes++
    return idArr[key]
}

function prepareSong(string) {
	pipes = 0
	const startArr = arrayMaker(string)
	const ids = startArr.map(findId)
	const endArr = new Array()
	let count = 0
	ids.forEach(id => {
		endArr[count++] = legend[id]
	})
	return endArr
}

const noteArr = ['C', 'C sharp', 'D', 'E flat', 'E', 'F', 'F sharp', 'G', 'G sharp', 'A', 'B flat', 'B']
console.log(noteArr)

//chords
const chordNotes = ['2c', '2c-', '2d', '2d-', '2e', '2f', '2f-', '2g', '2g-', '2a', '2a-', '2b', 
					'3c', '3c-', '3d', '3d-', '3e', '3f', '3f-', '3g', '3g-', '3a', '3a-', '3b']

const audioArr = chordNotes.map(note => {
	return new Audio(`./notes/${note}.mp3`)
})
const audioMap = new Array()
for (let i = 0; i < chordNotes.length; i++) {
	audioMap[chordNotes[i]] = audioArr[i]
}

let chord1 = null
let chord2 = null
let chord3 = null
let chord4 = null
let chords = new Array(4)
function setChords(string) {
	string = string.split(/\s/gi)
	if (string.length > 4) {
		console.error('broken chord')
		return
	}
	chords = string.map(chord => {
		return chord.split(/_/gi)
	})
	chord1 = chords[0].map(note => {return audioMap[note]})
	if (chords[1] != undefined) chord2 = chords[1].map(note => {return audioMap[note]})
	if (chords[2] != undefined) chord3 = chords[2].map(note => {return audioMap[note]})
	if (chords[3] != undefined) chord4 = chords[3].map(note => {return audioMap[note]})
}

function playChord(chord) {
	audioArr.forEach(audio => {
		audio.pause()
		audio.currentTime = 0
	})
	chord.forEach(audio => audio.play())
}

//sheet music
const allstarStr = `F4 | C5 A4 A4 G4 F4 F4 B4 | A4 A4 G4 G4 F4 F4 | C5 A4 A4 G4 F4 F4 D4 | C4 F4 F4 |
C5 A4 A4 G4 G4 F4 F4 B4 | A4 A4 G4 G4 F4 F4 | C5 A4 A4 G4 F4 F4 G4 | D4 F4 D4 |
F4 F4 F4 F4 D4 C4 F4 F4 F4 F4 | F4 F4 F4 F4 F4 F4 F4 F4 F4 A4 F4 | A4 A4 C5 B4 A4 F4 G4 G4 G4 G4 |
A4 F4 F4 D4 C4 F4 F4 F4 | A4 C5 A4 D5 A4 C5 A4 D5 A4 C5 | B4 A4 G4 F4 F4 G4 F4 F4 |
F4 F4 F4 F4 F4 F4 F4 F4 F4 | A4 F4 F4 F4 D4 D4 D4 | A4 F4 F4 D4 F4 F4 F4 D4 |
F4 F4 F4 A4 | A4 F4 F4 D4 F4 F4 F4 D4 | F4 F4 F4 A4 | A4 C5 B4 C5 D5 F5 |
G5 F5 F4 F4 G4 F4 | A4 G4 G4 F4 G4 | A4 D4 D4 D4 | A4 F4 F4 D4 F4 D4 F4 F4 F4 D4 |`

const ghostStr = `D4 F4 A4 B4 F4 A4 D4 D4 A4 A4 G4 F4 E4 D4 D4 F4 F4 D4 G4 F4 D4 |
B4 A4 F4 A4 E4 D4 F4 E4 D4 |
B4 A4 F4 A4 E4 D4 F4 E4 D4 |
F4 F4 F4 F4 A4 B4 E4 D4 G4 F4 B4 C5 |
D5 C5 A4 A4 A4 D5 C5 A4 A4 A4 D5 E5 F5 E5 D5 F5 A5 |
B5 F5 A5 D5 D5 A5 A5 G5 F5 E5 D5 D5 F5 F5 D5 |
G5 F5 D5 D5 F5 A5 B5 F5 A5 D5 D5 |
A5 A5 G5 F5 E5 D5 D5 F5 F5 D5 G5 F5 F5 F5 F5 D5 |
G5 F5 D5 B4 A4 F4 A4 E4 D4 F4 E4 D4 |
B4 A4 F4 A4 E4 D4 F4 E4 D4 |`

const riverStr = `A4 G4 A4 G4 A4 E4 A4 D4 A3 C4 A4 G4 A4 G4 A4 E4 A4 D4 A3 C4 A4 G4 A4 A3 G4 A4 A3 E4 A4 A3 D4 A3 |
B3 C4 D4 E4 C4 B3 A3 G3 A3 E3 A3 B3 C4 C4 D4 E4 D4 C4 B3 A3 C4 A4 G4 A4 A3 G4 A4 A3 E4 A4 A3 D4 A3 |
B4 C5 D5 E5 C6 B5 E5 B5 C6 B5 A5 G5 | A5 A4 B4 C5 E4 A4 C5 D5 | E5 E4 C5 D5 C5 B4 A4 B4 A4 G4 |
A5 A4 E5 A4 A5 B5 A5 G5 A5 A4 E5 A4 A5 B5 A5 G5 | A5 B5 C6 B5 A5 G5 B4 A5 B5 A5 G5 |`

const littleStr = `D4 | F4 F4 F4 D4 F4 D4 F4 | A4 | F4 F4 F4 D4 F4 E4 D4 | C4 D4 E4 | F4 F4 F4 D4 F4 D4 F4 | 
A4 | F4 F4 F4 A4 F4 E4 D4 | D4 | F5 F5 F5 E5 E5 F5 E5 D5 D5 | 
D5 E5 F5 E5 D4 | F4 F4 F4 F4 G4 D4 D4 D4 D4 | D4 | 
F5 F5 E5 F5 E5 D5 F5 | D5 F5 F5 E5 D4 D4 | 
F4 F4 F4 G4 D4 D4 D4 D4 | D4 | F5 F5 E5 F5 E5 D5 | 
F5 F5 E5 D4 | F4 F4 F4 F4 G4 D4 D4 D4 | F5 F5 A5 | 
B5 B5 A5 F5 A5 | A5 A5 E5 E5 E5 | F5 F5 E5 D5 D5 | 
F3 F3 F3 F3 F3 | F5 F5 F5 D5 F5 D5 F5 | A5 | F5 F5 F5 D5 F5 E5 D5 | C5 D5 E5 | `

const lieStr = `B4 C5 D5 | B4 B4 D5 E5 | B4 E5 D5 | B4 B4 D5 C5 | 
B4 C5 D5 | B4 B4 B4 D5 E5 | B4 B4 B4 E5 D5 | B4 B4 D5 C5 | 
B4 C5 | D5 B5 B5 D5 E5 | B5 B5 E5 D5 | B5 B5 D5 C5 | 
C6 C6 B4 C5 | D5 B4 B4 D5 E5 | B4 B4 E5 D5 | B4 B4 C5 C5 | 
G5 G5 F5 | `

const goStr  = `A4 B4 A4 G4 | D4 E4 G4 E4 B4 | A4 B4 A4 G4 | D4 E4 G4 E4 B4 | A4 A4 B4 A4 G4 | D4 E4 G4 E4 G4 | 
D5 B4 G4 A4 B4 | B4 | A4 B4 A4 G4 | B4 B4 A4 B4 A4 G4 | G4 G4 E4 G4 E4 G4 | A4 B4 A4 G4 | 
A4 A4 G4 B4 A4 A4 | G4 A4 B4 A4 G4 | A4 G4 E4 E4 E4 D4 G4 | G4 | G4 | B4 B4 B4 A4 A4 G4 | G4 G4 E4 G4 E4 G4 | 
A4 B4 A4 G4 | A4 A4 G4 B4 A4 A4 | G4 A4 B4 A4 G4 | A4 G4 E4 E4 E4 D4 G4 | G4 | G4 | A4 G4 B4 A4 A4 G4 | 

B4 B4 B4 B4 B4 A4 G4 G4 | G4 B4 B4 | A4 A4 A4 G4 F4 | F4 E4 B4 A4 G4 | E4 E4 B4 A4 | G4 E4 |     
E4 | B4 B4 B4 B4 B4 A4 G4 | G4 B4 B4 B4 B4 | A4 A4 A4 G4 F4 | F4 B4 B4 B4 B4 | B4 G4 G4 A4 G4 | 
G4 |      B4 B4 B4 B4 A4 G4 | G4 G4 E4 G4 E4 G4 | A4 B4 A4 G4 | A4 A4 G4 B4 A4 A4 | G4 A4 B4 A4 G4 | 
A4 G4 E4 E4 E4 D4 G4 | G4 |      B4 B4 B4 B4 A4 G4 | G4 G4 E4 G4 E4 G4 | A4 B4 A4 G4 | A4 A4 G4 B4 A4 A4 G4 | 
A4 B4 A4 G4 | A4 G4 E4 E4 E4 D4 G4 | G4 |          B4 B4 B4 B4 B4 A4 G4 G4 | G4 B4 B4 | `

const bluebirdStr = `C4 F4 G4 | A4 G4 F4 C4 F4 G4 | A4 B4 A4 B4 C5 C4 F4 G4 | A4 G4 F4 F4 C5 B4 | F4 C5 B4 E4 E4 F4 F4 | 
C4 F4 G4 | A4 C4 A4 G4 F4 E4 F4 A3 B3 C4 C4 C4 C4 | D4 E4 F4 E4 E4 E4 E4 F4 G4 A4 G4 C4 F4 G4 | 
A4 C4 A4 G4 F4 E4 F4 A3 B3 C4 C4 C4 C4 | D4 A4 G4 F4 E4 E4 F4 C4 F4 G4 | A4 A4 G4 A4 G4 C4 G4 A4 | 
B4 B4 A4 G4 F4 F4 A4 B4 C5 F4 A4 B4 C5 C5 E5 D5 C5 | C5 C4 F4 G4 | A4 G4 F4 C4 F4 G4 | 
A4 B4 A4 B4 C5 C4 F4 G4 | A4 G4 F4 F4 C5 B4 | F4 C5 B4 E4 E4 F4 F4 C4 F4 G4 | A4 G4 F4 C4 F4 G4 | 
A4 B4 A4 B4 C5 C4 F4 G4 | A4 G4 F4 F4 C5 B4 | F4 C5 B4 E4 E4 F4 F4 F4 C5 B4 | 
F4 C5 B4 E4 E4 F4 F4 F4 C5 B4 | F4 C5 B4 E4 E4 F4 F4 | `

const stillStr = `C5 E5 A5 C5 E5 A5 C5 E5 A5 C5 E5 A5 C5 E5 A5 C5 E5 A5 C5 E5 A5 C5 E5 A5 
B4 E5 A5 B4 E5 A5 B4 E5 A5 B4 E5 G5 B4 E5 G5 B4 E5 G5 B4 E5 G5 B4 E5 G5 
C5 E5 A5 C5 E5 A5 C5 E5 A5 C5 E5 A5 C5 E5 A5 C5 E5 A5 C5 E5 A5 C5 E5 A5 
B4 E5 A5 B4 E5 A5 B4 E5 A5 B4 E5 G5 B4 E5 G5 B4 E5 G5 B4 E5 G5 B4 E5 G5 `

// const htmlAudios = document.querySelectorAll('audio') //doesn't work because switcher
// function volume(value) {
// 	htmlAudios.forEach(audio => {
// 		audio.volume = value
// 		console.log(audio.volume)
// 	})
// }

keySig(0, major)
setChords('2e_2g_2b 2e_2g_3c 2d_2g_2b 2d_2f-_2a')