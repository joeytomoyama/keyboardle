const major = [0, 2, 4, 5, 7, 9, 11, 12, 14, 16, 17, 19, 21, 23, 24, 26, 28, 29, 31, 33, 35, 36]
const minor = [0, 2, 3, 5, 7, 8, 10, 12, 14, 15, 17, 19, 20, 22, 24, 26, 27, 29, 31, 32, 34, 36]
const legend = ['S', 'X', 'E', 'D', 'C', 'R', 'F', 'V', 'T', 'G', 'B', 'Y', 'H', 'N', 'U', 'J', 'M', 'I', 'K', 'O', 'L', 'P']
const piano = [
    'C1', 'D1', 'E1', 'F1', 'G1', 'A1', 'B1',
    'C2', 'D2', 'E2', 'F2', 'G2', 'A2', 'B2',
    'C3', 'D3', 'E3', 'F3', 'G3', 'A3', 'B3',
    'C4'
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
function findId(key) {
    return idArr[key]
}

startArr = arrayMaker('F2 C3 A2 A2 G2 F2 F2 B2 A2 A2 G2 G2 F2 F2 C3 A2 A2 G2 F2 F2 D2 C2 F2 F2 C3 A2 A2 G2 G2 F2 F2 B2 A2 A2 G2 G2 F2 F2 C3 A2 A2 G2 F2 F2 G2 D2 F2 D2 F2 F2 F2 F2 D2 '+
'C2 F2 F2 F2 F2 F2 F2 F2 F2 F2 F2 F2 F2 F2 A2 F2 A2 A2 C3 B2 A2 F2 G2 G2 G2 G2 A2 F2 F2 D2 C2 F2 F2 F2 A2 C3 A2 D3 A2 C3 A2 D3 A2 C3 B2 A2 G2 F2 F2 G2 F2 F2 F2 '+
'F2 F2 F2 F2 F2 F2 F2 F2 A2 F2 F2 F2 D2 D2 D2 A2 F2 F2 D2 F2 F2 F2 D2 F2 F2 F2 A2 A2 F2 F2 D2 F2 F2 F2 D2 F2 F2 F2 A2 A2 C3 B2 C3 D3 F3 A3 F3 F2 F2 G2 F2 A2 G2 '+
'G2 F2 G2 A2 D2 D2 D2 A2 F2 F2 D2 F2 D2 F2 F2 F2 D2')
const ids = startArr.map(findId)
const endArr = new Array()
let count = 0
ids.forEach(id => {
    endArr[count++] = legend[id]
})
console.log(endArr)