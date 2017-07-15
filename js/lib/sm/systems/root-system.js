'use strict';

function RootSystem(ID) {
  this.ID = ID;
  this.name = 'RootSystem';

  this.processEntity = function (entity, state, delta) {
    var children = entity.components[ComponentType.children];
    if (children) {
      this.processor.processEntities(
          this.processor.entitiesForIDs(children.children),
          state,
          delta
      );
    }
  };
}
