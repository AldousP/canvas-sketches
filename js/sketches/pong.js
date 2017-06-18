"use strict";

var contextZoom = 1;
var canvas = document.getElementById("canvas-pong");
var ctx = canvas.getContext("2d");
var cW = canvas.width;
var cH = canvas.height;
var last = 0;
var current = 0;
var delta;
var frameRate;
var frameHistory = [];
var historyCap = 30;

var polygon = generatePolygon(4, .5, 0, 0, 1.25 * Math.PI);
var worldCam = new Camera();
var UICam = new Camera();

var polyPos = new Vector(0 , 0);

var views = [];

var radius = canvas.width / 4;
for(var i = 0; i < 2; i++) {
  var rotation = i * (Math.PI);
  var tempView = new View(canvas.width * .49, canvas.height * .85);
  tempView.canvPos.add(
      Math.cos(rotation + Math.PI) * radius,
      Math.sin(rotation + Math.PI) * radius);
  views.push(tempView);
}

window.requestAnimationFrame(renderLoop);

function renderLoop() {
  // Blank out screen
  ctx.fillStyle = "#000000";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  update();
  render();
  window.requestAnimationFrame(renderLoop);
}

function update() {
  current = new Date().getTime();
  delta = (current - last) / 1000;
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

function setZoom() {
  ctx.scale(contextZoom, contextZoom);
}

function render() {
  ctx.save();

  ctx.translate(canvas.width / 2, canvas.height / 2);
  ctx.strokeStyle = "#FFFFFF";

  views.forEach(function (view) {
    ctx.save();
    ctx.strokeStyle = "#00FF00";
    ctx.beginPath();
    ctx.rect(
        view.canvPos.x - view.canvWidth / 2,
        view.canvPos.y - view.canvHeight / 2,
        view.canvWidth,
        view.canvHeight);
    ctx.stroke();
    ctx.clip();
    ctx.fillStyle = "#9800ff";
    ctx.fillRect(
        view.canvPos.x - view.canvWidth / 2,
        view.canvPos.y - view.canvHeight / 2,
        view.canvWidth,
        view.canvHeight);

    ctx.fillStyle = "#FFFFFF";
    view.renderPoly(polygon, polyPos, worldCam);
    ctx.fill();
    ctx.restore();
  });

  ctx.restore();
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
  this.x = x;
  this.y = y;
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

function Entity(ID) {
  this.ID = ID;
  this.components = [];
}

function PositionComponent() {
  this.x = 0;
  this.y = 0;
  this.z = 0;
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


