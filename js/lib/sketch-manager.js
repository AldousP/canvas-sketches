"use strict";
(function () {
  window.sm = {
    conf : {
      debug: {
        active : true,
        logConsole : {
          style : "12px Ubuntu Mono",
          color : Color.white,
          padding : 0.025
        }
      }
    },
    logs : [],
    ctx: {},
    canvas: {},
    startTime : 0,
    programs: [],
    activeProgram: {},
    init : function (canvasMountId, program) {
      this.log.notify("Sketch Manager Initializing!", "Init");
      this.log.notify("Mounting @ " + canvasMountId + "...", "Init");
      var mountPoint = document.getElementById(canvasMountId);
      if (mountPoint.tagName.toLowerCase() === "canvas") {
        this.ctx = mountPoint.getContext("2d");
        this.canvas = mountPoint;
        this.log.notify("Mounted @ canvas!", "Init");
        this.log.notify("Loading Program: " + program.name + "...", "Init");
        program.__proto__ = new ProgramBase();
        program.setup();
        this.log.notify("Loaded. Starting...", "Init");
        this.activeProgram = program;
        window.requestAnimationFrame(this.appLoop);
      } else {
        this.log.error(console.error("Specified Mount Point: " + canvasMountId + " is not a canvas."), "Init");
      }
    },
    log : {
      notify : function (msg, context) {
        var log = "[SM-Notify][" + (context ? context : "ROOT") + "]: " + msg;
        console.log(log);
        sm.logs.push(log);
      },

      error : function (msg, context) {
        var log = "[SM-Error][" + (context ? context : "ROOT") + "]: " + msg;
        console.error(log);
        sm.logs.push(log);
      }
    },

    gfx : {
      clear : function () {
        sm.ctx.fillStyle = "#000000";
        sm.ctx.fillRect(0, 0, sm.canvas.width, sm.canvas.height);
      },

      polygon : function (polygon, position) {
        
      },

      preDraw : function () {
        sm.gfx.clear();
        sm.ctx.save();
        sm.ctx.translate(sm.canvas.width / 2, sm.canvas.height / 2);
      },
      
      postDraw : function () {
        sm.ctx.restore();
      },

      drawRect : function (x, y, w, h, fill, align) {
        sm.ctx.beginPath();
        sm.gfx.setStrokeColor(Color.white);
        sm.ctx.rect(x, y, w, h);
        sm.ctx.stroke();
        if (fill) {
          sm.ctx.fill();
        }
        sm.ctx.closePath();
      },
      
      setStrokeColor : function (color) {
        sm.ctx.strokeStyle = color;
      },

      setFillColor : function (color) {
        sm.ctx.fillStyle = color;
      },
      
      text : function (msg, x, y) {
        sm.ctx.fillText(msg, x, y);
      }
    },

    appLoop : function () {
      sm.gfx.preDraw();
      sm.gfx.setFillColor(Color.white);

      var viewPortW = sm.canvas.width;
      var viewPortH = sm.canvas.height;
      var padding = sm.conf.debug.logConsole.padding;
      var offsetW = viewPortW * padding;
      var offsetH = viewPortH * padding;
      var index = 0;
      sm.logs.forEach(function (msg) {
        var ind = index;
        sm.gfx.text(
            msg,
            (-viewPortW / 2) + offsetW ,
            ((-viewPortH / 2) + offsetH) + offsetH * ind
        );
        index ++;
      });

      if (sm.activeProgram) {
        sm.activeProgram.update(sm);
      }
      sm.gfx.postDraw();
      window.requestAnimationFrame(sm.appLoop);
    }
  };
})();

