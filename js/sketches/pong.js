"use strict";
/**
 * Depends on 'canvasUtils.js'
 */

(function () {
  var FPS = 60;
  var elapsed = 0;
  var lastFrame = 0;
  var delta = 0;
  var startTime = new Date().getTime();
  var frameHistory = [];

  var canvas = document.getElementById("canvas-pong");
  var ctx = canvas.getContext("2d");
  var cW = canvas.width;
  var cH = canvas.height;
  var img = loadImage("teapot.jpg");
  var sprite_teaPot = new Sprite(loadImage("teapot.jpg"), 0, 0, 16, 16);


  function renderLoop() {
    var current = new Date().getTime() - startTime;
    delta = current - lastFrame;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    pollForInput();
    update();
    // render();
    renderDebug();
    lastFrame = current;
    elapsed += delta;
  }

  function pollForInput() {

  }

  function update() {

  }

  function render() {
    ctx.fillStyle = "#0d7da2";
    ctx.beginPath();
    ctx.fillRect(0, 0, 64, 64);
    ctx.stroke();
  }

  function renderDebug() {
    ctx.font = "30px Arial";
    ctx.fillStyle = "#00ff00";
    ctx.fillText("Run Time: " + elapsed, 16, 46);
  }

  setInterval(renderLoop, 0);
})();

