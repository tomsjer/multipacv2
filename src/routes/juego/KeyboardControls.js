import Controls from './Controls'

/**
 * Deberia implementar los triggers de los eventos del teclado
 */
export default class KeyboardControls extends Controls {
  constructor() {
    super(null);
    this.keyMap = {
      37: 'IZQUIERDA',
      38: 'ARRIBA',
      39: 'DERECHA',
      40: 'ABAJO',
    };
    window.addEventListener('keydown', this.onKeyDown.bind(this));
  }
  onKeyDown(e) {
    this.emit('controls:input', { type: 'move', input: this.keyMap[e.keyCode] });
  }
}
