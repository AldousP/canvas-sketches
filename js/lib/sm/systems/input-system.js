'use strict';

function InputSystem(ID) {
  this.ID = ID;
  this.name = 'Input';

  this.movementSpeed = 320;
  this.rotationSpeed = 256;
  this.tmpVecA = new Vector(0, 0);

  this.processEntity = function (entity, state, delta, entities, x) {
    var hasListener = x.input(entity);
    if (!state.inputTargets) return;
    setVec(this.tmpVecA, 0, 0);
    if (hasListener && (entity.name === state.inputTargets[state.activeTarget])) {
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

      if (sm.input.state.left_bump) {
        this.fireAction(Actions.rotate(entity, -this.rotationSpeed * delta))

      }

      if (sm.input.state.right_bump) {
        this.fireAction(Actions.rotate(entity, this.rotationSpeed * delta))
      }

      if (this.tmpVecA.len) {
        this.fireAction(Actions.move(entity, this.tmpVecA))
      }
    }
  };

  this.extractors = {
    input : function (entity) {
      return !!entity.components[ComponentType.input];
    }
  };
}