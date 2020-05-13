const btnStart = document.querySelector('#btn-start')
const btnStop = document.querySelector('#btn-stop')
const btnLap = document.querySelector('#btn-lap')
const btnResume = document.querySelector('#btn-resume')
const btnReset = document.querySelector('#btn-reset')

const lapListDiv = document.querySelector('#lap-list')
const initialButtonsDiv = document.querySelector('#initial-buttons')
const runningButtonsDiv = document.querySelector('#running-buttons')
const stoppedButtonsDiv = document.querySelector('#stopped-buttons')

const totalTimeDisplay = document.querySelector('#total-time')
const lapTimeDisplay = document.querySelector('#lap-time')

const appState = {
  totalTime: 0,
  lapNumber: 1,
  prevLapTime: 0
}

function formatTime (time, separator = ' : ') {
  const hours = Math.floor(time / 3600)
  const minutes = Math.floor(time / 60)
  const seconds = Math.floor(time % 60)
  const paddedTimeElements = [hours, minutes, seconds].map(x => String(x).padStart(2, 0))
  return paddedTimeElements.join(separator)
}
function updateTimerDisplay () {
  totalTimeDisplay.innerText = formatTime(appState.totalTime)
  lapTimeDisplay.innerText = formatTime(appState.totalTime - appState.prevLapTime)
}

let interval

function countSecond () {
  appState.totalTime += 1
  updateTimerDisplay()
}

function start () {
  initialButtonsDiv.style.display = 'none'
  runningButtonsDiv.style.display = 'flex'
  interval = setInterval(countSecond, 1000)
}

function stop () {
  runningButtonsDiv.style.display = 'none'
  stoppedButtonsDiv.style.display = 'flex'
  clearInterval(interval)
}

function lap () {
  const lapDiv = document.createElement('div')
  lapDiv.classList.add('lap-div')

  const lapNumberSpan = document.createElement('span')
  lapNumberSpan.innerText = appState.lapNumber
  lapDiv.appendChild(lapNumberSpan)

  const lapTimeSpan = document.createElement('span')
  lapTimeSpan.innerText = formatTime(appState.totalTime - appState.prevLapTime, ':')
  lapDiv.appendChild(lapTimeSpan)

  const totalTimeSpan = document.createElement('span')
  totalTimeSpan.innerText = formatTime(appState.totalTime, ':')
  lapDiv.appendChild(totalTimeSpan)

  lapListDiv.appendChild(lapDiv)

  appState.prevLapTime = appState.totalTime
  appState.lapNumber += 1
}

function resume () {
  stoppedButtonsDiv.style.display = 'none'
  runningButtonsDiv.style.display = 'flex'
  interval = setInterval(countSecond, 1000)
}

function reset () {
  stoppedButtonsDiv.style.display = 'none'
  initialButtonsDiv.style.display = 'flex'
  appState.totalTime = 0
  appState.prevLapTime = 0
  updateTimerDisplay()
  lapListDiv.innerHTML = ''
}

btnStart.addEventListener('click', start)
btnStop.addEventListener('click', stop)
btnLap.addEventListener('click', lap)
btnResume.addEventListener('click', resume)
btnReset.addEventListener('click', reset)
