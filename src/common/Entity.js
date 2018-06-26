const Logger = require('../utils/logger.js');
const logger = new Logger({
  label: 'entity',
});
const EventEmitter = require('events');

class Entity extends EventEmitter {
  constructor(options) {
    super(null);
    logger.log(` New entity... ${options}`);
  }
}

module.exports = Entity;
