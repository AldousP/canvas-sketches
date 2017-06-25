"use strict";

function ProgramBase() {
  this.canvas = document.getElementById("canvas");
  this.ctx = canvas.getContext("2d");
  this.last = new Date().getTime();
  this.current = new Date().getTime();
  this.delta = 0;
  this.frameRate = 0;
  this.frameHistory = [];
  this.historyCap = 30;
  this.worldCam = new Camera();
  this.padding = .95;
  this.view = 0;
  this.backgroundColor = "#545454";
  this.entityHandler = new EntityHandler();
  this.systemHandler = new SystemHandler();
  this.storedState = {};
  this.paused = false;

  this.copyState = function() {
    storedState = JSON.stringify(entityHandler.entities);
  };

  this.restoreState = function() {
    entityHandler.entities = JSON.parse(storedState);
  };

  this.unload = function () {
    console.log("Unloading " + name)
  };

  this.preDraw = function(smContext) {
    this.current = new Date().getTime();
    this.delta = (this.current - this.last) / 1000;
    // ctx.save();
    // ctx.translate(canvas.width / 2, canvas.height / 2);
    smContext.gfx.preDraw();
    this.updateFrameCount();
    // systemHandler.updateSystems(delta, entityHandler);
    // ctx.restore();
  };

  this.postDraw = function (smContext) {
    smContext.gfx.postDraw();
  };

  this.updateFrameCount = function() {
    this.frameRate = (1000 / this.delta) / 1000;
    this.last = this.current;
    this.frameHistory.push(this.frameRate);
    if (this.frameHistory.length > this.historyCap) {
      this.frameHistory.splice(0, 1);
    }
    var avg = 0;
    for (var i = 0; i < this.frameHistory.length; i++) {
      avg += this.frameHistory[i];
    }
    avg /= this.frameHistory.length;
    this.frameRate = avg;
  };
}