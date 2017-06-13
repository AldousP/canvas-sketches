"use strict";
/**
 * Depends on 'canvasUtils.js'
 */

(function () {
  var canvas = document.getElementById("canvas-pong");
  var ctx = canvas.getContext("2d");
  var cW = canvas.width;
  var cH = canvas.height;
  var img = loadImage("teapot.jpg");
  var sprite_teaPot = new Sprite(loadImage("teapot.jpg"), 0, 0, 16, 16);

  var last = 0;
  var current = 0;
  var delta;
  var frameRate;
  var frameHistory = [];
  var historyCap = 30;

  function renderLoop() {
    ctx.fillStyle = "#000000";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    pollForInput();
    update();
    render();
    renderDebug();
    window.requestAnimationFrame(renderLoop);
  }

  function pollForInput() {

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

  function drawLines() {
    ctx.strokeStyle = "#FFFFFF";
    ctx.moveTo(cW / 2, 0);
    ctx.lineTo(cW / 2, cH);
    ctx.moveTo(0, cH / 2);
    ctx.lineTo(cW, cH / 2);
    ctx.stroke();
  }

  function render() {
    drawLines();
  }

  function renderDebug() {
    ctx.font = "24px Questrial";
    ctx.fillStyle = "#00FF00";
    ctx.fillText("VIDEO 1", 16, 46);
    ctx.fillText(frameRate.toFixed(0), cW - 48, 46);
  }

  window.requestAnimationFrame(renderLoop);
  //
})();

