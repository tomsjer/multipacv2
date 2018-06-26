/*
* Formato:
* < Date.ISO > [ level ] [ label ] <message> <metadata>
*/
class Logger {
  constructor(options = {}) {
    this.separator = (options.separator) ? options.separator : ' : ';
    this.label = (options.label) ? `[ ${options.label} ]` : '';
  }
  print(level, message, _metadata) {
    const metadata = (typeof _metadata === 'object') ? JSON.stringify(_metadata) : (typeof _metadata === 'undefined') ? '' : _metadata;
    if(typeof window === 'undefined') {
      console[level](`${new Date().toLocaleString()} [ ${level} ] ${this.label} ${message} ${metadata}`);
    }
    else {
      console[level](`${new Date().toLocaleString()} [ ${level} ] ${this.label} ${message}`, metadata);
    }
  }
  format(level, message, _metadata) {
    const metadata = (typeof _metadata === 'object' && typeof window === 'undefined') ? JSON.stringify(_metadata) : (typeof _metadata === 'undefined') ? '' : _metadata;
    return `${new Date().toLocaleString()} [ ${level} ] ${this.label} ${message} ${metadata}`;
  }
  log(message, metadata) {
    this.print.apply(this, ['log', message, metadata]);
  }
  debug(message, metadata) {
    this.print.apply(this, ['debug', message, metadata]);
  }
  info(message, metadata) {
    this.print.apply(this, ['info', message, metadata]);
  }
  warn(message, metadata) {
    this.print.apply(this, ['warn', message, metadata]);
  }
  error(message, metadata) {
    this.print.apply(this, ['error', message, metadata]);
  }
}

module.exports = Logger;
