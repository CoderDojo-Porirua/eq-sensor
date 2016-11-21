// Any copyright is dedicated to the Public Domain.
// http://creativecommons.org/publicdomain/zero/1.0/

/*********************************************
This basic accelerometer example logs a stream
of x, y, and z data from the accelerometer
*********************************************/

var tessel = require('tessel');
var accel = require('accel-mma84').use(tessel.port['A']);
var request = require('request');
/*
var options = {
    host: 'requestb.in',
    port: 80,
    path: '/1albc7s1',
    method: 'POST',
};
*/

function oneInEvery(number, every) {
  return !(number % every);
}

var counter = 0;

// Initialize the accelerometer.
accel.on('ready', function () {
	// Stream accelerometer data
	accel.on('data', function (xyz) {

		var data = {
			x: xyz[0].toFixed(2),
			y: xyz[1].toFixed(2),
			z: xyz[2].toFixed(2),
			id: 'tessel'
    };

		counter++;
		if(oneInEvery(counter, 100))
		{
			console.log('Sending http request');
      console.log(JSON.stringify(data));

      var options = {
        uri: 'https://fluff-protocol.hyperdev.space/data',
        method: 'POST',
        json: data
      };

      request(options, function (error, response, body) {
        if (!error && response.statusCode == 200) {
          console.log('OK');
        }
      });

			console.log('x:', xyz[0].toFixed(2),'y:', xyz[1].toFixed(2),'z:', xyz[2].toFixed(2));
		}

	});

	accel.on('error', function(err){
	   console.log('Error:', err);
	});
});
