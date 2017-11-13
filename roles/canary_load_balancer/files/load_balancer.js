var http      = require('http');
var httpProxy = require('http-proxy');
var exec = require('child_process').exec;
var request = require("request");
var fs = require('fs');
var Random = require('random-js');
var redis = require('redis')

var client = redis.createClient(6379, '127.0.0.1', {})
client.auth('abcde');

// var PROD = 'http://127.0.0.1:5060';
// var CANARY  = 'http://127.0.0.1:9090';
var CANARY_PROB = 0.5;
var nodes = null;
var TARGET = null;

rand = new Random(Random.engines.mt19937().seed(0));

var infrastructure =
{
  setup: function()
  {
    // Proxy.
    var options = {};

    var buf = fs.readFileSync('./checkbox_servers', "utf8");

    nodes = buf.split('\n');
    TARGET = nodes[1];

    var proxy   = httpProxy.createProxyServer(options);

    var server  = http.createServer(function(req, res)
    {
      client.exists("canary_flag", function(err, value) {
        if (value == 1) {
          if (rand.bool(CANARY_PROB)) {
            console.log("processing request through canary server");
            proxy.web( req, res, {target: nodes[1] } );  
          }
          else{
            console.log("processing request through production server");
            proxy.web( req, res, {target: nodes[0] } );
          }
        }
        else {
          console.log("processing request through production server");
          proxy.web( req, res, {target: nodes[0] } );
        }
      });
      
    });
    server.listen(3000);

//setTimeout
//var options = 
//{
//  url: "http://localhost:8080",
//};
//request(options, function (error, res, body) {
  setInterval(function(){
    var options = {
      uri: TARGET
    };

    request(options, function(err,res,body){
      if(!res || res.statusCode == 500){
        console.log("canary server is down");
        CANARY_PROB = 0.0;
      }
      else {
        CANARY_PROB = 0.5;
        console.log ("canary server is up");
      }
    });
  },2000);


  },

  teardown: function()
  {
    exec('forever stopall', function()
    {
      console.log("infrastructure shutdown");
      process.exit();
    });
  },
}

infrastructure.setup();

// Make sure to clean up.
process.on('exit', function(){infrastructure.teardown();} );
process.on('SIGINT', function(){infrastructure.teardown();} );
process.on('uncaughtException', function(err){
  console.error(err);
  infrastructure.teardown();} );