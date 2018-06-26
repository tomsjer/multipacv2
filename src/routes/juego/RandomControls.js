import Controls from './Controls'

/**
 * Simula un jugador completamente aleatorio
 */
export default class RandomControls extends Controls {
  constructor() {
    super(null);
    this.dirs = [
      'IZQUIERDA',
      'ARRIBA',
      'DERECHA',
      'ABAJO',
    ];
    this.st = 1000;
    this.mover();
  }
  mover() {

    this.emit('controls:input', { type: 'move', input: this.dirs[Math.floor(Math.random() * 4)] });
    this.st = Math.round(Math.random() * 2000);

    setTimeout(() => {

      this.mover();

    }, this.st);
  }
}
