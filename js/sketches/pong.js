"use strict";

var contextZoom = 1;
var canvas = document.getElementById("canvas-pong");
var ctx = canvas.getContext("2d");
var cW = canvas.width;
var cH = canvas.height;
var last = new Date().getTime();
var current = new Date().getTime();
var delta;
var frameRate;
var frameHistory = [];
var historyCap = 30;

var polygon = generatePolygon(8, .25, 0, 0, 1.25 * Math.PI);
var worldCam = new Camera();
var systems = []; 
var entities = [];
var padding = .85;
var view;
var backgroundColor = "#545454";

setup();

function setup() {
  createSystems();
  createEntities();
  window.requestAnimationFrame(renderLoop);
  view = new View(canvas.width * padding, canvas.height * padding);
  view.worldWidth = 8;
  view.worldHeight = 4.5;
}

function createEntities() {
  var entity = new Entity();
  entity.tags.push("sceneEntity");
  entity.ID = "000";
  entity.components.push(new PositionComponent());
  entity.components.push(new PolygonComponent(polygon));
  entity.components.push(new VelocityComponent());
  var accelComp = new AccelerationComponent();
  accelComp.accel = new Vector(0, 1);
  entity.components.push(accelComp);
  entities.push(entity);
}

function createSystems() {
  var physics = new System();
  physics.name = "physics";
  physics.processEntity = function (entity) {
    var availableComps = {};
    entity.components.forEach(function (component) {
      switch (component.name) {
        case "pos" :
          availableComps.pos = component;
          break;
        case "accel" :
          availableComps.accel = component;
          break;
        case "vel" :
          availableComps.vel = component;
          break;
      }
    });

    if (availableComps.pos && availableComps.vel) {
      if (availableComps.accel) {
        availableComps.vel.velocity.add(
            availableComps.accel.accel.x * delta,
            availableComps.accel.accel.y * delta
        )
      }
      availableComps.pos.pos.add(availableComps.vel.velocity.x * delta, availableComps.vel.velocity.y * delta);
    }
  };
  systems.push(physics);

  var rendering = new System();
  rendering.name = "rendering";
  rendering.pre = function () {
    ctx.save();
    ctx.strokeStyle = "#FFFFFF";
    ctx.beginPath();
    ctx.rect(
        view.canvPos.x - view.canvWidth / 2,
        view.canvPos.y - view.canvHeight / 2,
        view.canvWidth,
        view.canvHeight);
    ctx.stroke();
    ctx.fillStyle = backgroundColor;
    ctx.fill();
    ctx.clip();
  };

  rendering.post = function () {
    ctx.restore();
  };

  rendering.processEntity = function (entity) {
    var availableComps = {};
    entity.components.forEach(function (component) {
      switch (component.name) {
        case "pos" :
          availableComps.pos = component;
          break;
        case "poly" :
          availableComps.poly = component;
          break;
      }
    });

    if (availableComps.pos && availableComps.poly) {
      ctx.fillStyle = "#FFFFFF";
      view.renderPoly(availableComps.poly.polygon, availableComps.pos.pos, worldCam);
      ctx.fill();
    }
  };
  systems.push(rendering);
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
  updateSystems();
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
  for (var i = 0; i < frameHistory.length; i ++) {
    avg += frameHistory[i];
  }
  avg /= frameHistory.length;
  frameRate = avg;
}

function updateSystems() {
  systems.forEach(function (system) {
    system.pre();
    entities.forEach(function (entity) {
      system.processEntity(entity);
    });
    system.post();
  })
}

function drawPolygon(polygon, pos) {
  ctx.beginPath();
  if (!polygon.pts) {
    console.error('No property of name [pts] found on polygon parameter.');
  } else {
    var firstPt = polygon.pts[0];
    ctx.moveTo(firstPt.x + pos.x, firstPt.y + pos.y);
    polygon.pts.forEach(function (pt) {
      if (pt !== firstPt) {
        ctx.lineTo(pt.x + pos.x, pt.y + pos.y);
      }
    });
    ctx.lineTo(firstPt.x + pos.x, firstPt.y + pos.y);
  }
}

/**
 * Generate a new Polygon limited
 * @param vertCount
 * @param radius
 * @param x
 * @param y
 * @param startingDegree
 */
function generatePolygon(vertCount, radius, x, y, startingDegree) {
  startingDegree = startingDegree ? startingDegree : 0;
  var circDiv = (2 * Math.PI)  / vertCount;
  var polygon = new Polygon();
  for (var i = 0; i < vertCount; i ++ ) {
    polygon.pts.push(
        new Vector (
            Math.cos(startingDegree + circDiv * i) * radius,
            Math.sin(startingDegree + circDiv * i) * radius
        )
    )
  }
  polygon.x = x ? x : 0;
  polygon.y = y ? y : 0;
  return polygon;
}

// Geometry Classes
function Polygon() {
  this.pts = [];
}

function Vector(x, y) {
  this.x = x ? x : 0;
  this.y = y ? y : 0;
  this.len = Math.sqrt((x * x) + (y * y));
  
  this.set = function (x, y) {
    this.x = x;
    this.y = y;
    this.len = Math.sqrt((x * x) + (y * y));
    return this;
  };
  
  this.add = function (x, y) {
    this.x += x;
    this.y += y;
    return this;
  };

  this.addVec = function (vector) {
    this.x += vector.x;
    this.y += vector.y;
    return this;
  };

  this.copy = function () {
    return new Vector(this.x, this.y);
  }
}

// Simulation classes
function Entity(ID) {
  this.ID = ID;
  this.components = [];
  this.tags = [];
}

function PositionComponent() {
  this.name = "pos";
  this.pos = new Vector();
}

function PolygonComponent(polygon) {
  this.name = "poly";
  this.polygon = polygon;
}

function VelocityComponent() {
  this.name = "vel";
  this.velocity = new Vector();
}

function AccelerationComponent() {
  this.name = "accel";
  this.accel = new Vector();
}

function Camera() {
  this.position = new Vector(0, 0);
  this.width = 1;
  this.height = 1;
  this.zoom = 1;
}

function View(canvWidth, canvHeight) {
  this.canvPos = new Vector(0 , 0);
  this.worldWidth = 1;
  this.worldHeight = 1;
  this.canvWidth = canvWidth;
  this.canvHeight = canvHeight;
  
  this.renderPoly = function (poly, pos, cam) {
    var viewAspectRatio = this.canvHeight / this.canvWidth;
    var canvasAspectRatio = canvas.height / canvas.width;

    var hDiff = this.canvWidth / canvas.width;
    var vDiff = this.canvHeight / canvas.height;

    var canHDiff = canvas.width/ this.worldWidth;
    var canVDiff = canvas.height / this.worldHeight;

    ctx.setTransform(
        hDiff * canHDiff,
        0,
        0,
        vDiff * canVDiff,
        canvas.width / 2 + this.canvPos.x,
        canvas.height / 2 + this.canvPos.y
    );
    drawPolygon(poly, pos);

  }
}

function System() {
  this.pre = function () {
    
  };
  
  this.processEntity = function (entity) {

  };
  
  this.post = function () {
    
  };
}


