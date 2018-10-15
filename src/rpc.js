var websocket = require('websocket-stream');
var rpc = require('rpc-multistream'); // RPC and multiple streams over one stream
var auth = require('rpc-multiauth').client ; // authentication

var reconnectDelay = 2;
var reconnectAttempts = 0;
var reconnectAttemptsMax = 10;
var authToken = null
function reconnect(protocol, host, token, cb) {
  if (reconnectAttempts > reconnectAttemptsMax) {
    /*
    console.log("Disconnected from server. Gave up trying to reconnect after " + reconnectAttemptsMax + " attempts.", {
      level: 'error',
      time: false
    });
    */
    return;
  }
  var delay = Math.pow(reconnectDelay * reconnectAttempts, 2);
  if (reconnectAttempts) {
      /*
    console.log("Disconnected from server. Attempting to reconnect in " + delay + " seconds", {
      level: 'error',
      time: (delay - 1) * 1000
    });
    */
  }
  setTimeout(function() {
    if(delay > 0) {
      //setConnectState(false, "Will attempt to reconnect in " + (delay - 1) + " seconds...", (delay - 1));
    }
  }, 1000);
  //console.log("reconnecting in", delay, "seconds");
  setTimeout(function() {
    //setConnectState(false, "Attempting to reconnect...");
    connect(protocol, host, token, cb);
  }, delay * 1000 + 1);
  reconnectAttempts++;
}


function connector(protocol, host, token, cb) {

  var failed = false;

  function failOnce(err) {
    if(!failed) {
      //console.log('main.js failOnce error:', (typeof err === 'object') ? err.message + ' ' + err.stack : err);
      cb(err);
      failed = true;
    }
  }

  var wsProtocol = 'ws://';
  if(protocol.match(/^https/i)) {
    wsProtocol = 'wss://';
  }

  var websocketUrl = wsProtocol + host;
  //console.log('connecting to websocket', websocketUrl)

  var stream = websocket(websocketUrl);
  stream.on('error', function(err) {
    failOnce(new Error("connection closed"));
  });
  stream.on('close', function() {
    failOnce(new Error("connection closed"));
  });

  // You can turn on debugging like this:
  //   var rpcClient = rpc(null, {debug: true});
  var rpcClient = rpc(null, {
    objectMode: true,
    heartbeat: 2000
  });

  rpcClient.on('death', function() {
    failOnce(new Error("connection timed out"));
  });

  rpcClient.pipe(stream).pipe(rpcClient);

  rpcClient.on('error', function(err) {
    console.log("RPCCLIENT error:", err)
    failOnce(err);
  });

  rpcClient.on('methods', function (remote) {

    // automatically try to authenticate when connecting
    // TODO rpc-multiauth's .athenticate function should pass back the token
    auth.authenticate(remote, {
      setCookie: false,
      token:token
    }, function (err, userData) {

      if(err) {
        cb(null, remote);
      } else {
        cb(null, remote, userData.user);
      }
    });

  });
}

function connect(protocol, host, token, cb) {
  global.document={}
  //console.log("attempting to connect");
  connector(protocol, host, token, function (err, remote, user) {
    if(err) {
      //setConnectState(false, "Failed to connect");
      reconnect(protocol, host, token, cb);
      return;
    }

    reconnectAttempts = 0;

    cb(null, remote, user);
  })
}


function login(remote, email, password, cb) {
  if(!remote) return cb(new Error("Not connected"))

  //console.log("login initiated:", email, password);

  auth.login(remote, {
    username: email,
    password: password
  }, {
    setCookie: false
  }, function (err, token, userData) {
    if(err) return cb(err);

    //setLoginState(userData.user, token);

    //console.log("login successful! token: " + token + " userData: " + JSON.stringify(userData));

    cb(null, userData.user,token);

  });
};

function logout(remote, cb) {
  cb = cb || function () {};

  if(!remote) return cb(new Error("Not connected"))

  auth.logout(remote, function() {

    //setLoginState()

    //console.log("Logged out.");
    cb();
  });
};

module.exports = {
  login: login,
  logout: logout,
  connect: connect
};
