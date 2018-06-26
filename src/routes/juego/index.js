
const config = require('../../../config.json');
const headers = new Headers();
headers.set('Access-Control-Allow-Origin', '*');

const loginOpts = {
  method: 'POST',
  credentials: 'same-origin',
  // mode: 'cors',
  // headers: headers
};

/**
 * Fetches a login resource and return a promise.
 *
 * @param {Object} opts Login options such as HTTP methos, credenctials, etc.
 * @return { Promise }
 */
function login(opts) {
  const promise = new Promise((resolve, reject)=>{
    fetch('/login', opts)
    .then((response)=>{
      return response.json().then((json) => resolve(json));
    })
    .catch((err)=>{
      console.log(err);
      reject(err);
    });
  });

  return promise;
}

/*
 * Main classes
 * 
 */
const ClientEngine = require('./ClientEngine.js');
const GameEngine = require('../common/PacmanGameEngine.js');
const GameRenderer = require('./PacmanGameRenderer.js');
const gameEngine = new GameEngine({
  isClient: true,
  isServer: false,
});
let Controls;
let controls;
if ('ontouchstart' in window) {
  Controls = require('./TouchControls.js');
  controls = new Controls();
  const dirEl = document.querySelector('#mobile-dir');
  controls.on('controls:input', e => {
    let symbol;
    switch(e.input) {
    case 'IZQUIERDA':
      symbol = '◁';
      break;
    case 'DERECHA':
      symbol = '▷';
      break;
    case 'ARRIBA':
      symbol = '△';
      break;
    case 'ABAJO':
      symbol = '▽';
      break;
    }
    dirEl.innerHTML = symbol;
  });
} else {
  Controls = require('./KeyboardControls.js');
  controls = new Controls();
}
/*
 * Initialize app
 * 
 */
login(loginOpts)
.then((response) => {
  console.log(response);
  try {
    const engine = new ClientEngine({
      gameEngine: gameEngine,
      updateFrequency: 30,
      controls: controls,
      gameRenderer: new GameRenderer({
        gameEngine: gameEngine,
        // tablero: gameEngine.tablero,
      }),
    });
    console.log(engine);
  }
  catch(e) {
    console.error(e);
  }
});

function requestFullScreen(element) {
  // Supports most browsers and their versions.
  const requestMethod =
    element.requestFullScreen ||
    element.webkitRequestFullScreen ||
    element.mozRequestFullScreen ||
    element.msRequestFullScreen;

  if (requestMethod) {
    // Native full screen.
    requestMethod.call(element);
  } else if (typeof window.ActiveXObject !== "undefined") {
    // Older IE.
    const wscript = new ActiveXObject("WScript.Shell");
    if (wscript !== null) {
      wscript.SendKeys("{F11}");
    }
  }
}

function exitFullScreen(element) {
  // Supports most browsers and their versions.
  const exitMethod =
    element.exitFullscreen ||
    element.webkitExitFullscreen ||
    element.mozCancelFullScreen ||
    element.msExitFullscreen;

  if (exitMethod) {
    // Native full screen.
    exitMethod.call(element);
  } else if (typeof window.ActiveXObject !== "undefined") {
    // Older IE.
    const wscript = new ActiveXObject("WScript.Shell");
    if (wscript !== null) {
      wscript.SendKeys("{F11}");
    }
  }
}

document.querySelector('#fullscreen-btn').addEventListener('click', e => {
  requestFullScreen(document.body);
});

document.querySelector('#exit-fullscreen-btn').addEventListener('click', e => {
  exitFullScreen(document);
});

