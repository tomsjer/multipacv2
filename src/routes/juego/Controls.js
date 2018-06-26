import EventEmitter from 'events'
import Logger from '../../utils/logger'

const logger = new Logger({
  label: 'controls',
});

export default class Controls extends EventEmitter {
  constructor(options) {
    super(null);
    logger.log('initializing...', options);
  }
}
