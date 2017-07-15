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
  clip : 'clip'
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
  this.parent = ComponentType.parent;
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