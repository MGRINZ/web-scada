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
	
	controls[1].style.text = "Rejestr %R1: #.###";
	
	for(var i = 0; i < controls.length; i++) {
		controls[i].interval = 1000;
		controls[i].draw(i, $("body"));
		controls[i].update();
	}
	
})