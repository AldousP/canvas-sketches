'use strict';

function RootSystem(ID) {
  this.ID = ID;
  this.name = 'Roots';

  this.processEntity = function (entity, delta, state) {
    if (entity.components[ComponentType.children]) {
      var childrenComp = entity.components[ComponentType.children];
      if (childrenComp) {
        this.processor.processEntities(
            this.processor.entitiesForIDs(childrenComp.children),
            delta,
            state);
      }
    }
  };
}
