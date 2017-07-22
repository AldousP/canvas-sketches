'use strict';

var smx = {
  input : function (entity) {
    return !!entity.components[ComponentType.input];
  },

  movVec : function (entity) {
    return entity.components[ComponentType.movement] ? (entity.components[ComponentType.movement].movementVec) : null
  },

  movRot : function (entity) {
    var mov = entity.components[ComponentType.movement];
    if (mov) {
      return mov.rotSpeed ? mov.rotSpeed : null;
    } else {
      return null;
    }
  },

  clip : function (entity) {
    return !!entity.components[ComponentType.clip];
  },

  pos : function (entity) {
    return entity.components[ComponentType.position] ? (entity.components[ComponentType.position].position) : null
  },

  children : function (entity) {
    return entity.components[ComponentType.children] ? (entity.components[ComponentType.children].children) : null
  },

  rot : function (entity) {
    var rot = entity.components[ComponentType.rotation];
    if (rot) {
      return rot.radians ? rot.rotation : rot.rotation / DEG_RAD;
    } else {
      return null;
    }
  },

  cam : function (entity) {
    return entity.components[ComponentType.camera] ? entity.components[ComponentType.camera] : null;
  },

  col : function (entity) {
    return entity.components[ComponentType.color] ? entity.components[ComponentType.color].color : null;
  },

  poly : function (entity) {
    return entity.components[ComponentType.polygon] ? entity.components[ComponentType.polygon].polygon : null;
  },

  par : function (entity, entities) {
    return entity.components[ComponentType.parent] ? entities[entity.components[ComponentType.parent].parentID] : null
  },

  renderRoot : function (entity) {
    return !!entity.components[ComponentType.renderroot];
  },

  text  : function (entity) {
    return entity.components[ComponentType.text];
  }
};