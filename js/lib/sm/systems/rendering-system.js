'use strict';

function RenderingSystem(ID) {
  this.ID = ID;
  this.name = 'Rendering';
  this.tmpVecA = new Vector();

  this.processEntity = function (entity, state, delta) {
    var poly = entity.components[ComponentType.polygon];
    var pos = entity.components[ComponentType.position];
    var rot = entity.components[ComponentType.rotation];
    var col = entity.components[ComponentType.color];
    var parent = entity.components[ComponentType.parent];

    if (parent) {
      console.log(parent);
    }
  };
}