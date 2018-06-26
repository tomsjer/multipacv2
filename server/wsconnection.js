const WebSocket = require('ws');

class WsConnection {
  constructor(options) {
    this.wss = new WebSocket.Server(options.server);
    this.wss.on('connection', this.onWsConnection.bind(this));
    this.wss.on('ws:send', this.onWsSend.bind(this));
  }
  onWsConnection(ws, req) {
    ws.id = req.sessionID;

    ws.on('message', message => {
      this.onWsMessage.apply(this, [this, message]);
    });
    ws.on('close', message => {
      this.onWsClose.apply(this, [ws, message]);
    });
    ws.on('error', message => {
      this.onWsError.apply(this, [this, message]);
    });

    this.wss.emit('wss:connection:new', ws);
  }
  onWsSend(wsId, event, args) {
    if(wsId) {
      // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/for...of
      // A more efficient way to send only to that ws?
      for(const ws of this.wss.clients) {
        if(ws.id === wsId) {
          ws.send(JSON.stringify({
            event: event,
            args,
          }));
          break;
        }
      }
    }
    else {
      this.wss.clients.forEach(function wsSend(ws) {
        if(ws.readyState === WebSocket.OPEN) {
          ws.send(JSON.stringify({
            event: event,
            args,
          }));
        }
        else{
          console.log('Ws not connected...');
        }
      });
    }
  }
  onWsMessage(ws, message) {

    //
    // Here we can now use session parameters.
    //
    // console.log(` WS message ${message} from user ${userSession.userId}`);

    const msg = (message.indexOf('{') !== -1) ? JSON.parse(message) : {};
    this.wss.emit(msg.event, ws, msg.args);
  }
  onWsClose(ws, message) {
    this.wss.emit('wss:connection:close', ws, message);
  }
  onWsError(ws, error) {
    this.wss.emit('wss:connection:error', ws, error);
  }

}

module.exports = WsConnection;
