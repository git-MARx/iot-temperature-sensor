var fs = require('fs');

const thingShadow = require('../thing/');

var thingShadows = thingShadow({
	keyPath: '/home/kuldeep/Downloads/webinar/certs/27cdd4a272-private.pem.key',
	certPath: '/home/kuldeep/Downloads/webinar/certs/27cdd4a272-certificate.pem.crt',
	caPath:'/home/kuldeep/Downloads/webinar/certs/VeriSign.pem',
	clientId: 'pump1',
	region: 'us-west-2',
	host: 'a26mia404ldpk0.iot.us-west-2.amazonaws.com'
});

function setGpio(value) {
 console.log("Set GPIO="+value);
}

function getGpio(){
	return process.argv[2];
}

var clientTokenUpdate;
var myCallbacks = { };

var initialPumpState = getGpio();

if(process.argv[2]==undefined)
{
	initialPumpState = 'ON'
	console.log("Pump is online");
}
else
{
	console.log("Pump is " +initialPumpState);
}

var pumpState = {"state":{"reported":{"pump_mode":initialPumpState}}};
console.log(JSON.stringify(pumpState));

thingShadows.on('connect',function(){
	var clientToken;


thingShadows.register('pump1');

setTimeout(function(){
	clientToken = thingShadows.update('pump1',pumpState);
},2000);
});



thingShadows.on('status',
	function(thingName, stat, clientToken, stateObject) {
		console.log('recieved '+stat+' on '+thingName+': '+
					JSON.stringify(stateObject));
});

thingShadows.on('delta',
	function(thingName, stateObject) {
		console.log('recieve delta '+' on '+thingName+': '+
					JSON.stringify(stateObject));
		if(stateObject.state.pump_mode === "ON") {
			console.log("~~~~~~~~changing Mode ----> ON~~~~~");
			setGpio(1);
		setTimeout(function(){
			clientToken = thingShadows.update('pump1',{"state":{"reported":{"pump_mode":"ON"}}});
		}, 1000);
		} else if(stateObject.state.pump_mode === "OFF") {
			console.log("~~~~~CHANGING MODE ----> OFF ~~~~~");
			setGpio(0);
			setTimeout(function() {
				clientToken = thingShadows.update('pump1',{"state":{"reported":{"pump_mode":"OFF"}}});
			}, 1000);
		}
	});
thingShadows.on('timeout',
	function(thingName, clientToken) {
		console.log('receive timeout'+' on '+thingName+': '+
					clientToken);
	});
