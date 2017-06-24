"use strict";

var ComponentType = {
  polygon : "poly",
  position : "pos",
  tagged : "tags",
  velocity : "vel",
  acceleration : "accl"
};


function PositionComponent(x, y) {
  this.name = ComponentType.position;
  this.position = new Vector(x, y);
}

function PolygonComponent(polygon) {
  this.name = ComponentType.polygon;
  this.polygon = polygon;
}

function VelocityComponent(x, y) {
  this.name = ComponentType.velocity;
  this.velocity = new Vector(x, y);
}

function AccelerationComponent(x, y) {
  this.name = ComponentType.acceleration;
  this.acceleration = new Vector(x, y);
}