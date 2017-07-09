'use strict';

function RootSystem(ID) {
  this.ID = ID;
  this.name = 'RootSystem';

  this.processEntity = function (entity, state, delta) {
    var children = entity.components[ComponentType.children];
    var pos = entity.components[ComponentType.position];
    var rot = entity.components[ComponentType.rotation];
    var parentPos = state.parentPos;
    var parentRot = state.parentRot;

    if (children) {
      if (parentPos && pos) {
        addVecVec(parentPos, pos.position);
      } else {
        state.parentPos = cpyVec(pos.position);
      }


      this.processor.processEntities(
          this.processor.entitiesForIDs(children.children),
          state,
          delta
      );

      if (parentPos && pos) {
        addVecConst(parentPos, -pos.position.x, -pos.position.y);
      }
    }
  };
}
