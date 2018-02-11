nes-controller
-------
_Javascript NES controller emulator for keyboards and touch devices_

Allow you to use your keyboard and/or a vitual NES Controller _(for touch devices)_ to control whatever you create like you would with a NES emulator.

![alt text](https://i.imgur.com/fR0uKUQ.png "NES Controller")

### Events

All events return a 'status' parameter that is either 'true' or 'false' depending if the button is pressed or released. You can listen to those events for your game/project.

Event | Params | Description
----- | ------ | -----------
controller:up | status | D-pad up
controller:up-right | status | D-pad up right
controller:right | status | D-pad right
controller:down-right | status | D-pad down right
controller:down | status | D-pad down
controller:up-left | status | D-pad up left
controller:left | status | D-pad left
controller:down-left | status | D-pad down left 
controller:select | status | Select button
controller:start | status | Start button
controller:b | status | B button
controller:a | status | A button

### Settings

Option | Type | Default | Description
------ | ---- | ------- | -----------
keys | object | {start: 13, select: 32, left: 37, up: 38, right: 39, down: 40, b: 65, a: 83} | keys mapping.
location | string | body | Allows you to select where the virtual controller should be injected. ex: .myDiv, #myDiv, etc.
virtual | string | 'auto' | 'auto', 'never' or 'alway' show virtual controller.
zIndex | number | 100 | z-index of the virtual controller.

#### Browser support

nes-controller works on IE11+ in addition to other modern browsers such as Chrome, Firefox, and Safari.

#### Dependencies

jQuery 3

#### License

Copyright (c) 2018 Simon Arnold

Licensed under the MIT license.
