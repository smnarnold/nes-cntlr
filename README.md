nes-cntlr
-------
_Javascript NES controller emulator for keyboards and touch devices_

Allow you to use your keyboard and/or a virtual NES Controller _(for touch devices)_ to control whatever you create, like you would with a NES emulator.

![alt text](https://i.imgur.com/fR0uKUQ.png "NES Controller")

`npm i nes-cntlr`

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
cntlr:up | pressed, duration | D-pad <kbd>↑</kbd>
cntlr:up-right | pressed, duration | D-pad <kbd>↗</kbd>
cntlr:right | pressed, duration | D-pad <kbd>→</kbd>
cntlr:down-right | pressed, duration | D-pad <kbd>↘</kbd>
cntlr:down | pressed, duration | D-pad <kbd>↓</kbd>
cntlr:down-left | pressed, duration | D-pad <kbd>↙</kbd>
cntlr:left | pressed, duration | D-pad <kbd>←</kbd>
cntlr:up-left | pressed, duration | D-pad <kbd>↖</kbd>
cntlr:select | pressed, duration | Select button
cntlr:start | pressed, duration | Start button
cntlr:b | pressed, duration | B button
cntlr:a | pressed, duration | A button

### Settings

Option | Type | Default | Description
------ | ---- | ------- | -----------
colors | array | ['#2F3335', '#383d41', '#AC3C66', '#D64A80', '#B4B4B4'] | Black, Light black, Red, Light red, Grey
keys | object | {start: 13, select: 32, left: 37, up: 38, right: 39, down: 40, b: 65, a: 83} | keys mapping.
location | string | 'body' | Allows you to select where the virtual controller should be injected. ex: .myDiv, #myDiv, etc.
prefix | string | 'nescntlr' | Class prefix
virtual | string | 'auto' | 'auto', 'never' or 'alway' show virtual controller.
zIndex | number | 100 | z-index of the virtual controller.

#### Browser support

nes-cntlr works on IE11+ in addition to other modern browsers such as Chrome, Firefox, and Safari.

#### Dependencies

none

#### License

Copyright (c) 2018 Simon Arnold

Licensed under the MIT license.
