// No funciona, error:
// Failed to construct 'Path2D': Please use the 'new' operator, this DOM object constructor cannot be called as a function.
export default class Comida extends Path2D {
  constructor({
    colorComida = '#fff',
    radioComida = 2,
    x = 0,
    y = 0,
  }) {
    super();
    this.x = x;
    this.y = y;
    this.colorComida = colorComida;
    this.radioComida = radioComida;
    this.rect(this.x - this.radioComida / 2, this.y - this.radioComida / 2, this.radioComida, this.radioComida);
  }
};