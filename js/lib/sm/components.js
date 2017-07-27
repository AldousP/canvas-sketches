'use strict';

var ComponentType = {
  polygon : 'poly',
  position : 'pos',
  rotation : 'rot',
  velocity : 'vel',
  acceleration : 'accl',
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
  stateMachine: 'fsm'
};

function PolygonComponent(polygon) {
  this.name = ComponentType.polygon;
  this.polygon = polygon;
}

function PositionComponent(x, y) {
  this.name = ComponentType.position;
  this.position = new Vector(x, y);
}

function RotationComponent(rotation, radians) {
  this.name = ComponentType.rotation;
  this.radians = radians ? radians : false;
  this.rotation = rotation ? rotation : 0;
}

function VelocityComponent(x, y) {
  this.name = ComponentType.velocity;
  this.velocity = new Vector(x, y);
}

function AccelerationComponent(x, y) {
  this.name = ComponentType.acceleration;
  this.acceleration = new Vector(x, y);
}

function CameraComponent(conf) {
  this.name = ComponentType.camera;
  this.conf = conf ? conf :{
    pos: new Vector(0, 0),
    width: 128,
    height: 128,
    zoom: 1
  };
}

function ChildrenComponent() {
  this.name = ComponentType.children;
  this.children = [];
}

function ParentComponent(parentID) {
  this.name = ComponentType.parent;
  this.parentID = parentID;
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

function MovementComponent(movementVec, rotSpeed, radians) {
  this.name = ComponentType.movement;
  this.movementVec = movementVec ? movementVec : new Vector();
  this.rotSpeed = rotSpeed ? rotSpeed : 0;
  this.radians = radians ? radians : false;
}

function TextComponent(strings, textConf) {
  this.name = ComponentType.text;
  this.strings = strings;
  this.conf = textConf;
}

function SequenceComponent(conf) {
  this.name = ComponentType.sequence;
  this.conf = conf ? conf : {
    length: 5,
    pos: 0,
    dir : 1,
    onComplete: ''
  };

  if (!conf.dir) {
    this.conf.dir = 1;
  }
}

function PathComponent(pts) {
  this.name = ComponentType.path;
  this.pts = pts ? pts : [];
  this.pos = new Vector();
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