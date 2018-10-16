const Logger = require('../utils/logger.js');
const logger = new Logger({
  label: 'player'
});
const Player = require('./Player.js');

class GhostPlayer extends Player {
  constructor(opts) {
    super(opts)

  }
  // FIXME: solo deberia estar en PlayerVista para c/tipo de jugador
  dibujar(canvas, ctx) {
    // const x = map(this.posX() - 10, 0, this.tablero.ancho, 0, canvas.width);
    // const y = map(this.posY() - 10, 0, this.tablero.alto, 0, canvas.height);
    const x = (this.tablero.vista.ancho * this.posX() / this.tablero.ancho) | 0;
    const y = (this.tablero.vista.alto * this.posY() / this.tablero.alto) | 0;
    ctx.strokeStyle = '#0f';
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(x , y, this.tablero.anchoCelda / 2, 0, (Math.PI / 180) * 360);
    ctx.fill();
    // ctx.beginPath();
    // ctx.strokeRect(x - this.tablero.vista.anchoCelda / 2, y - this.tablero.vista.anchoCelda / 2, this.tablero.anchoCelda, this.tablero.anchoCelda);
    // ctx.stroke();
  }
}

module.exports = GhostPlayer