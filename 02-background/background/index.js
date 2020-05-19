/* global browser */

const timerStates = {
  RUNNING: 'running',
  STOPPED: 'stopped',
  INITIAL: 'initial'
}

const appState = {
  timerState: timerStates.INITIAL,
  totalTime: 0,
  laps: []
}

let interval = null

function getCurrentLapTime () {
  const prevLapTime = appState.laps.length > 0
    ? appState.laps[appState.laps.length - 1].totalTime
    : 0
  return appState.totalTime - prevLapTime
}

const countSecond = () => {
  appState.totalTime += 1
  browser.runtime.sendMessage({
    op: 'counter',
    time: {
      totalTime: appState.totalTime,
      lapTime: getCurrentLapTime()
    }
  })
}

const handleInit = (sendResponse) => {
  sendResponse({
    ...appState,
    lapTime: getCurrentLapTime()
  })
}

const handleStart = () => {
  if (interval === null) interval = setInterval(countSecond, 1000)
  appState.timerState = timerStates.RUNNING
  browser.runtime.sendMessage({ op: 'state', timerState: appState.timerState })
}

const handleStop = () => {
  clearInterval(interval)
  interval = null
  appState.timerState = timerStates.STOPPED
  browser.runtime.sendMessage({ op: 'state', timerState: appState.timerState })
}

const handleResume = handleStart

const handleReset = (sendResponse) => {
  appState.totalTime = 0
  appState.laps = []
  appState.timerState = timerStates.INITIAL

  sendResponse()
}

const handleLap = (sendResponse) => {
  const lap = {
    lapNumber: appState.laps.length + 1,
    totalTime: appState.totalTime,
    lapTime: getCurrentLapTime()
  }
  appState.laps.push(lap)
  sendResponse(lap)
}

function listener (message, _, sendResponse) {
  switch (message.op) {
    case 'init': {
      handleInit(sendResponse)
      break
    }
    case 'start': {
      handleStart()
      break
    }
    case 'stop': {
      handleStop()
      break
    }
    case 'resume': {
      handleResume()
      break
    }
    case 'reset': {
      handleReset(sendResponse)
      break
    }
    case 'lap': {
      handleLap(sendResponse)
    }
  }
}

browser.runtime.onMessage.addListener(listener)
