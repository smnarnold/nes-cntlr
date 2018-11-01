'use strict';

const debounce = require('throttle-debounce/debounce');
const objectAssign = require('object-assign');
const virtualCntlr = require('./lib/VirtualCntlr');

class NESCntlr {
  constructor(settings) {
    this.dom = {};

    this.settings = {
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
      location: 'body',
      prefix: 'player1',
      virtual: 'auto',
      styles: {
        inline: true,
        colors: ['#2F3335', '#383d41', '#AC3C66', '#D64A80', '#B4B4B4'],
        zIndex: 100
      }
    };

    this.settings = objectAssign(this.settings, settings);

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

    this.keysMap = {};
    this.timming = {};

    this.showVirtualCntlr = false;
  }

  init() {
    this.setVirtualCntlr();
    this.bindEvents();
  }

  setVirtualCntlr() {
    switch (this.settings.virtual) {
    case 'always':
      this.showVirtualCntlr = true;
      this.createVirtualCntlr();
      break;
    case 'never':
      this.showVirtualCntlr = false;
      this.destroyVirtualCntlr();
      break;
    default: // 'auto'
      this.showVirtualCntlr = false;
      if (this.isTouchDevice) {
        this.showVirtualCntlr = true;
      }

      if(this.showVirtualCntlr) {
        this.createVirtualCntlr();
      } else {
        this.destroyVirtualCntlr();
      }
    };
  }

  get isTouchDevice() {
    return 'ontouchstart' in window || window.DocumentTouch && document instanceof DocumentTouch;
  }

  bindEvents() {
    window.addEventListener('orientationchange', e => this.refresh(e) );
    window.addEventListener('resize', e => debounce(300, e => this.refresh(e)) );
    document.addEventListener('keydown', e => this.keyAction(e, true) );
    document.addEventListener('keyup', e => this.keyAction(e, false) );
  }

  keyAction(e, status) {
    e = e || window.event;

    console.log(e.keyCode, status);
    // if(!status) {
    //   console.log(e.keyCode, this.current.dpad.active);
    //   this.triggerEvent(this.dom.dpad, '', status);
    // }

    this.keysMap[e.keyCode] = status;
    if(!status) {
      console.log(this.current.direction);
    }


    switch (e.keyCode) {
      case this.settings.keys.start:
        this.triggerEvent(this.dom.btns, 'start', status);
        break;
      case this.settings.keys.select:
        this.triggerEvent(this.dom.btns, 'select', status);
        break;
      case this.settings.keys.b:
        this.triggerEvent(this.dom.btns, 'b', status);
        break;
      case this.settings.keys.a:
        this.triggerEvent(this.dom.btns, 'a', status);
        break;
    };

    if (this.keysMap[this.settings.keys.up] && this.keysMap[this.settings.keys.left]) {
      if(status) this.current.direction = 'up-left';
      this.setTouchDirection('up-left', status);
    } else if(this.keysMap[this.settings.keys.up] && this.keysMap[this.settings.keys.right]) {
      if(status) this.current.direction = 'up-right';
      this.setTouchDirection('up-right', status);
    } else if(this.keysMap[this.settings.keys.down] && this.keysMap[this.settings.keys.left]) {
      if(status) this.current.direction = 'down-left';
      this.setTouchDirection('down-left', status);
    } else if(this.keysMap[this.settings.keys.down] && this.keysMap[this.settings.keys.right]) {
      if(status) this.current.direction = 'down-right';
      this.setTouchDirection('down-right', status);
    } else if(this.keysMap[this.settings.keys.up]) {
      if(status) this.current.direction = 'up';
      this.setTouchDirection('up', status);
    } else if(this.keysMap[this.settings.keys.down]) {
      if(status) this.current.direction = 'down';
      this.setTouchDirection('down', status);
    } else if(this.keysMap[this.settings.keys.right]) {
      if(status) this.current.direction = 'right';
      this.setTouchDirection('right', status);
    } else if(this.keysMap[this.settings.keys.left]) {
      if(status) this.current.direction = 'left';
      this.setTouchDirection('left', status);
    } else {
      if(status) this.current.direction = '';
      //this.triggerEvent(this.dom.dpad, this.current.direction, status);
      this.setTouchDirection(this.current.direction, status);
    }
  }

  createVirtualCntlr() {
    if(typeof this.controller === 'undefined') {
      this.controller = new virtualCntlr(this.settings);
      this.controller.create();

      this.dom.dpad = document.querySelector(`.${this.settings.prefix}-cntlr .d-pad`);
      this.dom.btns = document.querySelector(`.${this.settings.prefix}-cntlr .btns`);

      this.setVirtualCntlrPos();

      this.dom.dpad.addEventListener('touchstart', e => this.dpadMove(e) );
      this.dom.dpad.addEventListener('touchmove', e => this.dpadMove(e) );
      this.dom.dpad.addEventListener('touchend', () => this.dpadEnd() );
      this.dom.dpad.addEventListener('touchcancel', () => this.dpadEnd() );

      this.dom.btns.addEventListener('touchstart', e => this.btnsMove(e) );
      this.dom.btns.addEventListener('touchmove', e => this.btnsMove(e) );
      this.dom.btns.addEventListener('touchend', () => this.btnsEnd() );
      this.dom.btns.addEventListener('touchcancel', () => this.btnsEnd() );
    }
  }

  destroyVirtualCntlr() {
    if(typeof this.controller !== 'undefined') {
      this.controller.destroy();

      this.dom.dpad = this.dom.btns = null;

      this.dom.dpad.removeEventListener('touchstart', e => this.dpadMove(e) );
      this.dom.dpad.removeEventListener('touchmove', e => this.dpadMove(e) );
      this.dom.dpad.removeEventListener('touchend', e => this.dpadEnd(e) );
      this.dom.dpad.removeEventListener('touchcancel', e => this.dpadEnd(e) );

      this.dom.btns.removeEventListener('touchstart', e => this.btnsMove(e) );
      this.dom.btns.removeEventListener('touchmove', e => this.btnsMove(e) );
      this.dom.btns.removeEventListener('touchend', e => this.btnsEnd(e) );
      this.dom.btns.removeEventListener('touchcancel', e => this.btnsEnd(e) );
    }
  }

  refresh() {
    this.setVirtualCntlr();
    this.setVirtualCntlrPos();
  }

  setVirtualCntlrPos() {
    if(this.dom.dpad && this.dom.btns) {
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
  }

  dpadMove(e) {
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
		} else {
			this.setTouchDirection();
		}
	}

	dpadEnd() {
		this.setTouchDirection();
	}

	setTouchDirection(direction = null, status = false) {
		if(status) { // Key down
			if(this.current.dpad.active !== direction) { // Flag avoid repetition
				this.triggerEvent(this.dom.dpad, this.current.dpad.active, false);
				this.current.dpad.active = direction;
				this.triggerEvent(this.dom.dpad, this.current.dpad.active, true);
			}
		} else { // Key up
			if(this.current.dpad.active !== direction) { // Flag avoid repetition
				this.triggerEvent(this.dom.dpad, this.current.dpad.active, false);
				this.current.dpad.active = direction;
			}
		}
	}

	btnsMove(e) {
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
		} else {
			this.setTouchBtns();
		}
	}

	btnsEnd() {
		this.setTouchBtns();
	}

	setTouchBtns(btn = null, status = false) {
		if(status) { // Key down
			if(this.current.btns.active !== btn) { // Flag avoid repetition
				this.triggerEvent(this.dom.btns, this.current.btns.active, false);
				this.current.btns.active = btn;
				this.triggerEvent(this.dom.btns, this.current.btns.active, true);
			}
		} else { // Key up
			if(this.current.btns.active !== btn) { // Flag avoid repetition
				this.triggerEvent(this.dom.btns, this.current.btns.active, false);
				this.current.btns.active = btn;
			}
		}
	}

	triggerEvent(el, btn, status) {
    //console.log(btn, status);
		if(btn !== null) {
			let params = {
        pressed: status,
        btn: btn
      };

			if(status) {
				this.timming[btn] = new Date();
			} else {
				params.duration = new Date() - this.timming[btn];
			}

			let event = window.CustomEvent ? new CustomEvent(`${this.settings.prefix}:${btn}`, {detail: params}) : document.createEvent('CustomEvent').initCustomEvent(`${this.settings.prefix}:${btn}`, true, true, params);
			document.body.dispatchEvent(event);
		}

		if(this.showVirtualCntlr && el) {
			el.classList = el.getAttribute('data-default-class');

			if(status) {
				el.classList.add(`is-${btn}`);
      }
		}
	}
}

if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
  module.exports = NESCntlr;
} else {
  if (typeof define === 'function' && define.amd) {
    define([], () => {
      return NESCntlr;
    });
  } else {
    window.NESCntlr = NESCntlr;
  }
}
