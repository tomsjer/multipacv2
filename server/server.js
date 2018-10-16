/*
  Server.js

  IMPORTANT:
    When using SSL make sure that you generate the certificate.

    openssl genrsa -out key.pem 2048
    openssl req -new -key key.pem -out client.csr
    openssl x509 -req -in client.csr -signkey key.pem -out cert.pem
    rm client.csr

  const url = require('url');
  const location = url.parse(ws.upgradeReq.url, true);
  You might use location.query.access_token to authenticate or share sessions
  or ws.upgradeReq.headers.cookie (see http://stackoverflow.com/a/16395220/151312)

 */

/**
 *
 * Config
 *
 */
const getIpAddress = require('../src/utils/getIpAddresses');
const config = require('../config.json');
const os = require('os');
const interfaces = os.networkInterfaces();
const IP_ADDRESS = getIpAddress(interfaces);
const port = process.env.PORT || 8080;
const host = process.env.PORT ? 'quiet-temple-87366.herokuapp.com' : IP_ADDRESS;
const httpMod = (config.protocol === 'http') ? require('http') : require('https');
const fs = require('fs');
const options = (config.protocol === 'https') ?
{
  key: fs.readFileSync('./server/key.pem'),
  cert: fs.readFileSync('./server/cert.pem'),
} : null;

const Logger = require('../src/utils/logger.js');
const logger = new Logger({
  label: 'server'
});
let engine;

/**
 *
 * Express
 *
 */

// WARNING: Use a session-store in prod or cookie.
const session = require('express-session');
const bodyParser = require('body-parser');
const uuid = require('uuid');
const express = require('express');
const app = express();
const path = require('path');
const sessionParser = session({
  saveUninitialized: false,
  secret: 's3cr3t', // TODO: real secret
  resave: false,
});

// parse application/json
app.use(bodyParser.json())

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Origin");
  next();
});

const p = path.join(__dirname, '../build');
console.log(p);
app.use(express.static(p));
app.use(sessionParser);
// TODO: 404's?
// app.use(function(req, res, next) {
//   res.status(404).send('Sorry cant find that!');
// });

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../build/index.html'), {
    root: p,
  });
});

app.get('/availablePlayers', (req, res) => {
  res.send(engine.getAvailablePlayers());
});

app.post('/login', (req, res) => {
  //
  // "Log in" user and set userId to session.
  //
  try {
    engine.updateAvailablePlayers(req.body.tipo);
  } catch(e) {
    res.status(403);
    res.send({
      result: 'OK',
      message: e.message
    });
  }
  const id = uuid.v4();
  req.session.userId = id;
  res.send({ result: 'OK', message: 'Session updated' });
  logger.info('Updated user session.', req.session.userId);
});

app.post('/logout', (req, res) => {
  logger.log(` Destroying user session. ${req.session.userId}`);
  try {
    engine.restoreAvailablePlayer(req.body.tipo);
  } catch(e) {
    res.status(403);
    res.send({
      result: 'OK',
      message: e.message
    });
  }

  req.session.destroy();
  res.send({ result: 'OK', message: 'Session destroyed' });
});

// const server = (config.protocol === 'http') ? httpMod.createServer(app) : httpMod.createServer(options, app);
const server = httpMod.createServer(app);
// if (process.env.PORT) {
if (true) {
  server.listen(port, function listening() {
    logger.info(`\n______________________________________________________\n\n ${config.protocol}://${server.address().address}:${server.address().port}...\n______________________________________________________\n`);
    if(typeof process.send !== 'undefined') {
      process.send({ ready: true });
    }
  });
} else {
  server.listen(port, host, function listening() {
    logger.info(`\n______________________________________________________\n\n ${config.protocol}://${server.address().address}:${server.address().port}...\n______________________________________________________\n`);
    if(typeof process.send !== 'undefined') {
      process.send({ ready: true });
    }
  });
}

/**
 *
 * Websockets Connections
 *
 */
const WsConnection = require(`${__dirname}/wsconnection.js`);
const wsconnection = new WsConnection({
  server: {
    perMessageDeflate: false,
    server: server,
    clientTracking: true,
    verifyClient: (info, done) => {
      logger.info('Parsing session from request...');
      sessionParser(info.req, {}, () => {
        logger.info(`Session is parsed: ${info.req.sessionID}`);
        //
        // We can reject the connection by returning false to done(). For example,
        // reject here if user is unknown.
        //
        done(info.req.sessionID);
      });
    },
  },
});

/**
 *
 * Messages arriving from gulp tasks
 *
 */

process.on('message', (msg)=>{
  if(wsconnection.wss.clients.size) {
    if(msg.reload) {
      wsconnection.wss.clients.forEach((connection)=>{
        connection.send(JSON.stringify({
          event: 'client:reload',
          args: {
            reload: true,
          },
        }));
      });
    }
  }
  else{
    logger.log('info', 'no connections');
  }
});

try {
  const ServerEngine = require('./ServerEngine.js');
  const GameEngine = require('../src/common/PacmanGameEngine.js');
  engine = new ServerEngine({
    wss: wsconnection.wss,
    gameEngine: new GameEngine({
      wss: wsconnection.wss,
      isClient: false,
      isServer: true,
    }),
    updateFrequency: 30,
    // Al aumentar el ritma de actualizacion se ve mejor la discrepancia entre cliente/servidor
    broadcastFrequency: 3
  });
} catch(e) {
  console.error(e);
}