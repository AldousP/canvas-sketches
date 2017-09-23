'use strict';

var ComponentType = {
  polygon : 'poly',
  position : 'pos',
  rotation : 'rot',
  physics: 'physics',
  camera : 'cam',
  viewport : 'viewport',
  children : 'children',
  parent : 'parent',
  root : 'root',
  color: 'col',
  clip : 'clip',
  movement: 'mover',
  input : 'input',
  renderroot : 'renderroot',
  text : 'text',
  sequence: 'sequence',
  path: 'path',
  animation: 'animation',
  stateMachine: 'fsm',
  stroke: 'strokedElement',
  animationMap: 'animationMap',
  renderable: 'renderable',
  gameplay: 'game',
  transform: 'transform',
  gameState: 'gamestate',
  collider: 'collider',
  velocity: 'velocity',
  renderableVector: 'renderableVector'
};

function PolygonComponent(polygon, stroke, fill) {
  this.name = ComponentType.polygon;
  this.polygon = polygon;
  this.stroke = stroke;
  this.fill = fill;
}

function PositionComponent(x, y) {
  this.name = ComponentType.position;
  this.position = new SVec.Vector(x, y);
}

function RotationComponent(rotation, radians) {
  this.name = ComponentType.rotation;
  this.radians = radians ? radians : false;
  this.rotation = rotation ? rotation : 0;
}

function VelocityComponent(x, y) {
  this.name = ComponentType.velocity;
  this.velocity = new SVec.Vector(x, y);
}

function AccelerationComponent(x, y) {
  this.name = ComponentType.acceleration;
  this.acceleration = new SVec.Vector(x, y);
}

function CameraComponent(conf) {
  this.name = ComponentType.camera;
  this.conf = conf ? conf :{
    pos: new SVec.Vector(0, 0),
    width: 128,
    height: 128,
    zoom: 1,
    rotation: 0
  };
}

function ColorComponent(colorA, colorB) {
  this.name = ComponentType.color;
  this.color = colorA;
  this.colorB = colorB;
}

function ClipComponent() {
  this.name = ComponentType.clip;
}

function InputComponent() {
  this.name = ComponentType.input;
}

function RenderRoot() {
  this.name = ComponentType.renderroot;
}

function TextComponent(strings, textConf) {
  this.name = ComponentType.text;
  this.strings = strings;
  this.conf = textConf;
}

function PathComponent(pts) {
  this.name = ComponentType.path;
  this.pts = pts ? pts : [];
  this.pos = pts ? pts[0] : new SVec.Vector();
}

function AnimationComponent (handle, length, width, height) {
  this.name = ComponentType.animation;
  this.handle = handle;
  this.length = length ? length : 1;
  this.progress = 0;
  this.width = width;
  this.height = height;
}

function StateMachineComponent(fsmName) {
  this.name = ComponentType.stateMachine;
  this.fsmName = fsmName;
  this.stateTime = 0;
  this.currentState = ''
}

function AnimationMapComponent(initialState, map) {
  this.activeState = initialState;
  this.name = ComponentType.animationMap;
  this.animationMap = map;
  this.progress = 0;
}

function RenderableComponent(conf) {
  this.name = ComponentType.renderable;
  this.conf = conf ? conf : {
    disabled: false
  };
}

function GameplayComponent() {
  this.name = ComponentType.gameplay;
}

function TransformComponent (x, y, r, h, v) {
  this.name = ComponentType.transform;
  this.position = new SVec.Vector(x, y);
  this.rotation = r ? r : 0;
  this.scale = new SVec.Vector(h, v);
}

function GameStateComponent(state) {
  this.name = ComponentType.gameState;
  this.gameState = state || {};
}

function ColliderComponent(poly) {
  this.name = ComponentType.collider;
  this.volume = poly;
}

function SequenceComponent(sequences) {
  this.name = ComponentType.sequence;
  this.conf = sequences;
}

function RenderableVector(vector, color, stroke_width, off_set) {
  this.name = ComponentType.renderableVector;
  this.vector = vector;
  this.color = color;
  this.stroke_width = stroke_width;
  this.off_set = off_set;
}

/**
 * Helpers to quickly grab values out of an entities data.
 */
var EX = {
  transPos: function (entity) {
    if (entity.components[ComponentType.transform]) {
      return entity.components[ComponentType.transform].position
    } else {
      return null;
    }
  },

  transRot: function (entity) {
    return entity.components[ComponentType.transform].rotation;
  },

  vel: function (entity) {
    return entity.components[ComponentType.velocity].velocity;
  },

  accl: function (entity) {
    if (entity.components[ComponentType.acceleration]) {
      return entity.components[ComponentType.acceleration].acceleration;
    } else {
      return null;
    }
  },

  rendPoly: function (entity) {
    if (entity.components[ComponentType.polygon]) {
      return entity.components[ComponentType.polygon].polygon;
    } else {
      return null;
    }
  },
  
  text: function (entity) {
    if (entity.components[ComponentType.text]) {
      return [
        entity.components[ComponentType.text].strings,
        entity.components[ComponentType.text].conf
      ];
    } else {
      return null;
    }
  },
  
  sequence: function (entity) {
    return entity.components[ComponentType.sequence].conf;
  },

  renderable: function (entity) {
    return entity.components[ComponentType.renderable] ? entity.components[ComponentType.renderable].conf : null;
  },

  renderableVec: function (entity) {
    return entity.components[ComponentType.renderableVector] ? entity.components[ComponentType.renderableVector]: null;
  },

  state: function (entity) {
    return entity.components[ComponentType.gameState].gameState;
  }
};