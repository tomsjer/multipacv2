const Logger = require('../utils/logger.js');
const logger = new Logger({
  label: 'gameWorld',
});
const Entity = require('.Entity.js');
class GameWorld {
  constructor(options) {
    console.log(`[gameWorld] ${options}`);
  }
}

module.exports = GameWorld;
