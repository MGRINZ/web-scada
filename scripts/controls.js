"use strict"

/**
 * Klasa bazowa dla wszystkich kontrolek
 */
class Control {
	
	/**
	 * Wspólny konstruktor ustawia domyślne wartości i pobiera rodzaj i adres zmiennej.
	 * 
	 * @param	variable	rodzaj zmiennej: @Nullable String
	 * @param	address		adres zmiennej: @Nullable Number
	 */
	constructor(variable, address) {
		this._id = -1;					//< Identyfikator kontrolki
		this._variable = variable;		//< Rodzaj zmiennej
		this._address = address;		//< Adres zmiennej
		this._type = "INT";				//< Adres zmiennej
		this._value = 0;				//< Wartość zmiennej
		this._interval = 1000;			//< Czas odświerzania w ms
		this._wrapper = null;			//< Element DOM stanowiący korzeń kontrolki
		this._svgPath = null;			//< Ścieżka do pliku SVG
		this._isWritting = false;		//< Zmienna określa czy zapisać nową wartość zmiennej
		this._style = {					//< Styl kontrolki
			dimensions: {
				width: 100,
				height: 100
			},
			position: {
				top: 0,
				left: 0
			}
		};
		this._syncingWith = -1;			//< Id kontrolki, z której ta kontrolka synchronizuje wartość
		Control._controls.push(this);	//< Dodanie kontrolki do zmiennej statycznej
	}
	
	/**
	 * Ustawienie typu zmiennej
	 *
	 * @param	_type	typ zmiennej: String
	 */
	set type(_type) {
		this._type = _type;
	}
	
	/**
	 * Ustawienie wartości zmiennej
	 *
	 * @param	_value	nowa wartość zmiennej: Number
	 */
	set value(_value) {
		this._value = _value + 0;	//< + 0 zamienia Boolean na Number

		if(this._isWritting)
			this.sync(_value);
		
		
		this.updateIndication();
	}
	
	sync(_value) {
		var control;
		for(var i = 0; i < Control._controls.length; i++) {
			control = Control._controls[i];
			
			if(control._id == this._id)
				continue;
			
			if(this._variable == control._variable && this._address == control._address) {
				control._syncingWith = this._id;
				control.value = _value;
			}
		}
	}
	
	/**
	 * Ustawienie czasu odświerzania
	 *
	 * @param	_interval	nowy czasu odświerzania w ms: Number
	 */
	set interval(_interval) {
		this._interval = _interval;
	}
	
	/**
	 * Ustawienie stylu kontrolki
	 *
	 * @param	_style	nowy styl kontrolki: Object
	 */
	set style(_style) {
		this._style = _style;
		this.updateStyle();
	}
	
	/**
	 * Pobranie stylu kontrolki
	 *
	 * @return	styl kontrolki: Object
	 */
	get style() {
		return this._style;
	}
	
	/**
	 * Dodanie kontrolki do DOM
	 *
	 * @param	_id		nadany identyfikator kontrolki: Number
	 * @param	parent	element DOM, do którego dodać kontrolkę: Object
	 */
	draw(_id, parent) {
		if(this._id != -1)
			return;
		
		this._id = _id;

		this._wrapper = $("<div></div>")
			.addClass("control")
			.attr("data-id", _id);
		
		if(this._svgPath)
			this.setSvg();		//< Styl kontrolki zostanie normalnie uaktualniony w onSvgLoaded(),
		else					//< chyba że SVG nie istnieje,
			this.updateStyle();	//< wtedy aktualizacja nastąpi tutaj.
		
		parent.append(this._wrapper);
	}
	
	/**
	 * Zapis nowej wartości zmiennej przy kolejnym wywołaniu metody update()
	 * 
	 * @param	_value	nowa wartość zmiennej: Number
	 */
	write(_value) {
		this._isWritting = true;
		this.value = _value;
	}
	
	/**
	 * Aktualizacja wartości zmiennej
	 * Jeśli rodzaj lub adres zmiennej nieokreślony, metoda nie ma efektu.
	 */
	update() {
		var self = this;
		
		if(!this._variable || !this._address)
			return;
		
		setTimeout(function () {self.update()}, this._interval);
	
		this.doWrite();
		this.doRead();
	}
	
	/**
	 * Zapis przechowywanej w kontrolce wartości zmiennej do bazy danych
	 */
	doWrite() {
		var self = this;
		
		if(!this._isWritting)
			return;
		
		$.get({
			url: "api.php",
			data: {
				"action": "write",
				"var": this._variable,
				"address": this._address,
				"type": this._type,
				"value": this._value
			},
			dataType: "json",
			complete: function (data) {
				self._isWritting = false;
			}
		});	
	}
	
	/**
	 * Odczyt wartości zmiennej z bazy danych
	 */
	doRead() {
		var self = this;
		
		if(this._isWritting)
			return;
		
		if(this._syncingWith != -1) {
			if(Control._controls[this._syncingWith]._isWritting)
				return;
			
			this._syncingWith = -1;
			return;
		}
		
		$.get({
			url: "api.php",
			data: {
				"action": "read",
				"var": this._variable,
				"address": this._address
			},
			dataType: "json",
			success: function (data) {
				if(self._isWritting)
					return;

				if(self._syncingWith != -1) {
					if(Control._controls[self._syncingWith]._isWritting)
						return;
					
					self._syncingWith = -1;
					return;
				}
				
				self.value = data.value;
			}
		});		
	}
	
	/**
	 * Aktualizacja wskazania kontrolki
	 * Metoda wywołuje zdarzenie aktualizacji wskazania kontrolki pod warunkiem, że kontrolka
	 * została utworzona.
	 */
	updateIndication() {
		if(!this._wrapper)
			return;
		
		this.onUpdateIndication();
	}

	/**
	 * Załadowanie grafiki SVG kontrolki
	 * Metoda wczytuje grafikę SVG powiązaną z daną kontrolką.
	 */
	setSvg() {
		var self = this;
		this._wrapper.load(this._svgPath, function () {
			self.onSvgLoaded(self._wrapper.find("svg"));
		});
	}
	
	/**
	 * Aktualizacja stylu kontrolki
	 * Metoda odpowiada za aktualizację wyglądu kontrolki w wyniku zmiany właściwości jej stylu.
	 * updateStyle() różni się od updateIndication() tym, że ta druga związana jest ze zmianą wartości zmiennej.
	 */
	updateStyle() {
		if(!this._wrapper)
			return;
		
		
		this._wrapper
			.css(this._style.position)
			.css(this._style.dimensions);
	};
	
	/**
	 * Zdarzenie aktualizacji wskazania kontrolki
	 */
	onUpdateIndication() {};
	
	/**
	 * Zdarzenie załadowania grafiki SVG kontrolki
	 * 
	 * @param	svg	obiekt jQuery elementu DOM zawierającego grafikę SVG: Object
	 */
	onSvgLoaded(svg) {
		this.updateIndication();
		this.updateStyle();
	};
}

/**
 * Statyczna tablica zawierająca referencje do wszystkich kontrolek
 */
Control._controls = [];

/**
 * Kontrolka przełącznika
 */
class Switch extends Control {
	constructor(variable, address)
	{
		super(variable, address);
		this._type = "BOOL";
		this._svgPath = "svg/switch.svg";
		this._style.dimensions = {
			width: 50,
			height: 50
		}
	}
	
	onSvgLoaded(svg) {
		super.onSvgLoaded(svg);
		var self = this;
		svg.click(function () {
			self.write(!self._value);
		});
	}
	
	onUpdateIndication() {
		var svg = this._wrapper.find("svg");
		var cx = 68.13;		//< circle's position when off
		
		if(this._value)
			cx = 82.682;	//< circle's position when on
		
		svg.find("circle").animate(
			{"cx": cx},
			{
				step: function (now) {
					$(this).attr("cx", now);
				},
				duration: 100
			}
		)
	}
}

/**
 * Kontrolka tekstu tylko do odczytu
 */
class Text extends Control {
	constructor(variable, address) {
		super(variable, address);
		this._style.text = "";
	}
	
	updateStyle() {
		super.updateStyle();
		this._wrapper.text(this._style.text);
	}
	
	onUpdateIndication() {
		var text = this.parseText(this._style.text);
		if(text)
			this._wrapper.text(text);
	}
	
	/**
	 * Parsowanie tekstu
	 * Metoda parsuje tekst w poszukiwaniu znaczników liczb (#) i zamienia je na wartość zmiennej.
	 *
	 * @param	text	tekst do sparsowania: String
	 * @return 			sparsowany tekst lub null, jeśli nie odnaleziono znaczników #: @Nullable String
	 */
	parseText(text) {
		var regexp = /#+\.?#*/;
		var matches = regexp.exec(text);
		
		if(matches) {
			var match = matches[0];
			var splittedMatch = match.split(".");
			
			var intPart = (this._value > 0) ? Math.floor(this._value) : Math.ceil(this._value);
			var intPartStr = "" + intPart;
			
			var zeros = splittedMatch[0].length - intPartStr.length;
			while(zeros > 0) {
				intPartStr = "0" + intPartStr;
				zeros--;
			}

			text = text.replace(splittedMatch[0], intPartStr);
			
			if(splittedMatch.length == 2) {
				var places = Math.pow(10, splittedMatch[1].length);
				
				var fractionPart = this._value * places;
				fractionPart -= intPart * places;
				fractionPart = Math.abs(Math.floor(fractionPart));
				
				var fractionPartStr = "" + fractionPart;
				
				text = text.replace(splittedMatch[1], fractionPartStr);
			}
			
			return text;
		}
		
		return null;
	}
}

/**
 * Kontrolka pola tekstowego
 */
class TextBox extends Text {
	constructor(variable, address) {
		super(variable, address);
		this._style.format = this._style.text;
		delete this._style.text;
	}
	
	updateStyle() {
		super.updateStyle();
		
		var self = this;
		var input = $('<input type"text" />')
			.val(this._style.format)
			.focus(function () {
				self._focused = true;
			})
			.keydown(function (event) {
				if(event.keyCode == 13)
					$(this).blur();
			})
			.blur(function (event) {				
				var value = parseFloat($(this).val());
				if(value != self._value)
					self.write(value);
				
				self._focused = false;
			});
		this._wrapper.html(input);
	}
	
	onUpdateIndication() {
		if(this._focused)
			return;
		
		var text = this.parseText(this._style.format);
		if(text)
			this._wrapper.find("input").val(text);
	}
}

/**
 * Kontrolka suwaka
 */
class Slider extends Control {
	constructor(variable, address) {
		super(variable, address);
		this._svgPath = "svg/slider.svg";
		this._style.dimensions = {
			width: 100,
			height: 200
		}
		this._style.values = {
			max: 100,
			min: 0
		}
	}
	
	onSvgLoaded(svg) {
		super.onSvgLoaded(svg);
		var self = this;
		svg.find(".handle").mousedown(function (event) {
			if(event.which != 1)
				return;
			
			self._grabbed = true;
			self._mouseHandleStart = event.pageY;
			self._handleStart = parseFloat($(this).attr("y"));
		});
		$(document)
			.mouseup(function (event) {
				if(event.which != 1)
					return;
				
				self._grabbed = false;
			})
			.mousemove(function (event) {
				self.sliderHandleMovement(event);
			});
	}
	
	updateStyle() {
		super.updateStyle();
		var labels = this._wrapper.find(".labels");
		var textMin = labels.find(".min tspan");
		var textMax = labels.find(".max tspan");
		
		textMin.text(this._style.values.min);
		textMax.text(this._style.values.max);
	}
	
	onUpdateIndication() {
		var runner = this._wrapper.find("svg .runner");
		var handle = this._wrapper.find("svg .handle");
		var maxY = runner.attr("height");
		
		var y = 0;
		
		if(this._value > this._style.values.max)
			y = maxY;
		else if(this._value < this._style.values.min)
			y = 0;
		else {
			var range = this._style.values.max - this._style.values.min;
			
			var y = this._value * maxY / range - maxY * this._style.values.min / range;
		}
		
		handle.attr("y", maxY - y);
	}
	
	sliderHandleMovement(event) {
		if(!this._grabbed)
			return;
		
		var svg = this._wrapper.find("svg");
		var handle = this._wrapper.find(".handle");
		var runner = this._wrapper.find(".runner");
		
		var viewBoxY = svg.attr("viewBox").split(" ")[3]		//[1]
		var scale = svg.height() / viewBoxY;					//[px]/[1]
		var offset = event.pageY - this._mouseHandleStart;		//[px]
		var dy = offset / scale;								//[1]
		var y = this._handleStart + dy;
		var maxY = runner.attr("height");
		var range = this._style.values.max - this._style.values.min;
		var value = range - y * range / maxY + this._style.values.min
		
		if(value > this._style.values.max)
			value = this._style.values.max;
		else if(value < this._style.values.min)
			value = this._style.values.min;
		
		this.write(value);
	}
}