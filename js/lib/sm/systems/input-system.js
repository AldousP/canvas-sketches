'use strict';

function InputSystem(inputMap) {
  this.name = 'input';
  this.inputMap = inputMap ? inputMap : {};

  this.pre = function () {
    var that = this;
    var eventMappings = Object.keys(this.inputMap);

    eventMappings.forEach(function (eventName) {
      var event = that.inputMap[eventName];

      var keyTriggers = event.keys;
      if (keyTriggers) {
        keyTriggers.forEach(function (trigger) {
          if (sm.input.state.keyboard[trigger]) {
            that.fireEvent(eventName, { val: 1 });
          }
        });
      }

      var controller = event.controller;
      if (controller) {
        var port = 0;
        if (controller.port) {
          port = controller.port;
        }
        var inputSource = sm.input.state.controllers[port];

        var buttons = controller.buttons;
        if (buttons) {
          if (inputSource) {
            var inputButtons = inputSource.buttons;
            buttons.forEach(function (button) {
              var buttonData = inputButtons[button];
              if (buttonData && buttonData.pressed) {
                that.fireEvent(eventName, { val: buttonData.value });
              }
            });
          }
        }

        var axes = controller.axes;
        if (axes && inputSource.axes && inputSource.axes.length) {
          var axesList = Object.keys(axes);
          axesList.forEach(function (axe) {
            switch (axe) {
              case 'leftStick':
                var config = axes[axe];
                var leftStick = new Vector(inputSource.axes[0], -inputSource.axes[1]);
                var val = leftStick.len;
                var normVal = SMath.project(val, 0, 1.5, 0, 1);
                if (normVal > config.deadZone) {
                  if (that.fireEvent) {
                    that.fireEvent(eventName, { val: leftStick});
                  }
                }
                break;
              case 'rightStick':
                var config = axes[axe];
                var rightStick = new Vector(inputSource.axes[2], -inputSource.axes[3]);
                var val = rightStick.len;
                var normVal = SMath.project(val, 0, 1.5, 0, 1);
                if (normVal > config.deadZone) {
                  if (that.fireEvent) {
                    that.fireEvent(eventName, { val: rightStick});
                  }
                }
                break;
            }
          })
        }
      }
    });
  };

  this.processEntity = function (entity, state, delta, entities) {

  };
}