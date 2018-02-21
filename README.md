nes-cntlr
-------
_Javascript NES controller emulator for keyboards and touch devices_

Allow you to use your keyboard and/or a virtual NES Controller _(for touch devices)_ to control whatever you create, like you would with a NES emulator.

![alt text](https://i.imgur.com/fR0uKUQ.png "NES Controller")

`npm install nes-cntlr`

### Usage

```
import NESController from 'nes-controller';
let player1 = new NESController();
player1.init();
```

### Events

All events return a _'pressed'_ parameter [bool: true|false]. On release, a _'duration'_ parameter [number: ms] will also be provided. <br>You can listen to those events for your game/project.

Event | Params | Description
----- | ------ | -----------
cntlr:up | pressed | D-pad <kbd>↑</kbd>
cntlr:up-right | pressed | D-pad <kbd>↗</kbd>
cntlr:right | pressed | D-pad <kbd>→</kbd>
cntlr:down-right | pressed | D-pad <kbd>↘</kbd>
cntlr:down | pressed | D-pad <kbd>↓</kbd>
cntlr:down-left | pressed | D-pad <kbd>↙</kbd>
cntlr:left | pressed | D-pad <kbd>←</kbd>
cntlr:up-left | pressed | D-pad <kbd>↖</kbd>
cntlr:select | pressed | Select button
cntlr:start | pressed | Start button
cntlr:b | pressed | B button
cntlr:a | pressed | A button

### Settings

Option | Type | Default | Description
------ | ---- | ------- | -----------
colors | array | ['#2F3335', '#383d41', '#AC3C66', '#D64A80', '#B4B4B4'] | Default <span style="color: #2F3335">◼</span>, default active <span style="color: #383d41">◼</span>, highlight <span style="color: #AC3C66">◼</span>, highlight active <span style="color: #D64A80">◼</span>, border <span style="color: #B4B4B4">◼</span>
keys | object | {start: 13, select: 32, left: 37, up: 38, right: 39, down: 40, b: 65, a: 83} | keys mapping.
location | string | 'body' | Allows you to select where the virtual controller should be injected. ex: .myDiv, #myDiv, etc.
prefix | string | 'nes-cntlr' | Class prefix
virtual | string | 'auto' | 'auto', 'never' or 'alway' show virtual controller.
zIndex | number | 100 | z-index of the virtual controller.

#### Browser support

nes-controller works on IE11+ in addition to other modern browsers such as Chrome, Firefox, and Safari.

#### Dependencies

none

#### License

Copyright (c) 2018 Simon Arnold

Licensed under the MIT license.
