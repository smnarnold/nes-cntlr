/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

var td = __webpack_require__(1);

function NESController() {
	var _this = this;

	var settings = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

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

	this.init = function () {
		_this.setFallbacks();
		_this.setSettings();
		_this.bindEvents();
		_this.setVirtual();
	};

	this.setFallbacks = function () {
		// Object assign 
		if (typeof Object.assign != 'function') _this.setObjectAssign();
	};

	this.setObjectAssign = function () {
		Object.assign = function (target, varArgs) {
			'use strict';

			if (target == null) {
				// TypeError if undefined or null
				throw new TypeError('Cannot convert undefined or null to object');
			}

			var to = Object(target);

			for (var index = 1; index < arguments.length; index++) {
				var nextSource = arguments[index];

				if (nextSource != null) {
					// Skip over if undefined or null
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
	};

	this.setSettings = function () {
		_this.settings = Object.assign({}, _this.defaultSettings, _this.userSettings);
	};

	this.bindEvents = function () {
		window.addEventListener('orientationchange', function (e) {
			return _this.orientationChange(e);
		});
		window.addEventListener('resize', function (e) {
			return td.debounce(300, function (e) {
				return _this.resize(e);
			});
		});
		document.addEventListener('keydown', function (e) {
			return _this.keyAction(e, true);
		});
		document.addEventListener('keyup', function (e) {
			return _this.keyAction(e, false);
		});
	};

	this.setVirtual = function () {
		if (_this.settings.virtual === 'always') {
			_this.virtual = true;
			_this.initTouch();
		} else if (_this.settings.virtual === 'never') {
			_this.virtual = false;
		} else {
			// Auto
			_this.detectType();

			if (_this.type === 'touch') {
				_this.virtual = true;
				_this.initTouch();
			}
		}
	};

	this.detectType = function () {
		var type = 'keyboard';

		if ('ontouchstart' in document.documentElement) type = 'touch';

		if (_this.type !== type) _this.type = type;
	};

	this.initTouch = function () {
		_this.setControllerStyles();
		_this.setControllerHtml();
		_this.resize();
		_this.bindTouchEvents();
	};

	this.setControllerStyles = function () {
		var css = '\n\t\t.nes-cntlr {\n\t\t\tposition: fixed;\n\t\t\tbottom: 0;\n\t\t\tleft: 0;\n\t\t\twidth: 100%;\n\t\t\tdisplay: flex;\n\t\t\tpadding: 0 15px 10px 15px;\n\t\t\tbox-sizing: border-box;\n\t\t\tjustify-content: space-between;\n\t\t\tperspective: 1000px;\n\t\t\tz-index: ' + _this.settings.zIndex + ';\n\t\t}\n\t\t.nes-cntlr__d-pad { transition: transform 0.2s; }\n\t\t.nes-cntlr__d-pad.is-up-left { transform: rotate3d(1, -1, 0, 8deg); }\n\t\t.nes-cntlr__d-pad.is-left { transform: rotate3d(0, -1, 0, 8deg); }\n\t\t.nes-cntlr__d-pad.is-down-left { transform: rotate3d(-1, -1, 0, 8deg); }\n\t\t.nes-cntlr__d-pad.is-up-right { transform: rotate3d(1, 1, 0, 8deg); }\n\t\t.nes-cntlr__d-pad.is-right { transform: rotate3d(0, 1, 0, 8deg); }\n\t\t.nes-cntlr__d-pad.is-down-right { transform: rotate3d(-1, 1, 0, 8deg); }\n\t\t.nes-cntlr__d-pad.is-up { transform: rotate3d(1, 0, 0, 8deg); }\n\t\t.nes-cntlr__d-pad.is-down { transform: rotate3d(-1, 0, 0, 8deg); }\n\n\t\t.nes-cntlr__btns.is-b .nes-cntlr__b,\n\t\t.nes-cntlr__btns.is-a .nes-cntlr__a { fill: #D64A80; }\n\t\t.nes-cntlr__btns.is-select .nes-cntlr__select,\n\t\t.nes-cntlr__btns.is-start .nes-cntlr__start { fill: #383d41; }\n\t\t';

		var head = document.head;
		var style = document.createElement('style');

		style.type = 'text/css';
		style.classList.add('nes-cntlr-styles');
		style.appendChild(document.createTextNode(css));
		head.appendChild(style);
	};

	this.setControllerHtml = function () {
		var controller = '\n\t\t\t<nav class="nes-cntlr">\n\t\t\t\t<svg xmlns="http://www.w3.org/2000/svg" width="85" height="107" viewBox="0 0 85 107" class="nes-cntlr__cell nes-cntlr__d-pad">\n\t\t\t\t\t<path fill="#2F3335" stroke="#B4B4B4" stroke-width="5" stroke-linecap="round" d="M30.981 2.5c-1.87 0-3.282 1.605-3.282 3.553v22.458H6.198c-1.872 0-3.415 1.607-3.415 3.553V55.74c0 1.945 1.543 3.553 3.415 3.553h21.501V81.75c0 1.947 1.412 3.416 3.282 3.416H54.02c1.869 0 3.282-1.469 3.282-3.416V59.293h21.501c1.871 0 3.414-1.607 3.414-3.553V32.063c0-1.946-1.543-3.553-3.414-3.553H57.302V6.053c0-1.947-1.413-3.553-3.282-3.553H30.981z"/>\n\t\t\t\t</svg>\n\t\t\t\t<svg xmlns="http://www.w3.org/2000/svg" width="100" height="107" viewBox="0 0 100 107" class="nes-cntlr__cell nes-cntlr__btns">\n\t\t\t\t\t<path fill="#B4B4B4" d="M48 69.584a5 5 0 0 1-5 5H5a5 5 0 0 1-5-5v-38a5 5 0 0 1 5-5h38a5 5 0 0 1 5 5v38z"/>\n\t\t\t\t\t<path class="nes-cntlr__b" fill="#AC3C66" d="M43.082 51.338c0 9.768-7.92 17.688-17.689 17.688S7.704 61.105 7.704 51.338c0-9.771 7.92-17.689 17.688-17.689 9.77-.002 17.69 7.918 17.69 17.689z"/>\n\t\t\t\t\t<path fill="#D64A80" d="M21.556 49.833h8.024v-2.006h-8.024v2.006zm0 4.679h8.024v-2.006h-8.024v2.006zm-2.674 2.674V45.151h9.36c2.674 0 4.012 1.212 4.012 3.637 0 .99-.215 1.783-.643 2.381.428.588.643 1.377.643 2.365 0 2.434-1.338 3.65-4.012 3.65h-9.36v.002z"/>\n\t\t\t\t\t<path fill="#B4B4B4" d="M100 69.753a5 5 0 0 1-5 5H57a5 5 0 0 1-5-5v-38a5 5 0 0 1 5-5h38a5 5 0 0 1 5 5v38z"/>\n\t\t\t\t\t<path class="nes-cntlr__a" fill="#AC3C66" d="M93.476 51.506c0 9.769-7.92 17.688-17.689 17.688s-17.688-7.92-17.688-17.688c0-9.77 7.92-17.689 17.688-17.689 9.769-.001 17.689 7.919 17.689 17.689z"/>\n\t\t\t\t\t<path fill="#D64A80" d="M79.798 51.505v-2.006c0-.892-.445-1.337-1.336-1.337h-5.35c-.892 0-1.337.445-1.337 1.337v2.006h8.023zm-8.023 2.674v3.344H69.1V49.5c0-2.674 1.338-4.011 4.012-4.011h5.35c2.674 0 4.01 1.337 4.01 4.011v8.022h-2.674v-3.344h-8.023z"/>\n\t\t\t\t\t<path class="nes-cntlr__select" fill="#2F3335" stroke="#B4B4B6" stroke-width="3" stroke-miterlimit="10" d="M11.734 80.328h24.84c5.377 0 9.734 3.512 9.734 7.843 0 4.332-4.357 7.843-9.734 7.843h-24.84C6.358 96.014 2 92.503 2 88.171c0-4.331 4.357-7.843 9.734-7.843z"/>\n\t\t\t\t\t<path fill="#AE3C66" d="M5.306 107h4.021c1.146 0 1.722-.525 1.722-1.579 0-1.053-.575-1.579-1.722-1.579H6.455v-.861h4.594v-1.148H7.027c-1.147 0-1.722.534-1.722 1.604 0 1.037.574 1.557 1.722 1.557h2.872v.859H5.306V107zm12.06 0h-4.021c-1.147 0-1.722-.574-1.722-1.723v-3.445h5.742v1.148H12.77v.861h4.595v1.147H12.77v.288c0 .383.191.574.574.574h4.021V107zm.567-5.174v3.445c0 1.147.575 1.724 1.722 1.724h4.021v-1.147h-4.021c-.383 0-.573-.193-.573-.576v-3.444l-1.149-.002zM29.994 107h-4.021c-1.147 0-1.722-.574-1.722-1.723v-3.445h5.743v1.148h-4.596v.861h4.596v1.147h-4.596v.288c0 .383.192.574.573.574h4.021l.002 1.15zm6.317 0h-4.02c-1.149 0-1.724-.574-1.724-1.723v-1.723c0-1.148.573-1.724 1.724-1.724h4.02v1.147h-4.02c-.383 0-.573.192-.573.576v1.723c0 .383.19.574.573.574h4.02V107zm.578-5.174h5.742v1.148h-2.297v4.021h-1.147v-4.021h-2.298v-1.148z"/>\n\t\t\t\t\t<path class="nes-cntlr__start" fill="#2F3335" stroke="#B4B4B6" stroke-width="3" stroke-miterlimit="10" d="M63.389 80.328h24.84c5.377 0 9.734 3.512 9.734 7.843 0 4.332-4.357 7.843-9.734 7.843h-24.84c-5.376 0-9.734-3.511-9.734-7.843-.001-4.331 4.357-7.843 9.734-7.843z"/>\n\t\t\t\t\t<path fill="#AE3C66" d="M60.815 106.939h3.918c1.119 0 1.678-.514 1.678-1.541 0-1.025-.559-1.538-1.678-1.538h-2.8v-.839h4.478v-1.12h-3.917c-1.12 0-1.679.52-1.679 1.561 0 1.013.56 1.517 1.679 1.517h2.798v.841h-4.477v1.119zm6.148-5.044h5.598v1.119h-2.239v3.918h-1.12v-3.918h-2.239v-1.119zm10.64 2.521v-.84c0-.373-.187-.561-.56-.561h-2.239c-.374 0-.56.188-.56.561v.84h3.359zm-3.359 1.12v1.399h-1.119v-3.358c0-1.119.561-1.679 1.679-1.679h2.239c1.119 0 1.679.56 1.679 1.679v3.358h-1.119v-1.399h-3.359zm6.152-1.682h3.357v-.84h-3.357v.84zm0 1.119v1.959h-1.119v-5.037h3.918c1.119 0 1.679.512 1.679 1.533 0 .485-.08.842-.24 1.069.16.265.24.608.24 1.035v1.399h-1.119v-1.399c0-.373-.187-.56-.56-.56h-2.799v.001zm5.043-3.078h5.597v1.119h-2.238v3.918h-1.119v-3.918H85.44l-.001-1.119z"/>\n\t\t\t\t</svg>\n\t\t\t</nav>';

		document.querySelector(_this.settings.location).insertAdjacentHTML('beforeend', controller);

		_this.dom.nesCntlr = document.querySelector('.nes-cntlr');
		_this.dom.dpad = document.querySelector('.nes-cntlr__d-pad');
		_this.dom.btns = document.querySelector('.nes-cntlr__btns');
	};

	this.removeController = function () {
		var styles = document.querySelector('.nes-cntlr-styles');
		styles.parentNode.removeChild(styles);

		_this.dom.nesCntlr.parentNode.removeChild(_this.dom.nesCntlr);
	};

	this.bindTouchEvents = function () {
		_this.dom.dpad.addEventListener('touchstart', function (e) {
			return _this.dpadMove(e);
		});
		_this.dom.dpad.addEventListener('touchmove', function (e) {
			return _this.dpadMove(e);
		});
		_this.dom.dpad.addEventListener('touchend', function (e) {
			return _this.dpadEnd(e);
		});
		_this.dom.dpad.addEventListener('touchcancel', function (e) {
			return _this.dpadEnd(e);
		});

		_this.dom.btns.addEventListener('touchstart', function (e) {
			return _this.btnsMove(e);
		});
		_this.dom.btns.addEventListener('touchmove', function (e) {
			return _this.btnsMove(e);
		});
		_this.dom.btns.addEventListener('touchend', function (e) {
			return _this.btnsEnd(e);
		});
		_this.dom.btns.addEventListener('touchcancel', function (e) {
			return _this.btnsEnd(e);
		});
	};

	this.orientationChange = function (e) {
		_this.resize();
	};

	this.resize = function () {
		_this.current = {
			dpad: {
				top: _this.dom.dpad.getBoundingClientRect().y,
				left: _this.dom.dpad.getBoundingClientRect().x
			},
			btns: {
				top: _this.dom.btns.getBoundingClientRect().y,
				left: _this.dom.btns.getBoundingClientRect().x
			}
		};
	};

	/* --- D-pad --- */
	this.dpadMove = function (e) {
		e.preventDefault();
		var posX = e.touches[0].pageX - _this.current.dpad.left;
		var posY = e.touches[0].pageY - _this.current.dpad.top;

		if (posX >= 0 && posX <= 85 && posX && posY >= 0 && posY <= 88) {
			if (posX < 28) {
				// Left
				if (posY < 28) _this.setTouchDirection('up-left', true);else if (posY < 59) _this.setTouchDirection('left', true);else _this.setTouchDirection('down-left', true);
			} else if (posX < 58) {
				// Center
				if (posY < 28) _this.setTouchDirection('up', true);else if (posY < 59) _this.setTouchDirection();else _this.setTouchDirection('down', true);
			} else {
				// Right
				if (posY < 28) _this.setTouchDirection('up-right', true);else if (posY < 59) _this.setTouchDirection('right', true);else _this.setTouchDirection('down-right', true);
			}
		} else _this.setTouchDirection();
	};

	this.dpadEnd = function (event) {
		_this.setTouchDirection();
	};

	this.setTouchDirection = function () {
		var direction = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
		var status = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

		if (status) {
			// Key down
			if (_this.current.dpad.active !== direction) {
				// Flag avoid repetition
				_this.triggerDirection(_this.current.dpad.active, false);
				_this.current.dpad.active = direction;
				_this.triggerDirection(_this.current.dpad.active, true);
			}
		} else {
			// Key up
			if (_this.current.dpad.active !== direction) {
				// Flag avoid repetition
				_this.triggerDirection(_this.current.dpad.active, false);
				_this.current.dpad.active = direction;
			}
		}
	};

	this.triggerDirection = function (direction, status) {
		if (direction !== null) {
			var params = { status: status };
			var event = window.CustomEvent ? new CustomEvent('controller:' + direction, { detail: params }) : document.createEvent('CustomEvent').initCustomEvent('controller:' + direction, true, true, params);
			document.body.dispatchEvent(event);
		}

		if (_this.virtual) {
			_this.dom.dpad.classList = 'nes-cntlr__cell nes-cntlr__d-pad';
			if (status) _this.dom.dpad.classList.add('is-' + direction);
		}
	};

	/* --- Btns --- */
	this.btnsMove = function (e) {
		e.preventDefault();
		var posX = e.touches[0].pageX - _this.current.btns.left;
		var posY = e.touches[0].pageY - _this.current.btns.top;

		if (posX >= 0 && posX <= 100 && posY >= 28 && posY <= 107) {
			var btn = null;

			if (posY < 77) // first row
				btn = posX < 50 ? 'b' : 'a';else // second row
				btn = posX < 50 ? 'select' : 'start';

			_this.setTouchBtns(btn, true);
		} else _this.setTouchBtns();
	};

	this.btnsEnd = function (event) {
		_this.setTouchBtns();
	};

	this.setTouchBtns = function () {
		var btn = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
		var status = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

		if (status) {
			// Key down
			if (_this.current.btns.active !== btn) {
				// Flag avoid repetition
				_this.triggerBtn(_this.current.btns.active, false);
				_this.current.btns.active = btn;
				_this.triggerBtn(_this.current.btns.active, true);
			}
		} else {
			// Key up
			if (_this.current.btns.active !== btn) {
				// Flag avoid repetition
				_this.triggerBtn(_this.current.btns.active, false);
				_this.current.btns.active = btn;
			}
		}
	};

	this.triggerBtn = function (btn, status) {
		if (btn !== null) {
			var params = { status: status };
			var event = window.CustomEvent ? new CustomEvent('controller:' + btn, { detail: params }) : document.createEvent('CustomEvent').initCustomEvent('controller:' + btn, true, true, params);
			document.body.dispatchEvent(event);
		}

		if (_this.virtual) {
			_this.dom.btns.classList = 'nes-cntlr__cell nes-cntlr__btns';
			if (status) _this.dom.btns.classList.add('is-' + btn);
		}
	};

	/* === Keyboard =============================================== */
	this.keyAction = function (e, status) {
		e = e || window.event;

		switch (e.keyCode) {
			case _this.settings.keys.start:
				_this.triggerBtn('start', status);
				break;
			case _this.settings.keys.select:
				_this.triggerBtn('select', status);
				break;
			case _this.settings.keys.left:
				_this.triggerDirection('left', status);
				break;
			case _this.settings.keys.up:
				_this.triggerDirection('up', status);
				break;
			case _this.settings.keys.right:
				_this.triggerDirection('right', status);
				break;
			case _this.settings.keys.down:
				_this.triggerDirection('down', status);
				break;
			case _this.settings.keys.b:
				_this.triggerBtn('b', status);
				break;
			case _this.settings.keys.a:
				_this.triggerBtn('a', status);
				break;
		};
	};

	this.init();
}

module.exports = {
	NESController: NESController
};

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

/* eslint-disable no-undefined */

var throttle = __webpack_require__(2);

/**
 * Debounce execution of a function. Debouncing, unlike throttling,
 * guarantees that a function is only executed a single time, either at the
 * very beginning of a series of calls, or at the very end.
 *
 * @param  {Number}   delay         A zero-or-greater delay in milliseconds. For event callbacks, values around 100 or 250 (or even higher) are most useful.
 * @param  {Boolean}  atBegin       Optional, defaults to false. If atBegin is false or unspecified, callback will only be executed `delay` milliseconds
 *                                  after the last debounced-function call. If atBegin is true, callback will be executed only at the first debounced-function call.
 *                                  (After the throttled-function has not been called for `delay` milliseconds, the internal counter is reset).
 * @param  {Function} callback      A function to be executed after delay milliseconds. The `this` context and all arguments are passed through, as-is,
 *                                  to `callback` when the debounced-function is executed.
 *
 * @return {Function} A new, debounced function.
 */
module.exports = function ( delay, atBegin, callback ) {
	return callback === undefined ? throttle(delay, atBegin, false) : throttle(delay, callback, atBegin !== false);
};


/***/ }),
/* 2 */
/***/ (function(module, exports) {

/* eslint-disable no-undefined,no-param-reassign,no-shadow */

/**
 * Throttle execution of a function. Especially useful for rate limiting
 * execution of handlers on events like resize and scroll.
 *
 * @param  {Number}    delay          A zero-or-greater delay in milliseconds. For event callbacks, values around 100 or 250 (or even higher) are most useful.
 * @param  {Boolean}   noTrailing     Optional, defaults to false. If noTrailing is true, callback will only execute every `delay` milliseconds while the
 *                                    throttled-function is being called. If noTrailing is false or unspecified, callback will be executed one final time
 *                                    after the last throttled-function call. (After the throttled-function has not been called for `delay` milliseconds,
 *                                    the internal counter is reset)
 * @param  {Function}  callback       A function to be executed after delay milliseconds. The `this` context and all arguments are passed through, as-is,
 *                                    to `callback` when the throttled-function is executed.
 * @param  {Boolean}   debounceMode   If `debounceMode` is true (at begin), schedule `clear` to execute after `delay` ms. If `debounceMode` is false (at end),
 *                                    schedule `callback` to execute after `delay` ms.
 *
 * @return {Function}  A new, throttled, function.
 */
module.exports = function ( delay, noTrailing, callback, debounceMode ) {

	// After wrapper has stopped being called, this timeout ensures that
	// `callback` is executed at the proper times in `throttle` and `end`
	// debounce modes.
	var timeoutID;

	// Keep track of the last time `callback` was executed.
	var lastExec = 0;

	// `noTrailing` defaults to falsy.
	if ( typeof noTrailing !== 'boolean' ) {
		debounceMode = callback;
		callback = noTrailing;
		noTrailing = undefined;
	}

	// The `wrapper` function encapsulates all of the throttling / debouncing
	// functionality and when executed will limit the rate at which `callback`
	// is executed.
	function wrapper () {

		var self = this;
		var elapsed = Number(new Date()) - lastExec;
		var args = arguments;

		// Execute `callback` and update the `lastExec` timestamp.
		function exec () {
			lastExec = Number(new Date());
			callback.apply(self, args);
		}

		// If `debounceMode` is true (at begin) this is used to clear the flag
		// to allow future `callback` executions.
		function clear () {
			timeoutID = undefined;
		}

		if ( debounceMode && !timeoutID ) {
			// Since `wrapper` is being called for the first time and
			// `debounceMode` is true (at begin), execute `callback`.
			exec();
		}

		// Clear any existing timeout.
		if ( timeoutID ) {
			clearTimeout(timeoutID);
		}

		if ( debounceMode === undefined && elapsed > delay ) {
			// In throttle mode, if `delay` time has been exceeded, execute
			// `callback`.
			exec();

		} else if ( noTrailing !== true ) {
			// In trailing throttle mode, since `delay` time has not been
			// exceeded, schedule `callback` to execute `delay` ms after most
			// recent execution.
			//
			// If `debounceMode` is true (at begin), schedule `clear` to execute
			// after `delay` ms.
			//
			// If `debounceMode` is false (at end), schedule `callback` to
			// execute after `delay` ms.
			timeoutID = setTimeout(debounceMode ? clear : exec, debounceMode === undefined ? delay - elapsed : delay);
		}

	}

	// Return the wrapper function.
	return wrapper;

};


/***/ })
/******/ ]);