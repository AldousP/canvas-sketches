"use strict";

var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
var last = new Date().getTime();
var current = new Date().getTime();
var delta;
var frameRate;
var frameHistory = [];
var historyCap = 30;
var worldCam = new Camera();
var padding = .95;
var view;
var backgroundColor = "#545454";
var entityHandler = new EntityHandler();
var systemHandler = new SystemHandler();
var storedState = {};
var paused = false;

setup();

function setup() {
  window.requestAnimationFrame(renderLoop);
  view = new View(canvas.width * padding, canvas.height * padding);
  view.worldWidth = 3;
  view.worldHeight = 3;

  entityHandler.addEntity(buildEntity("Octagon", [
    (new PolygonComponent(generatePolygon(8, .25))),
    (new PositionComponent()),
    (new VelocityComponent(0, -.25)),
    (new AccelerationComponent(0, -.25))
  ]));

  entityHandler.addEntity(buildEntity("Square", [
    (new PolygonComponent(generatePolygon(4, .55))),
    (new PositionComponent(0, .5)),
    (new VelocityComponent(0, -.15)),
    (new AccelerationComponent(0, -.55))
  ]));

  entityHandler.addEntity(buildEntity("Circle", [
    (new PolygonComponent(generatePolygon(32, .15))),
    (new PositionComponent(.15, .5)),
    (new VelocityComponent(0, -.25)),
    (new AccelerationComponent(0, -.25))
  ]));

  entityHandler.addEntity(buildEntity("Dodecagon", [
    (new PolygonComponent(generatePolygon(12, .2))),
    (new PositionComponent(.15, -.15)),
    (new VelocityComponent(0, -.25)),
    (new AccelerationComponent(0, -.25))
  ]));

  systemHandler.addSystems([
    new PhysicsSystem("A"),
    new RenderingSystem("B")
  ]);

  copyState();
}

function copyState() {
  storedState = JSON.stringify(entityHandler.entities);
}

function restoreState() {
  entityHandler.entities = JSON.parse(storedState);
}

function renderLoop() {
  // Blank out screen
  ctx.fillStyle = "#000000";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  update();
  window.requestAnimationFrame(renderLoop);
}

function update() {
  current = new Date().getTime();
  delta = (current - last) / 1000;
  ctx.save();
  ctx.translate(canvas.width / 2, canvas.height / 2);
  updateFrameCount();
  systemHandler.updateSystems(delta, entityHandler);
  ctx.restore();
}

function updateFrameCount() {
  frameRate = (1000 / delta) / 1000;
  last = current;
  frameHistory.push(frameRate);
  if (frameHistory.length > historyCap) {
    frameHistory.splice(0, 1);
  }

  var avg = 0;
  for (var i = 0; i < frameHistory.length; i++) {
    avg += frameHistory[i];
  }
  avg /= frameHistory.length;
  frameRate = avg;
}
