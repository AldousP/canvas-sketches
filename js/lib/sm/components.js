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
  text : 'text'
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

function ChildrenComponent() {
  this.name = ComponentType.children;
  this.children = [];
}

function ParentComponent(parentID) {
  this.name = ComponentType.parent;
  this.parentID = parentID;
}

function RootComponent() {
  this.name = ComponentType.root;
}

function ColorComponent(color) {
  this.name = ComponentType.color;
  this.color = color;
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

function TextComponent(string, size, color) {
  this.name = ComponentType.text;
  this.string = string;
  this.size = size;
  this.color = color;
}