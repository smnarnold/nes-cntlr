import { debounce } from 'throttle-debounce';
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
    window.addEventListener('orientationchange', e => this.refresh(e));
    window.addEventListener('resize', () => debounce(300, e => this.refresh(e)));
		window.addEventListener('keydown', e => this.keyAction(e, true));
		window.addEventListener('keyup', e => this.keyAction(e, false));
  }

  keyAction(e, status) {
    e = e || window.event;

    if (!e.repeat) {
      if(status)
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
    if(typeof this.controller === 'undefined') {
      this.controller = new virtualCntlr(this.settings);
      this.controller.create();

      this.dom.el = document.querySelector(`.${this.settings.prefix}-cntlr`);
      this.dom.dpad = document.querySelector(`.${this.settings.prefix}-cntlr .d-pad`);
      this.dom.btns = document.querySelector(`.${this.settings.prefix}-cntlr .btns`);

      this.setVirtualCntlrPos();

      console.log(this.dom.el)

      this.dom.el.addEventListener('touchstart', e => this.touchMove(e) );
      this.dom.el.addEventListener('touchmove', e => this.touchMove(e) );
      this.dom.el.addEventListener('touchend', () => this.touchEnd() );
      this.dom.el.addEventListener('touchcancel', () => this.touchEnd() );

      /*this.dom.dpad.addEventListener('touchstart', e => this.dpadMove(e) );
      this.dom.dpad.addEventListener('touchmove', e => this.dpadMove(e) );*/
      this.dom.dpad.addEventListener('touchend', () => this.dpadEnd() );
      this.dom.dpad.addEventListener('touchcancel', () => this.dpadEnd() );

      /*this.dom.btns.addEventListener('touchstart', e => this.btnsMove(e) );
      this.dom.btns.addEventListener('touchmove', e => this.btnsMove(e) );*/
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
      this.current.dpad.top = this.dom.dpad.getBoundingClientRect().y;
      this.current.dpad.left = this.dom.dpad.getBoundingClientRect().x;
      this.current.dpad.right = this.dom.dpad.getBoundingClientRect().right;
      this.current.btns.top = this.dom.btns.getBoundingClientRect().y;
      this.current.btns.left = this.dom.btns.getBoundingClientRect().x;
      this.current.btns.right = this.dom.btns.getBoundingClientRect().right;
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

  touchEnd() {
    this.setTouchDirection();
  }

  dpadMove(e) {
    let posX = e.pageX - this.current.dpad.left;
    let posY = e.pageY - this.current.dpad.top;

    if(posX >= 0 && posX <= 85 && posX && posY >= 0 && posY <= 88) {
			if(posX < 28) { // Left
				if(posY < 28)
					this.setTouchDirection('up-left');
				else if(posY < 59)
					this.setTouchDirection('left');
				else
					this.setTouchDirection('down-left');
			} else if(posX < 58) { // Center
				if(posY < 28)
					this.setTouchDirection('up');
				else if(posY < 59)
					this.setTouchDirection();
				else
					this.setTouchDirection('down');
			} else { // Right
				if(posY < 28)
					this.setTouchDirection('up-right');
				else if(posY < 59)
					this.setTouchDirection('right');
				else
					this.setTouchDirection('down-right');
			}
		} else {
			this.setTouchDirection();
		}
	}

	dpadEnd() {

	}

	setTouchDirection(direction = null) {
		if(direction != null) { // Key down
			if(this.current.dpad.active !== direction) { // Flag avoid repetition
				this.triggerEvent(this.dom.dpad, this.current.dpad.active, false);
				this.current.dpad.active = direction;
				this.triggerEvent(this.dom.dpad, this.current.dpad.active, true);
			}
		} else { // Key up
      this.triggerEvent(this.dom.dpad, this.current.dpad.active, false);
      this.current.dpad.active = null;
		}
	}

	btnsMove(e) {
		let posX = e.pageX - this.current.btns.left;
		let posY = e.pageY - this.current.btns.top;

		if(posX >= 0 && posX <= 100 && posY >= 28 && posY <= 107) {
			let btn = null;

			if(posY < 77) // first row
				btn = posX < 50 ? 'b' : 'a';
			else // second row
				btn = posX < 50 ? 'select' : 'start';
      
      if (this.current.btns.prev !== btn) {
        this.setTouchBtns(this.current.btns.prev, false);
        this.setTouchBtns(btn, true);
        this.current.btns.prev = btn;
      }
		} else {
			this.setTouchBtns();
		}
	}

	btnsEnd() {
    if (this.current.btns.prev != null) {
      this.setTouchBtns(this.current.btns.prev, false);
    }
    this.current.btns.prev = null;
	}

	setTouchBtns(btn = null, status = false) {
    this.triggerEvent(this.dom.btns, btn, status);
	}

	triggerEvent(el, btn, status) {
		if(btn !== null && btn !== '') {
			let params = {
        pressed: status,
        btn: btn
      };

			if(status) {
				this.timming[btn] = new Date();
			} else {
				params.duration = new Date() - this.timming[btn];
			}

			let event = new CustomEvent(`${this.settings.prefix}:${btn}`, {detail: params});
			document.dispatchEvent(event);
		}

		if(this.showVirtualCntlr && el) {
			el.classList = el.getAttribute('data-default-class');

			if(status) {
				el.classList.add(`is-${btn}`);
      }
		}
	}
}

export default NESCntlr;
