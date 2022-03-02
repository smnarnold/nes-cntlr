import debounce from 'lodash/debounce';
import virtualCntlr from './virtual-cntlr';

class NESCntlr {
  constructor(settings) {
    this.dom = {};

    this.settings = {
      keys: {
        start: 'Enter',
        select: 'Space',
        left: 'ArrowLeft',
        up: 'ArrowUp',
        right: 'ArrowRight',
        down: 'ArrowDown',
        b: 'KeyZ',
        a: 'KeyX'
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

    this.settings = { ...this.settings, ...settings };

    this.current = {
      dpad: {
        top: 0,
        left: 0,
        active: null
      },
      btns: {
        prev: null,
        top: 0,
        left: 0,
        active: null
      }
    };

    this.keys = {
      pressed: {}
    };
    this.timming = {};

    this.showVirtualCntlr = false;

    this.init();
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
      this.showVirtualCntlr = this.isTouchDevice;

      if (this.showVirtualCntlr) {
        this.createVirtualCntlr();
      } else {
        this.destroyVirtualCntlr();
      }
    };
  }

  get isTouchDevice() {
    let touchDetected = 'ontouchstart' in window || window.DocumentTouch && document instanceof DocumentTouch;
    return touchDetected ? true : false;
  }

  bindEvents() {
    window.addEventListener('orientationchange', () => this.refresh());
    window.addEventListener('resize', debounce(() => this.refresh(), 300));
		window.addEventListener('keydown', e => this.keyAction(e, true));
		window.addEventListener('keyup', e => this.keyAction(e, false));
  }

  keyAction(e, status) {
    e = e || window.event;

    if (!e.repeat) {
      if (status)
        this.keys.pressed[e.code] = true;
      else
        delete this.keys.pressed[e.code];

      if (e.code === this.settings.keys.select) this.setTouchBtns('select', status);
      if (e.code === this.settings.keys.start) this.setTouchBtns('start', status);
      if (e.code === this.settings.keys.b) this.setTouchBtns('b', status);
      if (e.code === this.settings.keys.a) this.setTouchBtns('a', status);

      let direction = null;

      if (this.keys.pressed.hasOwnProperty(this.settings.keys.up) && this.keys.pressed.hasOwnProperty(this.settings.keys.left)) {
        direction = 'up-left';
      } else if (this.keys.pressed.hasOwnProperty(this.settings.keys.up) && this.keys.pressed.hasOwnProperty(this.settings.keys.right)) {
        direction = 'up-right';
      } else if (this.keys.pressed.hasOwnProperty(this.settings.keys.down) && this.keys.pressed.hasOwnProperty(this.settings.keys.left)) {
        direction = 'down-left';
      } else if (this.keys.pressed.hasOwnProperty(this.settings.keys.down) && this.keys.pressed.hasOwnProperty(this.settings.keys.right)) {
        direction = 'down-right';
      } else if (this.keys.pressed.hasOwnProperty(this.settings.keys.up)) {
        direction = 'up';
      } else if (this.keys.pressed.hasOwnProperty(this.settings.keys.down)) {
        direction = 'down';
      } else if (this.keys.pressed.hasOwnProperty(this.settings.keys.right)) {
        direction = 'right';
      } else if (this.keys.pressed.hasOwnProperty(this.settings.keys.left)) {
        direction = 'left';
      }

      this.setTouchDirection(direction);
    }
  }

  createVirtualCntlr() {
    if (typeof this.controller === 'undefined') {
      this.controller = new virtualCntlr(this.settings);
      this.controller.create();

      this.dom.el = document.querySelector(`.${this.settings.prefix}-cntlr`);
      this.dom.dpad = document.querySelector(`.${this.settings.prefix}-cntlr .d-pad`);
      this.dom.btns = document.querySelector(`.${this.settings.prefix}-cntlr .btns`);

      this.setVirtualCntlrPos();

      this.dom.el.addEventListener('touchstart', e => this.touchMove(e), false);
      this.dom.el.addEventListener('touchmove', e => this.touchMove(e), false);
      this.dom.el.addEventListener('touchend', e => this.touchEnd(e), false);
      this.dom.el.addEventListener('touchcancel', e => this.touchEnd(e), false);
    }
  }

  destroyVirtualCntlr() {
    if (typeof this.controller !== 'undefined') {
      this.controller.destroy();

      this.dom.el.removeEventListener('touchstart', e => this.touchMove(e), false);
      this.dom.el.removeEventListener('touchmove', e => this.touchMove(e), false);
      this.dom.el.removeEventListener('touchend', () => this.touchEnd(), false);
      this.dom.el.removeEventListener('touchcancel', () => this.touchEnd(), false);

      this.dom.el = null;
    }
  }

  refresh() {
    this.setVirtualCntlr();
    this.setVirtualCntlrPos();
  }

  setVirtualCntlrPos() {
    if (this.dom.dpad && this.dom.btns) {
      const dpadRect = this.dom.dpad.getBoundingClientRect();
      const btnsRect = this.dom.btns.getBoundingClientRect();

      this.current.dpad.top = dpadRect.y;
      this.current.dpad.left = dpadRect.x;
      this.current.dpad.right = dpadRect.right;

      this.current.btns.top = btnsRect.y;
      this.current.btns.left = btnsRect.x;
      this.current.btns.right = btnsRect.right;
    }
  }

  touchMove(e) {
    e.preventDefault();

    Array.from(e.touches).forEach(t => {
      if (t.pageX > this.current.dpad.left && t.pageX < this.current.dpad.right) {
        this.dpadMove(t);
      } else if (t.pageX > this.current.btns.left && t.pageX < this.current.btns.right) {
        this.btnsMove(t);
      }
    });
  }

  touchEnd(e) {
    if (this.current.dpad.active && this.current.btns.active) {
      Array.from(e.changedTouches).forEach(t => {
        if (t.pageX > this.current.dpad.left && t.pageX < this.current.dpad.right) {
          this.setTouchDirection();
        } else {
          this.setTouchBtns();
        }
      });
    } else if (this.current.dpad.active) {
      this.setTouchDirection();
    } else {
      this.setTouchBtns();
    }
  }

  dpadMove(e) {
    let posX = e.pageX - this.current.dpad.left;
    let posY = e.pageY - this.current.dpad.top;
    let dir = null;

    if(posX >= 0 && posX <= 85 && posX && posY >= 0 && posY <= 88) {
      if (posX < 28) { // Left
				if (posY < 28)      dir = 'up-left';
				else if (posY < 59) dir = 'left';
				else                dir = 'down-left';
			} else if(posX < 58) { // Center
				if (posY < 28)     dir = 'up';
				else if(posY < 59) dir = null;
				else               dir = 'down';
			} else { // Right
				if (posY < 28)     dir = 'up-right';
				else if(posY < 59) dir = 'right';
				else               dir = 'down-right';
			}
		} 

    this.setTouchDirection(dir);
	}

  btnsMove(e) {
		let posX = e.pageX - this.current.btns.left;
		let posY = e.pageY - this.current.btns.top;
    let btn = null;

		if (posX >= 0 && posX <= 100 && posY >= 28 && posY <= 107) {
			if (posY < 77) // first row
				btn = posX < 50 ? 'b' : 'a';
			else // second row
				btn = posX < 50 ? 'select' : 'start';
		}

		this.setTouchBtns(btn);
	}

	setTouchDirection(direction = null) {
		if (direction != null) { // Key down
			if (this.current.dpad.active !== direction) { // Flag avoid repetition
				this.triggerEvent(this.dom.dpad, this.current.dpad.active, false);
				this.current.dpad.active = direction;
				this.triggerEvent(this.dom.dpad, this.current.dpad.active, true);
			}
		} else { // Key up
      this.triggerEvent(this.dom.dpad, this.current.dpad.active, false);
      this.current.dpad.active = null;
		}
	}

  setTouchBtns(btn = null, pressed = null) {
    if (btn != null && pressed != false) { // Key down
      if (this.current.btns.active !== btn) { // Flag avoid repetition
        this.triggerEvent(this.dom.btns, this.current.btns.active, false);
        this.current.btns.active = btn;
        this.triggerEvent(this.dom.btns, btn, true);
      }
    } else { // Released
      this.triggerEvent(this.dom.btns, this.current.btns.active, false);
      this.current.btns.active = null;
    }
	}

	triggerEvent(el, btn, status) {
		if (btn !== null && btn !== '') {
			let params = {
        pressed: status,
        btn: btn
      };

			if (status) {
				this.timming[btn] = new Date();
			} else {
				params.duration = new Date() - this.timming[btn];
			}

			let event = new CustomEvent(`${this.settings.prefix}:${btn}`, {detail: params});
			document.dispatchEvent(event);
		}

		if (this.showVirtualCntlr && el) {
			el.classList = el.getAttribute('data-default-class');

			if (status) {
				el.classList.add(`is-${btn}`);
      }
		}
	}
}

export default NESCntlr;
