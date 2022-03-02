nes-cntlr
-------
_Javascript NES controller emulator for keyboards and touch devices_

Allow you to use your keyboard and/or a virtual NES Controller _(for touch devices)_ to control whatever you create, like you would with a NES emulator.

![alt text](https://i.imgur.com/WhsJLAk.png "NES Controller")

`npm i nes-cntlr`

### Demos
- [Basic - Vanilla Javascript](https://codepen.io/sarnold/pen/BGzrrV)
- [Basic - jQuery](https://codepen.io/sarnold/pen/RqRMvx)
- [Multiplayers](https://codepen.io/sarnold/pen/MzeVdW?)
- [Punch-Out!! - Menu](https://codepen.io/smnarnold/full/zYPmrBw)
- [Punch-Out!! - Little Mac](https://codepen.io/smnarnold/full/qBVKEYe)
- [Collection](https://codepen.io/collection/nvmVVg/)


### Usage

```
import NESCntlr from 'nes-cntlr';
let player1 = new NESCntlr();
player1.init();
```

### Events

All events return a _'pressed'_ parameter [bool: true|false]. On release, a _'duration'_ parameter [number: ms] will also be provided. <br>You can listen to those events for your game/project.

Event | Params | Description
----- | ------ | -----------
player1:up | pressed, duration | D-pad <kbd>↑</kbd>
player1:up-right | pressed, duration | D-pad <kbd>↗</kbd>
player1:right | pressed, duration | D-pad <kbd>→</kbd>
player1:down-right | pressed, duration | D-pad <kbd>↘</kbd>
player1:down | pressed, duration | D-pad <kbd>↓</kbd>
player1:down-left | pressed, duration | D-pad <kbd>↙</kbd>
player1:left | pressed, duration | D-pad <kbd>←</kbd>
player1:up-left | pressed, duration | D-pad <kbd>↖</kbd>
player1:select | pressed, duration | Select button
player1:start | pressed, duration | Start button
player1:b | pressed, duration | B button
player1:a | pressed, duration | A button

The _'player1'_ at the beginning of every event match the prefix setting. That way, you can bind multiple nes-cntlr and differentiate which one sent you an event. 

### Settings

Option | Type | Default | Description
------ | ---- | ------- | -----------
colors | array | ['#2F3335', '#383d41', '#AC3C66', '#D64A80', '#B4B4B4'] | Black, Light black, Red, Light red, Grey
keys | object | {<br />start: 'Enter',<br /> select: 'Space', <br />left: 'ArrowLeft', <br />up: 'ArrowUp', right: 'ArrowRight', <br />down: 'ArrowDown', <br />b: 'KeyZ', <br />a: 'KeyX'<br />} | keys mapping.
location | string | 'body' | Allows you to select where the virtual controller should be injected. ex: .myDiv, #myDiv, etc.
prefix | string | 'player1' | Class prefix
virtual | string | 'auto' | 'auto', 'never' or 'always' show virtual controller.
zIndex | number | 100 | z-index of the virtual controller.

#### Browser support

nes-cntlr works on all modern browsers such as Chrome, Firefox, Edge and Safari.

#### Dependencies

 - [Lodash - Debounce](https://lodash.com/docs/4.17.15#debounce)

#### License

Copyright (c) 2018 Simon Arnold

Licensed under the MIT license.
