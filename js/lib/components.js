"use strict";

var ComponentType = {
  polygon : "poly",
  position : "pos",
  rotation : "rot",
  velocity : "vel",
  acceleration : "accl",
  camera : "cam",
  viewport : "viewport",
  children : "children",
  root : "root",
  color: "col"
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

function CameraComponent() {
  this.name = ComponentType.camera;
  this.pos = new Vector(0, 0);
  this.width = 1;
  this.height = 1;
  this.zoom = 1;
  this.rotation = 0;
}

function ViewportComponent(pos, w, h) {
  this.name = ComponentType.viewport;
  this.position = pos;
  this.width = w;
  this.height = h;
}

function ChildrenComponent() {
  this.name = ComponentType.children;
  this.children = [];
}

function RootComponent() {
  this.name = ComponentType.root;
}

function ColorComponent(color) {
  this.name = ComponentType.color;
  this.color = color;
}