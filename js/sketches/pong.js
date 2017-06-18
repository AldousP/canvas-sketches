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

var polygon = generatePolygon(3, 32, 0, 0, 1.5 * Math.PI);
var worldCam = new Camera();
var UICam = new Camera();
var view = new View(canvas.width * .9, canvas.height * .9);
var polyPos = new Vector(100, 0);

window.requestAnimationFrame(renderLoop);


function renderLoop() {
  // Blank out screen
  ctx.fillStyle = "#000000";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  update();

  // applyCam(worldCam);
  render();
  // renderDebug();

  window.requestAnimationFrame(renderLoop);
}

function applyCam(cam) {
  ctx.save();
  ctx.setTransform(
      cam.zoom,
      0,
      0,
      cam.zoom,
      cam.position.x,
      cam.position.y
  );
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

  ctx.beginPath();
  ctx.rect(
      view.canvPos.x - view.canvWidth / 2,
      view.canvPos.y - view.canvHeight / 2,
      view.canvWidth,
      view.canvHeight);
  ctx.stroke();
  ctx.clip();
  ctx.strokeText("mid-world", 0, 0);

  ctx.beginPath();
  ctx.fillStyle = "#00FF00";
  drawPolygon(polygon, polyPos);
  ctx.fill();
  ctx.restore();
}

function renderDebug() {
  ctx.font = "24px Questrial";
  ctx.fillStyle = "#00FF00";
  ctx.fillText("VIDEO 1", 16, 46);
  ctx.fillText(frameRate.toFixed(0), cW - 48, 46);

  ctx.fillStyle = "#fdfff0";
  ctx.fillText("(0 , 0)", 0, 0);
}


function drawPolygon(polygon, pos) {
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
  
  this.renderPoly = function (poly, pos) {
    var adjPos = pos
    drawPolygon(poly, pos)
  }
}


