"use strict";

/*
 * Stupid Monolithic object for managing app context
 */

(function () {
  window.sm = {
    context: "root", // Used for logging context.
    conf: {
      resourceDir: "img",
      debug: {
        active: true,
        logConsole: {
          logToScreen: true,
          logToBrowserConsole: false,
          style: "12px Ubuntu Mono",
          color: Color.white,
          padding: 0.025,
          bgColor: "#001436"
        }
      }
    },

    logs: [],
    ctx: {},
    canvas: {},

    input: {
      fire: function (button) {
        sm.log.notify("firing! " + button, "input");
        this.state[button] = true;
        sm.sfx.beep();
      },
      update: function () {
        this.state = {};
      },
      state: {}
    },

    log: {
      notify: function (msg, context) {
        var date = new Date();
        var log = this.timestamp() + "[SM-Notify][" + (context ? context : "root") + "]: " + msg;
        if (sm.conf.debug.logConsole.logToBrowserConsole) {
          console.log(log);
        }
        sm.logs.push(log);
      },

      error: function (msg, context) {
        var log = this.timestamp() + "[SM-Error][" + (context ? context : "root") + "]: " + msg;
        if (sm.conf.debug.logConsole.logToBrowserConsole) {
          console.error(log);
        }
        sm.logs.push(log);
      },

      timestamp: function () {
        var date = new Date();
        return "(" +
            date.getHours() + ":" +
            date.getMinutes() + ":" +
            date.getSeconds() + ":" +
            date.getMilliseconds() +
            ")";
      }
    },

    gfx: {
      clear: function (color) {
        if (color) {
          sm.ctx.fillStyle = color;
        } else {
          sm.ctx.fillStyle = sm.conf.debug.logConsole.bgColor;
        }
        sm.ctx.fillRect(0, 0, sm.canvas.width, sm.canvas.height);
      },

      drawPolygon: function (polygon, pos) {
        sm.ctx.beginPath();
        if (!polygon.pts) {
          console.error('No property of name [pts] found on polygon parameter.');
        } else {
          var firstPt = polygon.pts[0];
          sm.ctx.moveTo(firstPt.x + pos.x, firstPt.y + pos.y);
          polygon.pts.forEach(function (pt) {
            if (pt !== firstPt) {
              sm.ctx.lineTo(pt.x + pos.x, pt.y + pos.y);
            }
          });
          sm.ctx.lineTo(firstPt.x + pos.x, firstPt.y + pos.y);
        }
        sm.ctx.closePath();
        sm.ctx.stroke();
      },

      preDraw: function () {
        sm.gfx.clear();
        sm.ctx.save();
        sm.ctx.translate(sm.canvas.width / 2, sm.canvas.height / 2);
      },

      drawImage: function (image, x, y, w, h, align) {
        if (image) {
          if (align) {
            var adj = align(x, y, w, h);
            sm.ctx.drawImage(image, adj.x, adj.y, w, h);
          } else {
            sm.ctx.drawImage(image, x, y, w, h);
          }
        }
      },

      loadImage: function (handle, callback) {
        var img = new Image();
        if (sm.activeProgram) {
          img.src = sm.activeProgram.resourceDir + "/" + handle;
        } else {
          img.src = sm.conf.resourceDir + "/" + handle;
        }
        img.onload = callback;
      },

      postDraw: function () {
        sm.ctx.restore();
      },

      drawRect: function (x, y, w, h, fill, align) {
        sm.ctx.beginPath();
        var adj = {
          x: x,
          y: y
        };
        if (align) {
          adj = align(x, y, w, h);
        }

        sm.ctx.rect(adj.x, adj.y, w, h);
        if (fill) {
          sm.ctx.fill();
        }
        sm.ctx.stroke();
        sm.ctx.closePath();
      },

      drawLine: function (x1, y1, x2, y2) {
        sm.ctx.beginPath();
        sm.ctx.moveTo(x1, y1);
        sm.ctx.lineTo(x2, y2);
        sm.ctx.stroke();
        sm.ctx.closePath();
      },

      drawCircle: function (x, y, radius) {
        sm.ctx.beginPath();
        sm.ctx.arc(x, y, radius, 0, Math.PI * 2);
        sm.ctx.stroke();
        sm.ctx.closePath();
      },

      setStrokeColor: function (color) {
        sm.ctx.strokeStyle = color;
      },

      setStrokeWidth: function (width) {
        sm.ctx.lineWidth = width;
      },

      setFillColor: function (color) {
        sm.ctx.fillStyle = color;
      },

      text: function (center, msg, x, y, fontSize, font) {
        sm.ctx.textAlign = center ? "center" : "left";
        sm.ctx.beginPath();
        if (fontSize) {
          if (font) {
            sm.ctx.font = fontSize + "px " + font;
          } else {
            sm.ctx.font = fontSize + "px Arial";
          }
        } else {
          if (font) {
            sm.ctx.font = "10px " + font;
          }
        }

        sm.ctx.fillText(msg, x, y);
        sm.ctx.closePath();
      }
    },

    sfx: {
      ctx: new (window.AudioContext || window.webkitAudioContext)(),
      beep: function () {
        var oscillator = this.ctx.createOscillator();
        var gainNode = this.ctx.createGain();
        oscillator.connect(gainNode);
        gainNode.connect(this.ctx.destination);
        gainNode.gain.value = .025;
        oscillator.frequency.value = 440;
        oscillator.type = "square";
        oscillator.start();
        setTimeout(
            function () {
              oscillator.stop();
            },
            200
        );
      }
    },

    init: function (canvasMountId, program) {
      this.log.notify("Sketch Manager initializing...", sm.context);
      this.log.notify("Mounting @ " + canvasMountId + "...", sm.context);
      var mountPoint = document.getElementById(canvasMountId);
      if (mountPoint.tagName.toLowerCase() === "canvas") {
        this.ctx = mountPoint.getContext("2d");
        this.canvas = mountPoint;
        this.log.notify("Mounted @ canvas.", sm.context);
        window.requestAnimationFrame(this.appLoop);
      } else {
        this.log.error(console.error("Specified Mount Point: " + canvasMountId + " is not a canvas."), sm.context);
      }

      if (program) {
        sm.loadProgram(program);
      }
    },

    appLoop: function () {
      sm.input.update();
      sm.gfx.preDraw();

      if (sm.activeProgram) {
        sm.activeProgram.update(sm);
      }

      if (!sm.activeProgram) {
        sm.gfx.setFillColor(Color.white);
        var viewPortW = sm.canvas.width;
        var viewPortH = sm.canvas.height;
        var padding = sm.conf.debug.logConsole.padding;
        var offsetW = viewPortW * padding;
        var offsetH = viewPortH * padding;
        for (var i = 0; i < sm.logs.length; i++) {
          sm.gfx.text(
              false,
              sm.logs[i],
              (-viewPortW / 2) + offsetW,
              (-(viewPortH / 2) + offsetH) + (offsetH * ( sm.logs.length - i)),
              10,
              'Ubuntu Mono'
          );
        }
      }
      sm.gfx.postDraw();
      window.requestAnimationFrame(sm.appLoop);
    },

    loadProgram: function (program) {
      sm.log.notify("Loading Program: " + program.name + "...", sm.context);
      program.__proto__ = new ProgramBase();
      program.setup();
      sm.log.notify("Loaded Program. Resource DIR is: " + program.resourceDir, sm.context);
      sm.log.notify("Starting...", program.name);
      sm.activeProgram = program;
      document.body.dispatchEvent(new CustomEvent("smProgramLoaded", {"detail": {"programName": program.name}}));
    },

    unloadProgram: function () {
      var name = "";
      if (!sm.activeProgram) {
        sm.log.notify("Nothing to unload. Did you load a program?", sm.context);
      } else {
        sm.log.notify("Unloading: " + name + "...", sm.context);
      }
      sm.activeProgram = undefined;
      document.body.dispatchEvent(
          new CustomEvent("smProgramUnloaded", {"detail": {"programName": name}})
      );
    }
  };
})();

