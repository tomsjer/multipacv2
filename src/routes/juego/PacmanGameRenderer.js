import Logger from '../../utils/logger.js'
import GameRenderer from './GameRenderer'
import TableroVista from './TableroVista'
import celdasMap  from '../../common/celdasMap'

const logger = new Logger({
  label: 'pacmanGameRenderer',
});

export default class PacmanGameRenderer extends GameRenderer {
  constructor(options) {
    super(options);

    this.gameEngine = options.gameEngine;
    this.tablero = this.gameEngine.tablero;

    // Crearlo aca
    this.canvas = options.canvas.current;
    // this.canvas.style.top = '68px';
    // Traer de afuera
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight - 68;
    // var w = config.estadoGrilla[0].length * celda;
    // var h = config.estadoGrilla.length * celda;
    this.ctx = this.canvas.getContext('2d');

    this.jugadores;
    this.time;
    this.fpsEl = document.getElementById('fps');
    this.fps = 30;
    this.now;
    this.then = Date.now();
    this.first = this.then;
    this.frameCount = 0;
    this.interval = (1000 / this.fps) | 0;
    this.delta;
    this.startTime = Date.now();
    this.frameCount = 0;

    // Fix up prefixing
    window.AudioContext = window.AudioContext || window.webkitAudioContext;
    this.audioContext = new AudioContext();
    // this.celda = 24;
    // this.tableroConfig = {
      //   anchoCelda: this.celda,
      //   altoCelda: this.celda,
      //   estadoGrilla: estadoGrilla,
      //   ctx: this.ctx,
      //   celdasMap: celdasMap
      // };

    // this.tablero.modelo.anchoCelda = Math.round(window.innerWidth / this.tablero.modelo.estadoGrilla[0].length);
    // this.tablero.modelo.altoCelda = Math.round(window.innerWidth / this.tablero.modelo.estadoGrilla[0].length);
    this.tablero.vista = new TableroVista({
      canvas: this.canvas,
      ctx: this.ctx,
      controlador: this.tablero,
      modelo: this.tablero.modelo,
      celdasMap: celdasMap,
      lineWidth: window.innerWidth < 600 ? 1.0 : 2.0,
      radioComida: window.innerWidth < 600 ? 4.0 : 4.0,
      radioBola: window.innerWidth < 600 ? 8.0 : 8.0,
      colorPared: '',
      colorBorde: '#0ff',
      colorComida: '#995',
      colorBola: '#ff7',
      frameCount: this.frameCount,
      interval: this.interval
    });
    logger.log('info', 'PacmanGameRenderer initialzed...');
  }
  start() {
    super.start();
    this.update();
    // for(const i in this.gameEngine.players) {
    //   const el = document.createElement('span');
    //   el.style.background = this.gameEngine.players[i].color;
    //   const p = document.createElement('p');
    //   p.innerHTML = i;
    //   document.querySelector('#players').appendChild(el);
    //   document.querySelector('#players').appendChild(p);
    // }
    this.emit('pacmanGameRenderer:poststart');
  }
  update() {
    // this.jugadores = new Jugadores(this.tablero);
    requestAnimationFrame(this.update.bind(this));
    this.now = Date.now();
    this.delta = this.now - this.then;
    if (this.delta > this.interval) {
      this.frameCount++;
      this.render();
      this.then = this.now - (this.delta % this.interval);
      this.tablero.vista.frameCount = this.frameCount;
      if(this.frameCount % this.interval === 0) {
        // logger.log('info', `frames: ${this.frameCount} elapsed: ${this.frameCount / this.interval}s`);
      }
    }
  }
  render() {
    this.ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
    // this.ctx.fillStyle = 'black';
    // this.ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);

    this.tablero.vista.dibujar();
    for(const i in this.gameEngine.players) {
      this.gameEngine.players[i].dibujar(this.canvas, this.ctx);
    }
  }
}
