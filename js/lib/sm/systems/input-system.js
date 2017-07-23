'use strict';

function InputSystem(ID) {
  this.ID = ID;
  this.name = 'input';

  this.movementSpeed = 320;
  this.rotationSpeed = 256;
  this.tmpVecA = new Vector(0, 0);

  this.processEntity = function (entity, state, delta, entities) {


  };
}