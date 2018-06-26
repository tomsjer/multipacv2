const Logger = require('../utils/logger.js');
const logger = new Logger({
  label: 'player'
});
const EventEmitter = require('events');
const Vector = require('../utils/Vector');
const map = require('../utils/map');

class Player extends EventEmitter {
  constructor(opciones) {
    super(opciones);

    this.id = opciones.id;
    this.color = opciones.color || '#ff0';
    this.name = `Player ${opciones.id} `;
    this.estado = 'init'; // TODO: usar contantes ej.: PLAYER_INIT definido en contantes.js
    this.tablero = opciones.tablero;
    this.celda = this.tablero.anchoCelda;
    this.toBroadCast = opciones.toBroadCast || ['id', 'ubicacion', 'dirActual', 'dirFutura', 'color'];

    this.dirActual = 'IZQUIERDA';
    this.dirFutura = undefined;

    this.rotaciones = [
      180 * Math.PI / 180,
      270 * Math.PI / 180,
      0,
      90 * Math.PI / 180,
    ];
    this.rotActual = 0;

    this.puntaje = 0;

    //this.moviendo         = false;
    this.radio = 12;
    this.diametro = this.radio * 2;
    this.diffBorde = this.celda / 2;

    this.velocidadMag = opciones.vel || 6;
    this.velocidad = new Vector(0, 0);

    this.ubicacionXIni = 14 * 24 + 12;
    this.ubicacionYIni = 24 * 24 - 12;
    this.ubicacion = new Vector(this.ubicacionXIni, this.ubicacionYIni);
    this.ubicacionGrillaMap = this.setearUbicacionGrillaMap();
    this.ubicacionGrilla = this.setearUbicacionGrilla(this.ubicacion);
    this.color = opciones.color || 'red';

    this.on('move', this.onMove.bind(this));

    logger.log('info', `${this.name} initialized...`);
  }
  onMove(input) {
    this.dirFutura = input;
  }
  actualizar() {

    // Tomar accion solo cuando estoy en limites de grilla
    if (
      (this.ubicacion.x - this.radio) % this.celda === 0 &&
      (this.ubicacion.y - this.radio) % this.celda === 0
    ) {
      this.setearUbicacionGrilla(this.ubicacion);

      if (
        this.dirActual !== this.dirFutura &&
        !this.colisiona(this.dirFutura)
      ) {
      // if (!this.colisiona(this.dirFutura)) {
        this.aplicarMover();
      }

      if (this.colisiona(this.dirActual)) {
        // this.dirActual = this.dirFutura;
        this.velocidad = new Vector(0, 0);
      }
    }

    if (this.moviendo()) {
      this.ubicacion.add(this.velocidad);
    }
  }

  setearUbicacionGrilla(ubicacion) {
    const x = this.ubicacionGrillaMap[ubicacion.y][ubicacion.x] ? this.ubicacionGrillaMap[ubicacion.y][ubicacion.x][0] : 0;
    const y = this.ubicacionGrillaMap[ubicacion.y][ubicacion.x] ? this.ubicacionGrillaMap[ubicacion.y][ubicacion.x][1] : 0;

    if (this.ubicacionGrilla) {
      if (x !== this.ubicacionGrilla.x || y !== this.ubicacionGrilla.y) {
        console.log(Date.now() + ' ubicacionGrilla: ' + x + ', ' + y);
      }
    }

    this.ubicacionGrilla = new Vector(x, y);
  }
  setearUbicacionGrillaMap() {
    var grillaMap = [];

    for (var j = 0; j < this.tablero.alto - 1; j += this.velocidadMag) {
      grillaMap[j] = [];
      var y = Math.round(
        map(j, 0, this.tablero.alto, 0, this.tablero.filas - 1)
      );

      for (var i = 0; i < this.tablero.ancho - 1; i += this.velocidadMag) {
        var x = Math.round(
          map(i, 0, this.tablero.ancho, 0, this.tablero.columnas - 1)
        );
        grillaMap[j][i] = [x, y];
      }
    }

    return grillaMap;
  }

  colisiona(dir) {
    switch (dir) {
      case 'IZQUIERDA':
        if (this.ubicacionGrilla.x === 0) {
          //FIXME: desaparce

          this.ubicacion.x = this.tablero.ancho + this.radio;

          return false;
        } else if (
          this.tablero.celdaOcupada(
            this.ubicacionGrilla.y,
            this.ubicacionGrilla.x - 1
          )
        ) {
          return true;
        }

        break;

      case 'DERECHA':
        if (this.ubicacionGrilla.x === this.tablero.columnas - 1) {
          //FIXME: desaparece

          this.ubicacion.x = -this.radio;
          return false;
        } else if (
          this.tablero.celdaOcupada(
            this.ubicacionGrilla.y,
            this.ubicacionGrilla.x + 1
          )
        ) {
          return true;
        }
        break;

      case 'ARRIBA':
        if (
          this.ubicacionGrilla.y === 0 ||
          this.tablero.celdaOcupada(
            this.ubicacionGrilla.y - 1,
            this.ubicacionGrilla.x
          )
        ) {
          return true;
        }
        break;

      case 'ABAJO':
        if (
          this.ubicacionGrilla.y === this.tablero.filas - 1 ||
          this.tablero.celdaOcupada(
            this.ubicacionGrilla.y + 1,
            this.ubicacionGrilla.x
          )
        ) {
          return true;
        }
        break;
      default:
        break;
    }
  }

  aplicarMover() {
    switch (this.dirFutura) {
      case 'IZQUIERDA':
        this.velocidad = new Vector(-this.velocidadMag, 0);
        this.rotActual = this.rotaciones[0];
        this.dirActual = this.dirFutura;
        break;

      case 'ARRIBA':
        this.velocidad = new Vector(0, -this.velocidadMag);
        this.rotActual = this.rotaciones[1];
        this.dirActual = this.dirFutura;
        break;

      case 'DERECHA':
        this.velocidad = new Vector(this.velocidadMag, 0);
        this.rotActual = this.rotaciones[2];
        this.dirActual = this.dirFutura;
        break;

      case 'ABAJO':
        this.velocidad = new Vector(0, this.velocidadMag);
        this.rotActual = this.rotaciones[3];
        this.dirActual = this.dirFutura;
        break;

      default:
        break;
    }
  }
  moviendo() {
    return this.velocidad.x !== 0 || this.velocidad.y !== 0;
  }

  limitarPantalla() {
    if (this.ubicacion.x <= -this.diametro) {
      this.ubicacion.x = this.tablero.ancho + this.diametro;
    }
    if (this.ubicacion.x >= this.tablero.ancho + this.diametro) {
      this.ubicacion.x = -this.diametro;
    }
  }
  posX() {
    return this.ubicacion.x;
  }
  posY() {
    return this.ubicacion.y;
  }
  rotacion() {
    return this.rotActual;
  }
  broadcastData() {
    const data = {};
    this.toBroadCast.forEach(prop => {
      data[prop] = this[prop];
    });
    return data;
  }
  // FIXME: solo deberia estar en PlayerVista
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

module.exports = Player;
