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
		this._isWritting = false		//< Zmienna określa czy zapisać nową wartość zmiennej
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
		this.updateIndication();
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
		this.value = _value;
		this._isWritting = true;
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
		
		if(this._isWritting) {
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
		} else {
			$.get({
				url: "api.php",
				data: {
					"action": "read",
					"var": this._variable,
					"address": this._address
				},
				dataType: "json",
				success: function (data) {
					self.value = data.value;
				}
			});			
		}
		
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
	 * @param	svg	element DOM zawierający grafikę SVG: Object
	 */
	onSvgLoaded(svg) {
		this.updateIndication();
		this.updateStyle();
	};
}

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