$(function () {
	"use strict";
	
	var controls = [];
	
	/*
	ajax(
		//getControls
		//controls.draw
		etc.
	)
	*/
	
	controls.push(new Switch("Q", 1));
	controls.push(new Text("R", 1));
	controls.push(new TextBox("R", 1));
	controls.push(new Slider("R", 1));
	controls.push(new Slider("R", 1));
	controls.push(new Meter("R", 1));
	controls.push(new Meter("R", 1));
	controls.push(new Chart());
	controls.push(new Slider("R", 3));
	controls.push(new Text("R", 3));
	
	controls[1].style.text = "Rejestr %R1: #.###";
	controls[1].style.position.top = 400;
	controls[2].type = "REAL";
	controls[2].style.position.top = 200;
	controls[2].style.format = "#.###";
		// controls[0].type = "REAL";
		// controls[0].style.position.top = 200;
		// controls[0].style.format = "#.###";
	controls[3].type = "REAL";
	controls[3].style.position.left = 200;
	controls[3].style.values = {
		min: -100,
		max: 100
	}
	controls[4].style.position.left = 400;
	controls[5].style.position.left = 200;
	controls[5].style.position.top = 250;
	controls[5].style.values = {
		min: 0,
		max: 100
	};
	controls[6].style.position.left = 500;
	controls[6].style.position.top = 250;
	controls[6].style.values = {
		min: -100,
		max: 100
	};
	controls[7].style.position.left = 750;
	controls[7].style.timeSpan = 60;
	var trend = new Trend("R", 1);
	var trend2 = new Trend("R", 3);
	controls[7].addTrend(trend);
	controls[7].addTrend(trend2);
	trend.style.color = "#0000FF";
	controls[7].style.dimensions = {
		width: 500,
		height: 500
	}
	controls[7].style.values = {
		min: -100,
		max: 100
	};
	
	controls[8].style.position.left = 600;
	controls[9].style.position.left = 600;
	controls[9].style.position.top = 200;
	controls[9].style.text = "%R3: #.###"
	
	for(var i = 0; i < controls.length; i++) {
		controls[i].interval = 1000;
		controls[i].draw($("body"));
		controls[i].update();
	}
	
	controls[7].interval = 100;
	
})