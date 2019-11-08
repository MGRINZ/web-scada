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
	
	for(var i = 0; i < controls.length; i++) {
		controls[i].interval = 1000;
		controls[i].draw(i, $("body"));
		controls[i].update();
	}
	
})