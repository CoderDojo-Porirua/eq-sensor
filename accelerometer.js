// Any copyright is dedicated to the Public Domain.
// http://creativecommons.org/publicdomain/zero/1.0/

/*********************************************
This basic accelerometer example logs a stream
of x, y, and z data from the accelerometer
*********************************************/

var tessel = require('tessel');
var accel = require('accel-mma84').use(tessel.port['A']);
var http = require('http');

/*var options = {
    host: 'fluff-protocol.hyperdev.space',
    port: 443,
    path: '/data',
    method: 'POST',
};*/

var options = {
    host: 'requestb.in',
    port: 80,
    path: '/1albc7s1',
    method: 'POST',
};

function oneInEvery(number, every) {
  return !(number % every);
}

var counter = 0;

// Initialize the accelerometer.
accel.on('ready', function () {
	// Stream accelerometer data
	accel.on('data', function (xyz) {
		
		var data = [
		  {
			x: xyz[0].toFixed(2),
			y: xyz[1].toFixed(2),
			z: xyz[2].toFixed(2),
			id: 'tessel'
		  }
		]
		counter++;
		if(oneInEvery(counter, 100))
		{
			console.log('Sending http request');
			
			http.request(options).end(JSON.stringify(data));
			/*
			var request = http.request(options, function(res)
			{
				// Print out data when we get it
				res.on('data', function(data)
				{
					console.log('response data', data);
				});
			});
			 
			// Write any POST data 
			request.write(JSON.stringify(data));
			 */
			console.log('x:', xyz[0].toFixed(2),'y:', xyz[1].toFixed(2),'z:', xyz[2].toFixed(2));
		}
		
		

	});

	accel.on('error', function(err){
	console.log('Error:', err);
	});
});