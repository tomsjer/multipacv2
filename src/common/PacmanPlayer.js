const Logger = require('../utils/logger.js');
const logger = new Logger({
  label: 'player'
});
const Player = require('./Player.js');
const Vector = require('../utils/Vector');

class PacmanPlayer extends Player {
  constructor(opts) {
    super(opts)

  }
  actualizar() {

    if(this.estado !== 'muerto'){
        super.actualizar();

        if(this.hayComida()){
            this.comer();
        }
    }

  }
  hayComida () {
    return this.tablero.celdaConComida(this.ubicacionGrilla.y,this.ubicacionGrilla.x);
  }
  comer () {
      this.tablero.comer(this.ubicacionGrilla.y,this.ubicacionGrilla.x);
      this.puntaje += 1;
      console.log((this.ubicacionGrilla.y,this.ubicacionGrilla.x));
  }
  murio (){
    this.estado = 'muerto';
    this.velocidad = new Vector(0, 0);
  }
  // FIXME: solo deberia estar en PlayerVista para c/tipo de jugador
  dibujar(canvas, ctx) {
    // const x = map(this.posX() - 10, 0, this.tablero.ancho, 0, canvas.width);
    // const y = map(this.posY() - 10, 0, this.tablero.alto, 0, canvas.height);
    const x = (this.tablero.vista.ancho * this.posX() / this.tablero.ancho) | 0;
    const y = (this.tablero.vista.alto * this.posY() / this.tablero.alto) | 0;
    // ctx.strokeStyle = '#f00';
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(x , y, this.tablero.anchoCelda / 2, 0, (Math.PI / 180) * 360);
    ctx.fill();
    // ctx.beginPath();
    // ctx.strokeRect(x - this.tablero.vista.anchoCelda / 2, y - this.tablero.vista.anchoCelda / 2, this.tablero.anchoCelda, this.tablero.anchoCelda);
    // ctx.stroke();
  }
}

module.exports = PacmanPlayer