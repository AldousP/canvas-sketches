'use strict';

function InputSystem(inputMap) {
  this.name = 'input';
  this.inputMap = inputMap ? inputMap : {};
  this.mapKeys = [];

  this.pre = function () {
    var that = this;
    this.mapKeys.forEach(function (key) {
      if (sm.input.state[key]) {
        that.inputMap[key](that.fireEvent);
      }
    })
  };

  this.processEntity = function (entity, state, delta, entities) {

  };
}