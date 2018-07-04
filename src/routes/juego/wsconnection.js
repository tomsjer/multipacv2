import EventEmitter from 'events'
const WSState = {
  CONNECTING: 0,
  OPEN: 1,
  CLOSING: 2,
  CLOSED: 3,
};

export default class WsConnection extends EventEmitter {
  constructor(opts) {
    super();
    this.opts = opts;
    this.setListeners();
    return this;
  }
  setListeners() {
    this.on('client:reload', (args)=>{
      if(args.reload) {
        window.location.reload(true);
      }
    });
    this.on('ws:send:input', function(message) {
      this.send('wss:client:input',message);
    });
    this.on('ws:send:playerTipo', function(message) {
      this.send('wss:client:playerTipo',message);
    });
  }
  init() {
    return new Promise((resolve, reject) => {
      this.ws = new WebSocket(this.opts.wsServer);

      this.ws.onopen = (response)=>{
        this.emit('ws:open', response);
        resolve(response);
      };

      this.ws.onerror = (err)=>{
        this.emit('ws:error', err);
        reject(err);
      };

      this.ws.onclose = (message)=>{
        this.emit('ws:close', message);
      };

      // If wanted to support Binary?
      this.ws.onmessage = (message)=>{
        const msg = (message.data.indexOf('{') !== -1) ? JSON.parse(message.data) : {};
        this.emit(msg.event, msg.args);
        // console.log('[ws]', msg);
      };
    });
  }
  send(event, args) {
    if(this.ws.readyState === WSState.OPEN) {
      this.ws.send(JSON.stringify({
        event: event,
        args: args,
      }));
    }
  }
  sendPromise(event, args) {
    const self = this;
    const promise = new Promise((resolve, reject)=>{
      self.ws.send(JSON.stringify({
        event: event,
        args: args,
      }));

      self.on(event, (data)=>{
        resolve(data);
      });
    });

    return promise;
  }
}
