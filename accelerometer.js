// Any copyright is dedicated to the Public Domain.
// http://creativecommons.org/publicdomain/zero/1.0/

/*********************************************
This basic accelerometer example logs a stream
of x, y, and z data from the accelerometer
*********************************************/

var tessel = require('tessel');
var accel = require('accel-mma84').use(tessel.port['A']);
var request = require('request');

var LED_ERROR = 0
var LED_LAN_WARN = 1
var LED_GREEN = 2
var LED_BLUE = 3

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

      blink(LED_BLUE, 200)
      request(options, function (error, response, body) {
        if (!error && response.statusCode == 200) {
          blink(LED_GREEN, 500)
          console.log('OK');
        } else {
          blink(LED_ERROR, 5000)
        }
      });

			console.log('x:', xyz[0].toFixed(2),'y:', xyz[1].toFixed(2),'z:', xyz[2].toFixed(2));
		}

	});

	accel.on('error', function(err){
	   console.log('Error:', err);
	});
});

function blink(led, duration){
  tessel.led[led].on();
  setTimeout(function(){
    tessel.led[led].off()
  }, duration
  );

}
