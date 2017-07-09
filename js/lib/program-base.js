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
  this.padding = .95;
  this.view = 0;
  this.entityHandler = new EntityHandler();
  this.systemProcessor = new SystemProcessor(this.entityHandler);
  this.storedState = {};
  this.paused = false;

  this.copyState = function() {
    this.storedState = JSON.stringify(this.entityHandler.entities);
  };

  this.restoreState = function() {
    this.entityHandler.entities = JSON.parse(storedState);
  };

  this.updateBase = function () {
    this.updateFrameCount();
  };

  this.sampleFunction = function () {
	};

  this.updateFrameCount = function() {
    this.current = new Date().getTime();
    this.delta = (this.current - this.last) / 1000;
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