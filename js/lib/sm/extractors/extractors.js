'use strict';

var smx = {
  input: function (entity) {
    return !!entity.components[ComponentType.input];
  },

  movVec: function (entity) {
    return entity.components[ComponentType.movement] ? (entity.components[ComponentType.movement].movementVec) : null
  },

  movRot: function (entity) {
    var mov = entity.components[ComponentType.movement];
    if (mov) {
      return mov.rotSpeed ? (mov.radians ? mov.rotSpeed : mov.rotSpeed / DEG_RAD): null;
    } else {
      return null;
    }
  },

  clip: function (entity) {
    return !!entity.components[ComponentType.clip];
  },

  pos: function (entity) {
    return entity.components[ComponentType.position] ? (entity.components[ComponentType.position].position) : null
  },

  children: function (entity) {
    return entity.components[ComponentType.children] ? (entity.components[ComponentType.children].children) : null
  },

  rot: function (entity) {
    var rot = entity.components[ComponentType.rotation];
    if (rot) {
      return rot.radians ? rot.rotation : rot.rotation / DEG_RAD;
    } else {
      return null;
    }
  },

  cam: function (entity) {
    return entity.components[ComponentType.camera] ? entity.components[ComponentType.camera].conf : null;
  },

  col: function (entity) {
    return entity.components[ComponentType.color] ? entity.components[ComponentType.color].color : null;
  },

  colB: function (entity) {
    return entity.components[ComponentType.color] && entity.components[ComponentType.color].colorB ? entity.components[ComponentType.color].colorB : null;
  },

  poly: function (entity) {
    return entity.components[ComponentType.polygon] ? entity.components[ComponentType.polygon].polygon : null;
  },

  renderRoot: function (entity) {
    return !!entity.components[ComponentType.renderroot];
  },

  text: function (entity) {
    return entity.components[ComponentType.text];
  },
  
  sequence: function (entity) {
    return entity.components[ComponentType.sequence] ? entity.components[ComponentType.sequence].sequences : null;
  },

  path: function (entity) {
    return entity.components[ComponentType.path];
  },

  anim: function (entity) {
    return entity.components[ComponentType.animation];
  },
  
  fsm: function (entity) {
    return entity.components[ComponentType.stateMachine];
  }
};