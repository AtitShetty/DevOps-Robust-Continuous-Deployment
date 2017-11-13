var redis = require('redis')
var multer  = require('multer')
var express = require('express')
var fs      = require('fs')
var app = express()
// REDIS
var client = redis.createClient(6379, '127.0.0.1', {})
client.auth('abcde');
///////////// WEB ROUTES

// Add hook to make it easier to get all visited URLS.

// var requests = []
app.use(function(req, res, next) 
{
	console.log(req.method, req.url);
	// if (req.url == "/recent" || req.url == "/favicon.ico")
	// 	next();
	// else {
	// 	if (requests.length >= 5) {
	// 		requests.pop()
	// 	}
	// 	requests.unshift(req.method +" "+ req.url);
	// 	// ... INSERT HERE.
	
	// 	next(); // Passing the request to the next handler in the stack.
	// }
	next();
	
});

app.get('/test', function(req, res) {
	{
		client.exists("canary_flag", function(err, value) {
			if (value == 1) {
				res.writeHead(200, {'content-type':'text/html'});
				res.write("<h3>test - canary_flag = on</h3>");
				client.exists("feature_flag", function(err, value2) {
					if (value2 == 1) {
						res.write("<h3>test - feature_flag = on</h3>");
						res.end();
					}
					else {
						res.write("<h3>test - feature_flag = off</h3>");
						res.end();	
					}
				});
			}
			else {
				res.writeHead(200, {'content-type':'text/html'});
				res.write("<h3>test - canary_flag = off</h3>");
		   		client.exists("feature_flag", function(err, value2) {
					if (value2 == 1) {
						res.write("<h3>test - feature_flag = on</h3>");
						res.end();
					}
					else {
						res.write("<h3>test - feature_flag = off</h3>");
						res.end();	
					}
				});
			}
		});
	}
})

app.get('/toggleCanaryServer', function(req, res) {
	{
		res.writeHead(200, {'content-type':'text/html'});
		client.exists("canary_flag", function(err, value) {
			if (value != 1) {
				client.set('canary_flag', 'val1');
				res.write("<h3>Canary Flag turned on</h3>");
				res.end();
			}
			else {
				client.del('canary_flag', function(err, reply) {
				    res.write("<h3>Canary Flag turned off</h3>");
				    res.end();
				});
			}
		});
		
   		// console.log(req);
	}
})

app.get('/toggleFeatureFlag', function(req, res) {
	{
		res.writeHead(200, {'content-type':'text/html'});
		client.exists("feature_flag", function(err, value) {
			if (value != 1) {
				client.set('feature_flag', 'val1');
				res.write("<h3>Feature Flag turned on</h3>");
				res.end();
			}
			else {
				client.del('feature_flag', function(err, reply) {
				    res.write("<h3>Feature Flag turned off</h3>");
				    res.end();
				});
			}
		});
		
   		// console.log(req);
	}
})


// HTTP SERVER
var server = app.listen(4000, function () {

  var host = server.address().address
  var port = server.address().port

  console.log('Example app listening at http://%s:%s', host, port)
})

exports 