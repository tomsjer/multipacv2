const TableroModelo = require('./TableroModelo.js');
// const TableroVista = require('./TableroVista.js');

class TableroControlador {
  constructor(config) {
    /* Modelo */
    this.modelo = new TableroModelo(config);

    /* Vista */
    // this.vista = new TableroVista({
    //     modelo: this.modelo,
    //     ctx: config.ctx,
    //     celdasMap: config.celdasMap
    // });

    // this.dibujar = this.vista.dibujar.bind(this.vista);
  }

  celdaOcupada(j, i) {
    return this.modelo.celdaOcupada(j, i);
  }

  celdaConComida(j, i) {
    return this.modelo.celdaConComida(j, i);
  }

  comer(j, i) {
    this.modelo.celdaComida(j, i);

    if (this.vista) {
      this.vista.celdaComida(j, i);
    }
  }

  get anchoCelda() {
    return this.modelo.anchoCelda;
  }

  get altoCelda() {
    return this.modelo.altoCelda;
  }

  get filas() {
    return this.modelo.filas;
  }

  get columnas() {
    return this.modelo.columnas;
  }
  get ancho() {
    return this.anchoCelda * this.columnas;
  }
  get alto() {
    return this.altoCelda * this.filas;
  }
  get estado() {
    return this.modelo.estadoGrilla;
  }
}

module.exports = TableroControlador;
