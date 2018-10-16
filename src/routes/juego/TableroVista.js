import celdaSprite from './CeldaSprite.js'
// Hacer global
const MOUSE = {
  x: 0,
  y: 0,
};
const map = require('../../utils/map');
export default class TableroVista {
  constructor(config) {

    this.canvas = config.canvas;
    this.ctx = config.ctx;
    this.modelo = config.modelo;
    this.controlador = config.controlador;
    this.aspectRatio = this.modelo.estadoGrilla[0].length / this.modelo.estadoGrilla.length;
    this.anchoCelda = this.altoCelda = this.setCelda();
    this.frameCount = config.frameCount;
    this.interval = config.interval;

    // Fondo tablero
    this.fondo = document.createElement('canvas');
    this.fondo.className = 'fondo-tablero';
    this.fondo.width = this.canvas.width;
    this.fondo.height = this.canvas.height;
    this.canvas.parentNode.prepend(this.fondo);
    this.fondoCtx = this.fondo.getContext('2d');

    this.lineWidth = config.lineWidth || 1.0;
    this.colorBorde = config.colorBorde || '#00f';
    this.colorPared = config.colorPared || '#000';

    this.comida = new Path2D();
    this.colorComida = config.colorComida || '#fff';
    this.radioComida = config.radioComida || 2;
    this.comida.rect(this.anchoCelda / 2 - this.radioComida / 2, this.altoCelda / 2 - this.radioComida / 2, this.radioComida, this.radioComida);

    this.colorBola = config.colorBola || '#fff';
    this.radioBola = this.anchoCelda - 2; // config.radioBola || 8;
    const u = Math.round(this.radioBola / 6);
    this.bola = new Path2D(`M${this.anchoCelda / 2 - (u * 3)} ${this.altoCelda / 2 - (u * 3)}
    h ${u} v -${u} h ${u} v -${u} h${u * 2} v ${u} h ${u} v${u} h ${u} v ${u * 2} h -${u} v ${u} h -${u} v ${u} h -${u * 2} v -${u} h -${u} v -${u} h -${u} v -${u * 2}`);
    // this.bola.rect(this.anchoCelda / 2 - this.radioBola / 2, this.altoCelda / 2 - this.radioBola / 2, this.radioBola, this.radioBola);

    this.celdasMap = config.celdasMap;
    this.ancho = this.modelo.columnas * this.anchoCelda;
    this.alto = this.modelo.filas * this.altoCelda;

    this.estadosJuego = [0, 1, 2, 3];
    this.grillaFondo = this.setGrillaFondo.bind(this)(this.modelo.filas, this.modelo.columnas);
    this.grillaJuego = this.setGrillaJuego.bind(this)(this.modelo.filas, this.modelo.columnas);

    console.log(this.grillaJuego);

    this.dibujarFondo();

    window.addEventListener('resize', this.handleResize.bind(this), false);

    // Hacer global
    // this.canvas.addEventListener('mousemove', this.onMouseOver.bind(this), false);
  }
  dibujarFondo() {
    this.fondoCtx.strokeStyle = this.colorBorde;
    this.fondoCtx.lineWidth = this.lineWidth;
    // Sprite por celda
    this.grillaFondo.forEach((cols, j) => {
      cols.forEach((celda, i) => {
        setTimeout(()=>{
          setTimeout(()=>{
            this.fondoCtx.save();
            this.fondoCtx.translate(
              celda.x - this.anchoCelda / 2,
              celda.y - this.altoCelda / 2
              // celda.x,
              // celda.y
            );
            celdaSprite(celda, this.fondoCtx);
            this.fondoCtx.restore();
          }, 10 * i)
        }, 5 * j)
      });
    });
  }
  dibujar() {
    // this.grillaJuego.forEach(this.procesarCols.bind(this));
    this.grillaJuego.forEach(cols => {
      cols.forEach(celda => {
        this.ctx.save();
        this.ctx.translate(
          celda.x - this.anchoCelda / 2,
          celda.y - this.altoCelda / 2
        );
        // if (celda.estado === 2 || celda.estado === 3) {
        //   this.ctx.strokeStyle = '#ccc';
        //   this.ctx.strokeRect(0,0,this.anchoCelda,this.altoCelda);
        // }
        if (celda.estado === 2) {

          // Celda con comida
          this.ctx.fillStyle = this.colorComida;
          this.ctx.fill(this.comida);
          // if(Math.abs(MOUSE.x  - celda.x) < this.anchoCelda / 2 && Math.abs(MOUSE.y - celda.y) < this.altoCelda / 2) {

        }
        // if (celda.estado === 3 && this.frameCount % 4 !== 0 ) {
        if (celda.estado === 3) {

          // Celda con comida
          this.ctx.fillStyle = this.colorBola;
          this.ctx.fill(this.bola);
        }

        // debug
        // const dx = Math.abs(MOUSE.x - celda.x);
        // const dy = Math.abs(MOUSE.y - celda.y);
        // if ( dx < celda.w - 10 && dy < celda.h - 10) {
        //   const d = Math.abs(dx + dy);
        //   const o = map(d, 0, celda.w, 1, 0);
        //   // console.log(d, o);
        //   this.ctx.strokeStyle = `rgba(255,0,0,${ o }) `;
        //   this.ctx.strokeRect(0, 0, this.anchoCelda , this.altoCelda );
        //   // this.ctx.strokeRect(this.anchoCelda / 4, this.altoCelda / 4, this.anchoCelda / 2, this.altoCelda / 2);
        //   console.log(celda);
        // }
        // this.ctx.strokeStyle = this.colorBorde;
        // this.ctx.strokeRect(0, 0, this.anchoCelda,this.altoCelda);
        this.ctx.restore();
      })
    });
  }
  setGrillaFondo(_f, _c) {
    return this.setGrilla(_f, _c, estado => this.estadosJuego.indexOf(estado) === -1);
  }
  setGrillaJuego(_f, _c) {
    return this.setGrilla(_f, _c, estado => this.estadosJuego.indexOf(estado) !== -1);
  }
  setGrilla(_f, _c, condicion) {
    const f = [];

    for (let i = 0; i < _f; i++) {
      const y = (i * this.altoCelda + this.altoCelda / 2) | 0; // (this.alto / _c) * i + this.altoCelda/2;
      const c = [];

      for (let j = 0; j < _c; j++) {
        const x = (j * this.anchoCelda + this.anchoCelda / 2) | 0; // (this.ancho / _f) * j + this.anchoCelda/2;
        //if (condicion(this.modelo.estadoGrilla[i][j])) {
          c.push({
            x: x,
            y: y,
            i: i,
            j: j,
            w: this.anchoCelda,
            h: this.altoCelda,
            estado: this.modelo.estadoGrilla[i][j]
          });
        //}
      }

      f.push(c);
    }

    return f;
  }
  celdaComida(j, i) {
    this.grillaJuego[j][i].estado = 0;
  }
  getGrilla() {
    return this.grilla;
  }
  setCelda() {
    // Tengo que usar el alto/ancho normalizado (24) para la logica,
    // y el resto de esta funcion solo para la vista de c/resolucion
    // return 24;
    const w = window.innerWidth;
    const h = window.innerHeight;
    if (this.aspectRatio > w / h ) {
      return (w / this.modelo.estadoGrilla[0].length) | 0;
    } else {
      return (h / this.modelo.estadoGrilla.length) | 0;
    }
  }
  handleResize() {
    setTimeout(() => {
      this.fondo.width = this.canvas.width = window.innerWidth;
      this.fondo.height = this.canvas.height = window.innerHeight;
      this.dibujarFondo();
      this.anchoCelda = this.altoCelda = this.setCelda();
      this.grillaFondo = this.setGrillaFondo.bind(this)(this.modelo.filas, this.modelo.columnas);
      this.grillaJuego = this.setGrillaJuego.bind(this)(this.modelo.filas, this.modelo.columnas);
      this.ancho = this.modelo.columnas * this.anchoCelda;
      this.alto = this.modelo.filas * this.altoCelda;
    }, 150);
  }
  infoCelda(e, i) {
    console.log(e, i);
  }
  // Hacer global
  // onMouseOver(e) {
  //   // console.log(e);
  //   // MOUSE.x = e.x;
  //   // MOUSE.y = e.y;
  //   MOUSE.x = e.offsetX;
  //   MOUSE.y = e.offsetY;
  // }
}
