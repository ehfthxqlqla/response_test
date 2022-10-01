const capture = html2canvas,
startButton = document.querySelector(".js-wait-start"),
backgroundAudio = document.querySelector(".js-bg-audio"),
audio = new Audio("/public/audios/bg_music.mp3"),
muteCheckBox = document.querySelector(".js-mute-audio"),
inputCharacter = document.querySelector(".js-chr"),
responseSpeed = document.querySelector(".js-res-speed"),
end_audio = new Audio("/public/audios/end.mp3"),
wrong_audio = new Audio("/public/audios/wrong.mp3"),
show_result = document.querySelector(".js-show-result"),
container = document.querySelector(".css-container"),
resultPage = document.querySelector(".js-result")

const results = []

const keys_computer = ['Escape', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '-', '=', '\\', 'Backspace', 'Tab', 'q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p', '[', ']', 'CapsLock', 'Enter', 'a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', ';', "'", 'Shift', 'z', 'x', 'c', 'v', 'b', 'n', 'm', ',', '.', '/', 'Control', 'Alt', ' ', 'ArrowLeft', 'ArrowRight', 'ArrowDown', 'ArrowUp']
const keys_user = ['Esc', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '-', '=', '\\', 'Backspace', 'Tab', 'q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p', '[', ']', 'Caps Lock', 'Enter', 'a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', ';', "'", 'Shift', 'z', 'x', 'c', 'v', 'b', 'n', 'm', ',', '.', '/', 'Ctrl', 'Alt', 'SpaceBar', '←', '→', '↓', '↑']

document.addEventListener("click", function() {
    startButton.remove()

    if (!muteCheckBox.checked) {
        audio.volume = 0.3
        audio.loop = true
        audio.play()
    }

    start()
}, { once:true })

show_result.addEventListener("click", function() {
    audio.pause()
    document.onkeydown = null;
    container.remove()

    const resultTitle = document.createElement("h1")
    resultPage.append(resultTitle)
    resultTitle.setAttribute("class", "css-result-title css-white")
    resultTitle.innerText = "반응속도 결과"

    for (const result of results) {
        const resultValue = document.createElement("h3")
        resultPage.append(resultValue)
        resultValue.setAttribute("class", "css-white")
        
        if (result.correct) {
            resultValue.innerHTML = `글자 : <span style="color: #bdbdbd">${result.character}</span> | 반응속도 : <span style="color: #505050">${result.speed}ms</span> | <span style="color: chartreuse">성공</span>`
        } else {
            resultValue.innerHTML = `글자 : <span style="color: #bdbdbd">${result.character}</span> | <span style="color: red">실패</span>`
        }
    }
})

resultPage.addEventListener("click", function() {
    if (window.confirm("이 기록을 사진으로 저장하시겠습니까?")) {

        capture(resultPage)
        .then((canvas) => {
            const base64 = canvas.toDataURL("image/png")
            const atag = document.createElement("a")
            atag.href = base64
            atag.download = "record.png"
            atag.click()
            atag.remove()
        })
    }
})

const start = () => {
    const index = Math.floor(Math.random() * keys_computer.length)
    let ms = 0
    
    const msCount = setInterval(() => {
        responseSpeed.innerText = `반응 속도 : ${ms}ms`

        ms += 1
    }, 10)

    inputCharacter.innerText = keys_user[index]
    
    document.onkeydown = function(e) {
        e.preventDefault()

        clearInterval(msCount)

        if (e.key.toLowerCase() === keys_computer[index].toLowerCase()) {
            results.push({
                character:keys_user[index],
                speed:ms,
                correct:true
            })

            end_audio.pause()
            end_audio.currentTime = 0
            end_audio.play()

            start()
        } else {
            results.push({
                character:keys_user[index],
                correct:false
            })

            wrong_audio.volume = 0.5
            wrong_audio.pause()
            wrong_audio.currentTime = 0
            wrong_audio.play()
            start()
        }
    }
}