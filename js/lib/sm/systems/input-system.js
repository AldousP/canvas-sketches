'use strict';

function InputSystem(ID) {
  this.ID = ID;
  this.name = 'Input';

  this.movementSpeed = 320;
  this.tmpVecA = new Vector(0, 0);

  this.processEntity = function (entity, state, delta, entities, x) {
    setVec(this.tmpVecA, 0, 0);
    if (entity.name === 'root') {
      if (sm.input.state.up) {
        addVecConst(this.tmpVecA, 0, this.movementSpeed * delta);
      }

      if (sm.input.state.down) {
        addVecConst(this.tmpVecA, 0, -this.movementSpeed * delta);
      }

      if (sm.input.state.left) {
        addVecConst(this.tmpVecA, -this.movementSpeed * delta, 0);
      }

      if (sm.input.state.right) {
        addVecConst(this.tmpVecA, this.movementSpeed * delta, 0);
      }

      if (this.tmpVecA.len) {
        this.fireAction(Actions.move(entity, this.tmpVecA))
      }
    }
  };
}