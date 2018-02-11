var td = require('throttle-debounce/debounce');

function NESController(settings = {}) {
	this.dom = {};

	this.defaultSettings = {
		virtual: 'auto',
		location: 'body',
		keys: {
			start: 13,
			select: 32,
			left: 37,
			up: 38,
			right: 39,
			down: 40,
			b: 65,
			a: 83
		},
		zIndex: 100
	};

	this.userSettings = settings;

	this.current = {
		dpad: {
			top: 0,
			left: 0,
			active: null
		},
		btns: {
			top: 0,
			left: 0,
			active: null
		}
	};

	this.type = null;
	this.virtual = false;

	/* ---- */

	this.init = () => {
		this.setFallbacks();
		this.setSettings();
		this.bindEvents();
		this.setVirtual();
	};

	this.setFallbacks = () => {
		// Object assign 
		if (typeof Object.assign != 'function')
			this.setObjectAssign();
	};

	this.setObjectAssign = () => {
		Object.assign = function(target, varArgs) {
			'use strict';
			if (target == null) { // TypeError if undefined or null
				throw new TypeError('Cannot convert undefined or null to object');
			}

			var to = Object(target);

			for (var index = 1; index < arguments.length; index++) {
				var nextSource = arguments[index];

			    if (nextSource != null) { // Skip over if undefined or null
				  	for (var nextKey in nextSource) {
						// Avoid bugs when hasOwnProperty is shadowed
						if (Object.prototype.hasOwnProperty.call(nextSource, nextKey)) {
							to[nextKey] = nextSource[nextKey];
						}
				    }
				}
			}
			return to;
		};
	}

	this.setSettings = () => {
		this.settings = Object.assign({}, this.defaultSettings, this.userSettings);
	}

	this.bindEvents = () => {
		window.addEventListener('orientationchange', e => this.orientationChange(e) );
		window.addEventListener('resize', e => td.debounce(300, e => this.resize(e)) );
		document.addEventListener('keydown', e => this.keyAction(e, true) );
		document.addEventListener('keyup', e => this.keyAction(e, false) );
	};

	this.setVirtual = () => {
		if(this.settings.virtual === 'always') {
			this.virtual = true;
			this.initTouch();
		} else if(this.settings.virtual === 'never') {
			this.virtual = false;
		} else { // Auto
			this.detectType();

			if(this.type === 'touch') {
				this.virtual = true;
				this.initTouch();
			}
		}
	};

	this.detectType = () => {
		let type = 'keyboard';

		if ('ontouchstart' in document.documentElement)
			type = 'touch';

		if(this.type !== type)
			this.type = type;
	};

	this.initTouch = () => {
		this.setControllerStyles();
		this.setControllerHtml();
		this.resize();
		this.bindTouchEvents();
	};

	this.setControllerStyles = () => {
		let css = `
		.nes-cntlr {
			position: fixed;
			bottom: 0;
			left: 0;
			width: 100%;
			display: flex;
			padding: 0 15px 10px 15px;
			box-sizing: border-box;
			justify-content: space-between;
			perspective: 1000px;
			z-index: ${this.settings.zIndex};
		}
		.nes-cntlr__d-pad { transition: transform 0.2s; }
		.nes-cntlr__d-pad.is-up-left { transform: rotate3d(1, -1, 0, 8deg); }
		.nes-cntlr__d-pad.is-left { transform: rotate3d(0, -1, 0, 8deg); }
		.nes-cntlr__d-pad.is-down-left { transform: rotate3d(-1, -1, 0, 8deg); }
		.nes-cntlr__d-pad.is-up-right { transform: rotate3d(1, 1, 0, 8deg); }
		.nes-cntlr__d-pad.is-right { transform: rotate3d(0, 1, 0, 8deg); }
		.nes-cntlr__d-pad.is-down-right { transform: rotate3d(-1, 1, 0, 8deg); }
		.nes-cntlr__d-pad.is-up { transform: rotate3d(1, 0, 0, 8deg); }
		.nes-cntlr__d-pad.is-down { transform: rotate3d(-1, 0, 0, 8deg); }

		.nes-cntlr__btns.is-b .nes-cntlr__b,
		.nes-cntlr__btns.is-a .nes-cntlr__a { fill: #D64A80; }
		.nes-cntlr__btns.is-select .nes-cntlr__select,
		.nes-cntlr__btns.is-start .nes-cntlr__start { fill: #383d41; }
		`;

	    let head = document.head;
	    let style = document.createElement('style');

    	style.type = 'text/css';
    	style.classList.add('nes-cntlr-styles')
		style.appendChild( document.createTextNode(css) );
		head.appendChild(style);
	};

	this.setControllerHtml = () => {
		let controller = `
			<nav class="nes-cntlr">
				<svg xmlns="http://www.w3.org/2000/svg" width="85" height="107" viewBox="0 0 85 107" class="nes-cntlr__cell nes-cntlr__d-pad">
					<path fill="#2F3335" stroke="#B4B4B4" stroke-width="5" stroke-linecap="round" d="M30.981 2.5c-1.87 0-3.282 1.605-3.282 3.553v22.458H6.198c-1.872 0-3.415 1.607-3.415 3.553V55.74c0 1.945 1.543 3.553 3.415 3.553h21.501V81.75c0 1.947 1.412 3.416 3.282 3.416H54.02c1.869 0 3.282-1.469 3.282-3.416V59.293h21.501c1.871 0 3.414-1.607 3.414-3.553V32.063c0-1.946-1.543-3.553-3.414-3.553H57.302V6.053c0-1.947-1.413-3.553-3.282-3.553H30.981z"/>
				</svg>
				<svg xmlns="http://www.w3.org/2000/svg" width="100" height="107" viewBox="0 0 100 107" class="nes-cntlr__cell nes-cntlr__btns">
					<path fill="#B4B4B4" d="M48 69.584a5 5 0 0 1-5 5H5a5 5 0 0 1-5-5v-38a5 5 0 0 1 5-5h38a5 5 0 0 1 5 5v38z"/>
					<path class="nes-cntlr__b" fill="#AC3C66" d="M43.082 51.338c0 9.768-7.92 17.688-17.689 17.688S7.704 61.105 7.704 51.338c0-9.771 7.92-17.689 17.688-17.689 9.77-.002 17.69 7.918 17.69 17.689z"/>
					<path fill="#D64A80" d="M21.556 49.833h8.024v-2.006h-8.024v2.006zm0 4.679h8.024v-2.006h-8.024v2.006zm-2.674 2.674V45.151h9.36c2.674 0 4.012 1.212 4.012 3.637 0 .99-.215 1.783-.643 2.381.428.588.643 1.377.643 2.365 0 2.434-1.338 3.65-4.012 3.65h-9.36v.002z"/>
					<path fill="#B4B4B4" d="M100 69.753a5 5 0 0 1-5 5H57a5 5 0 0 1-5-5v-38a5 5 0 0 1 5-5h38a5 5 0 0 1 5 5v38z"/>
					<path class="nes-cntlr__a" fill="#AC3C66" d="M93.476 51.506c0 9.769-7.92 17.688-17.689 17.688s-17.688-7.92-17.688-17.688c0-9.77 7.92-17.689 17.688-17.689 9.769-.001 17.689 7.919 17.689 17.689z"/>
					<path fill="#D64A80" d="M79.798 51.505v-2.006c0-.892-.445-1.337-1.336-1.337h-5.35c-.892 0-1.337.445-1.337 1.337v2.006h8.023zm-8.023 2.674v3.344H69.1V49.5c0-2.674 1.338-4.011 4.012-4.011h5.35c2.674 0 4.01 1.337 4.01 4.011v8.022h-2.674v-3.344h-8.023z"/>
					<path class="nes-cntlr__select" fill="#2F3335" stroke="#B4B4B6" stroke-width="3" stroke-miterlimit="10" d="M11.734 80.328h24.84c5.377 0 9.734 3.512 9.734 7.843 0 4.332-4.357 7.843-9.734 7.843h-24.84C6.358 96.014 2 92.503 2 88.171c0-4.331 4.357-7.843 9.734-7.843z"/>
					<path fill="#AE3C66" d="M5.306 107h4.021c1.146 0 1.722-.525 1.722-1.579 0-1.053-.575-1.579-1.722-1.579H6.455v-.861h4.594v-1.148H7.027c-1.147 0-1.722.534-1.722 1.604 0 1.037.574 1.557 1.722 1.557h2.872v.859H5.306V107zm12.06 0h-4.021c-1.147 0-1.722-.574-1.722-1.723v-3.445h5.742v1.148H12.77v.861h4.595v1.147H12.77v.288c0 .383.191.574.574.574h4.021V107zm.567-5.174v3.445c0 1.147.575 1.724 1.722 1.724h4.021v-1.147h-4.021c-.383 0-.573-.193-.573-.576v-3.444l-1.149-.002zM29.994 107h-4.021c-1.147 0-1.722-.574-1.722-1.723v-3.445h5.743v1.148h-4.596v.861h4.596v1.147h-4.596v.288c0 .383.192.574.573.574h4.021l.002 1.15zm6.317 0h-4.02c-1.149 0-1.724-.574-1.724-1.723v-1.723c0-1.148.573-1.724 1.724-1.724h4.02v1.147h-4.02c-.383 0-.573.192-.573.576v1.723c0 .383.19.574.573.574h4.02V107zm.578-5.174h5.742v1.148h-2.297v4.021h-1.147v-4.021h-2.298v-1.148z"/>
					<path class="nes-cntlr__start" fill="#2F3335" stroke="#B4B4B6" stroke-width="3" stroke-miterlimit="10" d="M63.389 80.328h24.84c5.377 0 9.734 3.512 9.734 7.843 0 4.332-4.357 7.843-9.734 7.843h-24.84c-5.376 0-9.734-3.511-9.734-7.843-.001-4.331 4.357-7.843 9.734-7.843z"/>
					<path fill="#AE3C66" d="M60.815 106.939h3.918c1.119 0 1.678-.514 1.678-1.541 0-1.025-.559-1.538-1.678-1.538h-2.8v-.839h4.478v-1.12h-3.917c-1.12 0-1.679.52-1.679 1.561 0 1.013.56 1.517 1.679 1.517h2.798v.841h-4.477v1.119zm6.148-5.044h5.598v1.119h-2.239v3.918h-1.12v-3.918h-2.239v-1.119zm10.64 2.521v-.84c0-.373-.187-.561-.56-.561h-2.239c-.374 0-.56.188-.56.561v.84h3.359zm-3.359 1.12v1.399h-1.119v-3.358c0-1.119.561-1.679 1.679-1.679h2.239c1.119 0 1.679.56 1.679 1.679v3.358h-1.119v-1.399h-3.359zm6.152-1.682h3.357v-.84h-3.357v.84zm0 1.119v1.959h-1.119v-5.037h3.918c1.119 0 1.679.512 1.679 1.533 0 .485-.08.842-.24 1.069.16.265.24.608.24 1.035v1.399h-1.119v-1.399c0-.373-.187-.56-.56-.56h-2.799v.001zm5.043-3.078h5.597v1.119h-2.238v3.918h-1.119v-3.918H85.44l-.001-1.119z"/>
				</svg>
			</nav>`;

		document.querySelector(this.settings.location).insertAdjacentHTML('beforeend', controller);

		this.dom.nesCntlr = document.querySelector('.nes-cntlr');
		this.dom.dpad = document.querySelector('.nes-cntlr__d-pad');
		this.dom.btns = document.querySelector('.nes-cntlr__btns');
	};

	this.removeController = () => {
		let styles = document.querySelector('.nes-cntlr-styles');
		styles.parentNode.removeChild(styles);

		this.dom.nesCntlr.parentNode.removeChild(this.dom.nesCntlr);
	}

	this.bindTouchEvents = () => {
		this.dom.dpad.addEventListener('touchstart', e => this.dpadMove(e) );
		this.dom.dpad.addEventListener('touchmove', e => this.dpadMove(e) );
		this.dom.dpad.addEventListener('touchend', e => this.dpadEnd(e) );
		this.dom.dpad.addEventListener('touchcancel', e => this.dpadEnd(e) );

		this.dom.btns.addEventListener('touchstart', e => this.btnsMove(e) );
		this.dom.btns.addEventListener('touchmove', e => this.btnsMove(e) );
		this.dom.btns.addEventListener('touchend', e => this.btnsEnd(e) );
		this.dom.btns.addEventListener('touchcancel', e => this.btnsEnd(e) );
	}

	this.orientationChange = e => {
		this.resize();
	}

	this.resize = () => {
		this.current = {
			dpad: {
				top: this.dom.dpad.getBoundingClientRect().y,
				left: this.dom.dpad.getBoundingClientRect().x
			},
			btns: {
				top: this.dom.btns.getBoundingClientRect().y,
				left: this.dom.btns.getBoundingClientRect().x
			}
		};
	}

	/* --- D-pad --- */
	this.dpadMove = e => {
		e.preventDefault();
		let posX = e.touches[0].pageX - this.current.dpad.left;
		let posY = e.touches[0].pageY - this.current.dpad.top;

		if(posX >= 0 && posX <= 85 && posX && posY >= 0 && posY <= 88) {
			if(posX < 28) { // Left
				if(posY < 28)
					this.setTouchDirection('up-left', true);
				else if(posY < 59)
					this.setTouchDirection('left', true);
				else
					this.setTouchDirection('down-left', true);
			} else if(posX < 58) { // Center
				if(posY < 28)
					this.setTouchDirection('up', true);
				else if(posY < 59)
					this.setTouchDirection();
				else
					this.setTouchDirection('down', true);
			} else { // Right
				if(posY < 28)
					this.setTouchDirection('up-right', true);
				else if(posY < 59)
					this.setTouchDirection('right', true);
				else
					this.setTouchDirection('down-right', true);
			}
		} else
			this.setTouchDirection();
	}

	this.dpadEnd = event => {
		this.setTouchDirection();
	}

	this.setTouchDirection = (direction = null, status = false) => {
		if(status) { // Key down
			if(this.current.dpad.active !== direction) { // Flag avoid repetition
				this.triggerDirection(this.current.dpad.active, false);
				this.current.dpad.active = direction;
				this.triggerDirection(this.current.dpad.active, true);
			}
		} else { // Key up
			if(this.current.dpad.active !== direction) { // Flag avoid repetition
				this.triggerDirection(this.current.dpad.active, false);
				this.current.dpad.active = direction;
			}
		}
	};

	this.triggerDirection = (direction, status) => {
		if(direction !== null) {
			let params = {status: status};
			let event = window.CustomEvent ? new CustomEvent(`controller:${direction}`, {detail: params}) : document.createEvent('CustomEvent').initCustomEvent(`controller:${direction}`, true, true, params);
			document.body.dispatchEvent(event);
		}
		
		if(this.virtual) {
			this.dom.dpad.classList = 'nes-cntlr__cell nes-cntlr__d-pad';
			if(status)
				this.dom.dpad.classList.add(`is-${direction}`);
		}
	}

	/* --- Btns --- */
	this.btnsMove = e => {
		e.preventDefault();
		let posX = e.touches[0].pageX - this.current.btns.left;
		let posY = e.touches[0].pageY - this.current.btns.top;

		if(posX >= 0 && posX <= 100 && posY >= 28 && posY <= 107) {
			let btn = null;

			if(posY < 77) // first row
				btn = posX < 50 ? 'b' : 'a';
			else // second row
				btn = posX < 50 ? 'select' : 'start';

			this.setTouchBtns(btn, true);
		} else
			this.setTouchBtns();
	}

	this.btnsEnd = event => {
		this.setTouchBtns();
	}

	this.setTouchBtns = (btn = null, status = false) => {
		if(status) { // Key down
			if(this.current.btns.active !== btn) { // Flag avoid repetition
				this.triggerBtn(this.current.btns.active, false);
				this.current.btns.active = btn;
				this.triggerBtn(this.current.btns.active, true);
			}
		} else { // Key up
			if(this.current.btns.active !== btn) { // Flag avoid repetition
				this.triggerBtn(this.current.btns.active, false);
				this.current.btns.active = btn;
			}
		}
	};

	this.triggerBtn = (btn, status) => {
		if(btn !== null) {
			let params = {status: status};
			let event = window.CustomEvent ? new CustomEvent(`controller:${btn}`, {detail: params}) : document.createEvent('CustomEvent').initCustomEvent(`controller:${btn}`, true, true, params);
			document.body.dispatchEvent(event);
		}

		if(this.virtual) {
			this.dom.btns.classList = 'nes-cntlr__cell nes-cntlr__btns';
			if(status)
				this.dom.btns.classList.add(`is-${btn}`);
		}
	}

	/* === Keyboard =============================================== */
	this.keyAction = (e, status) => {
		e = e || window.event;

		switch (e.keyCode) {
			case this.settings.keys.start:
				this.triggerBtn('start', status);
				break;
			case this.settings.keys.select:
				this.triggerBtn('select', status);
				break;
			case this.settings.keys.left:
				this.triggerDirection('left', status);
				break;
			case this.settings.keys.up:
				this.triggerDirection('up', status);
				break;
			case this.settings.keys.right:
				this.triggerDirection('right', status);
				break;
			case this.settings.keys.down:
				this.triggerDirection('down', status);
				break;
			case this.settings.keys.b:
				this.triggerBtn('b', status);
				break;
			case this.settings.keys.a:
				this.triggerBtn('a', status);
				break;
		};
	};

	this.init();
}

module.exports = {  
    NESController: NESController
}