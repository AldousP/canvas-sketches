'use strict';

function RootSystem(ID) {
  this.ID = ID;
  this.name = 'RootSystem';

  this.processEntity = function (entity, state, delta) {
    var children = entity.components[ComponentType.children];
    var pos = entity.components[ComponentType.position];
    var poly = entity.components[ComponentType.polygon];
    var rot = entity.components[ComponentType.rotation];
    var parentRot = state.parentRot;

    if (children) {
      if (pos) {
        if (state.parentPos) {
          addVecVec(state.parentPos, rotVec(cpyVec(pos.position), parentRot ? parentRot : 0));
        } else {
          state.parentPos = rotVec(cpyVec(pos.position), parentRot ? parentRot : 0);
        }
      }

      state.parentPoly = poly.polygon;
      if (rot) {
        if (parentRot) {
          state.parentRot += rot.radians ? rot.rotation : rot.rotation / DEG_RAD;
        } else {
          state.parentRot = rot.radians ? rot.rotation : rot.rotation / DEG_RAD;
        }
      }

      this.processor.processEntities(
          this.processor.entitiesForIDs(children.children),
          state,
          delta
      );
    }
  };
}
