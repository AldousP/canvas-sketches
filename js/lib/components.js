"use strict";

var ComponentType = {
  polygon : "poly",
  position : "pos",
  tagged : "tags",
  velocity : "vel",
  acceleration : "accl"
};


function PositionComponent() {
  this.name = ComponentType.position;
  this.position = new Vector();
}

function PolygonComponent(polygon) {
  this.name = ComponentType.polygon;
  this.polygon = polygon;
}

function VelocityComponent(x, y) {
  this.name = ComponentType.velocity;
  this.velocity = new Vector(x, y);
}

function AccelerationComponent() {
  this.name = ComponentType.acceleration;
  this.acceleration = new Vector();
}