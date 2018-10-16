class TableroModelo {
  constructor(config) {
    if (!config && typeof config !== 'object') {
      throw 'TableroModelo espera un obejto de configuracion.';
    }

    if (!config.estadoGrilla || !config.estadoGrilla.length) {
      throw 'TableroModelo espera un objeto de configuracion con la propiedad estadoGrilla[].';
    }

    this.estadoGrilla = config.estadoGrilla;
  }
  /**
   * Si la celda esta ocupada con algo que no sea vacio o comida
   * @param  {Number} j
   * @param  {Number} i
   * @return {Boolean}
   */
  celdaOcupada(j, i) {
    return this.estadoGrilla[j][i] !== 0 && this.estadoGrilla[j][i] !== 2 && this.estadoGrilla[j][i] !== 3;
  }
  celdaConComida(j, i) {
    return this.estadoGrilla[j][i] === 2;
  }
  celdaComida(j, i) {
    this.estadoGrilla[j][i] = 0;
  }
  get filas() {
    return this.estadoGrilla.length;
  }
  get columnas() {
    return this.estadoGrilla[0].length;
  }
  get anchoCelda() {
    return 24;
  }
  get altoCelda() {
    return 24;
  }
}

module.exports = TableroModelo;
