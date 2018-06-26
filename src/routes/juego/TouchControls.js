import Controls from './Controls'

/**
 * Deberia implementar los triggers de los eventos del touchscreen
 */
export default class TouchControls extends Controls {
  constructor() {
    super(null);
    this.tix = 0;
    this.tiy = 0;
    this.tfx = 0;
    this.tfy = 0;
    this.dx = 0;
    this.dy = 0;
    this.dir = '';
    this.dt = 0;
    this.tt = false;
    this.dp = 56;
    this.tnm = 100;

    window.addEventListener('touchstart', this.onTouchStart.bind(this));
    window.addEventListener('touchmove', this.onTouchMove.bind(this));
    window.addEventListener('touchend', this.onTouchEnd.bind(this));
  }
  onTouchStart(e) {
    this.tix = e.touches[0].clientX;
    this.tiy = e.touches[0].clientY;
    this.dt = Date.now();
  }
  onTouchMove(e) {
    console.log(e.touches[0].clientX);
    if (this.tt) {
      return;
    }

    this.tfx = e.touches[0].clientX;
    this.tfy = e.touches[0].clientY;
    this.dx = Math.abs(this.tix - this.tfx);
    this.dy = Math.abs(this.tiy - this.tfy);

    // if ((this.dx > this.dp || this.dy > this.dp)) {
    //   this.tt = true;
    //   this.onTouchEnd();
    //   this.tix = e.touches[0].clientX;
    //   this.tiy = e.touches[0].clientY;
    // }
  }
  onTouchEnd() {
    if (Date.now() - this.dt < this.tn) {
      return;
    }
    this.dir = this.dx > this.dy ? this.tix > this.tfx ? 'IZQUIERDA' : 'DERECHA' : this.tiy < this.tfy ? 'ABAJO' : 'ARRIBA';
    this.move();
    this.reset();
  }
  reset() {
    this.tix = 0;
    this.tiy = 0;
    this.tix = 0;
    this.tiy = 0;
    this.dir = '';
    this.tt = false;
    this.dt = Date.now();
  }
  move() {
    this.emit('controls:input', { type: 'move', input: this.dir });
  }
}
