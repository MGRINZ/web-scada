$(function () {
	"use strict";
	
	/* Przykładowy panel operatorski */
	
	var controls = [];
	var temp;
	
	/** Wyjścia dyskretne **/
	
	temp = new Text();
	temp.style.text = "Wyjścia dyskretne";
	temp.style.position.top = 5;
	temp.style.position.left = 5;
	temp.style.dimensions.width = 200;
	controls.push(temp);
	
	temp = new Text();
	temp.style.text = "%Q1: ";
	temp.style.position.top = 30;
	temp.style.position.left = 5;
	controls.push(temp);
	
	temp = new Switch("Q", 1);
	temp.style.position.top = 15;
	temp.style.position.left = 50;
	controls.push(temp);
	
	temp = new Text();
	temp.style.text = "%Q2: ";
	temp.style.position.top = 30;
	temp.style.position.left = 120;
	controls.push(temp);
	
	temp = new Switch("Q", 2);
	temp.style.position.top = 15;
	temp.style.position.left = 160;
	controls.push(temp);
	
	temp = new Text();
	temp.style.text = "%Q3: ";
	temp.style.position.top = 30;
	temp.style.position.left = 220;
	controls.push(temp);
	
	temp = new Switch("Q", 3);
	temp.style.position.top = 15;
	temp.style.position.left = 270;
	controls.push(temp);
	
	/** Wejścia dyskretne **/
	
	temp = new Text();
	temp.style.text = "Wejścia dyskretne";
	temp.style.position.top = 60;
	temp.style.position.left = 5;
	temp.style.dimensions.width = 200;
	controls.push(temp);
	
	temp = new Text("I", 1);
	temp.style.text = "%I1: #";
	temp.style.position.top = 85;
	temp.style.position.left = 5;
	controls.push(temp);
	
	temp = new Text("I", 2);
	temp.style.text = "%I2: #";
	temp.style.position.top = 85;
	temp.style.position.left = 120;
	controls.push(temp);
	
	temp = new Text("I", 3);
	temp.style.text = "%I3: #";
	temp.style.position.top = 85;
	temp.style.position.left = 220;
	controls.push(temp);
	
	/** Rejestry **/
	
	temp = new Text();
	temp.style.text = "Rejestry";
	temp.style.position.top = 105;
	temp.style.position.left = 5;
	temp.style.dimensions.width = 200;
	controls.push(temp);
	
	temp = new Text("R", 1);
	temp.type = "REAL";
	temp.style.text = "%R1: #.###";
	temp.style.position.top = 130;
	temp.style.position.left = 5;
	controls.push(temp);
	
	temp = new Text("R", 3);
	temp.style.text = "%R3: #";
	temp.style.position.top = 130;
	temp.style.position.left = 120;
	controls.push(temp);
	
	temp = new Text("R", 4);
	temp.style.text = "%R4: #";
	temp.style.position.top = 130;
	temp.style.position.left = 220;
	controls.push(temp);
	
	/** Wejścia analogowe **/
	
	temp = new Text();
	temp.style.text = "Wejścia analogowe";
	temp.style.position.top = 160;
	temp.style.position.left = 5;
	temp.style.dimensions.width = 200;
	controls.push(temp);
	
	temp = new Text("AI", 1);
	temp.style.text = "%AI1: #";
	temp.style.position.top = 185;
	temp.style.position.left = 5;
	controls.push(temp);
	
	temp = new Text("AI", 2);
	temp.style.text = "%AI2: #";
	temp.style.position.top = 185;
	temp.style.position.left = 120;
	controls.push(temp);
	
	temp = new Text("AI", 3);
	temp.style.text = "%AI3: #";
	temp.style.position.top = 185;
	temp.style.position.left = 220;
	controls.push(temp);
	
	/** Slidery **/
	
	temp = new Text();
	temp.style.text = "Rejestry";
	temp.style.position.top = 205;
	temp.style.position.left = 5;
	temp.style.dimensions.width = 200;
	controls.push(temp);
	
	temp = new Slider("R", 1);
	temp.type = "REAL";
	temp.style.position.top = 220;
	temp.style.position.left = 30;
	temp.style.values = {
		min: -100,
		max: 100
	}
	controls.push(temp);
	
	temp = new Slider("R", 3);
	temp.style.position.top = 220;
	temp.style.position.left = 130;
	temp.style.values = {
		min: 0,
		max: 50
	}
	controls.push(temp);
	
	temp = new Slider("R", 4);
	temp.style.position.top = 220;
	temp.style.position.left = 230;
	temp.style.values = {
		min: -50,
		max: 20
	}
	controls.push(temp);
	
	/** TextBoxy **/
	
	temp = new TextBox("R", 1);
	temp.type = "REAL";
	temp.style.format = "#.###";
	temp.style.position.top = 430;
	temp.style.position.left = 5;
	temp.style.dimensions.height = 20;
	temp.style.dimensions.width = 75;
	controls.push(temp);
	
	temp = new TextBox("R", 3);
	temp.style.format = "#";
	temp.style.position.top = 430;
	temp.style.position.left = 120;
	temp.style.dimensions.height = 20;
	temp.style.dimensions.width = 75;
	controls.push(temp);
	
	temp = new TextBox("R", 4);
	temp.style.format = "#";
	temp.style.position.top = 430;
	temp.style.position.left = 220;
	temp.style.dimensions.height = 20;
	temp.style.dimensions.width = 75;
	controls.push(temp);
	
	/** Mierniki **/
	
	temp = new Text();
	temp.style.text = "Rejestry";
	temp.style.position.top = 5;
	temp.style.position.left = 400;
	temp.style.dimensions.width = 200;
	controls.push(temp);
	
	temp = new Meter("R", 1);
	temp.type = "REAL";
	temp.style.position.top = 30;
	temp.style.position.left = 400;
	temp.style.values = {
		min: -100,
		max: 100
	};
	controls.push(temp);
	
	temp = new Meter("R", 3);
	temp.style.position.top = 180;
	temp.style.position.left = 400;
	temp.style.values = {
		min: 0,
		max: 50
	};
	controls.push(temp);
	
	temp = new Meter("R", 4);
	temp.style.position.top = 330;
	temp.style.position.left = 400;
	temp.style.values = {
		min: -50,
		max: 20
	};
	controls.push(temp);
	
	/** Wykres **/
	
	var trend = new Trend("R", 1);
	trend.type = "REAL";
	var trend2 = new Trend("R", 3);
	trend2.style.color = "#00FF00";
	var trend3 = new Trend("R", 4);
	trend3.style.color = "#0000FF";
	
	temp = new Chart();
	temp.style.position.top = -30;
	temp.style.position.left = 700;
	temp.style.values = {
		min: -100,
		max: 100
	};
	temp.interval = 100;
	temp.addTrend(trend);
	temp.addTrend(trend2);
	temp.addTrend(trend3);
	controls.push(temp);
	
	/** Wyświetlenie i odświeżenie kontrolek **/
	
	for(var i = 0; i < controls.length; i++) {
		controls[i].draw($("body"));
		controls[i].update();
	}
})