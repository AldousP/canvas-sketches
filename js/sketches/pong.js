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

var polygon = generatePolygon(3, 64, 0, 0, 1.5 * Math.PI);

window.requestAnimationFrame(renderLoop);


function renderLoop() {
  // Blank out screen
  ctx.fillStyle = "#000000";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  update();
  setZoom();
  render();
  renderDebug();

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
  drawLines();
  ctx.save();
  ctx.translate(cW / 2, cH / 2);
  ctx.strokeStyle = "#FFFFFF";
  drawPolygon(polygon);
  ctx.stroke();
  ctx.restore();
}

function renderDebug() {
  ctx.font = "24px Questrial";
  ctx.fillStyle = "#00FF00";
  ctx.fillText("VIDEO 1", 16, 46);
  ctx.fillText(frameRate.toFixed(0), cW - 48, 46);
}


// Geometry rendering functions
function drawLines() {
  ctx.strokeStyle = "#FFFFFF";
  ctx.moveTo(cW / 2, 0);
  ctx.lineTo(cW / 2, cH);
  ctx.moveTo(0, cH / 2);
  ctx.lineTo(cW, cH / 2);
  ctx.stroke();

  ctx.font = "12px Questrial";
  ctx.fillStyle = "#FFFFFF";
  ctx.fillText("0, 0", 0, 0);
}

function drawPolygon(polygon) {
  if (!polygon.pts) {
    console.error('No property of name [pts] found on polygon parameter.');
  } else {
    var firstPt = polygon.pts[0];
    ctx.moveTo(firstPt.x, firstPt.y);
    polygon.pts.forEach(function (pt) {
      if (pt !== firstPt) {
        ctx.lineTo(pt.x, pt.y);
      }
    });
    ctx.lineTo(firstPt.x, firstPt.y);
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
  this.x = 0;
  this.y = 0;
  this.pts = [];
}

function Vector(x, y) {
  this.x = x;
  this.y = y;
  this.len = Math.sqrt((x * x) + (y * y));
}

