"use strict";

/*
 * Stupid Monolithic object for managing app context
 */

(function () {
  window.sm = {
    context: "root", // Used for logging context.
    state: {
      paused : false
    },
    conf: {
      resourceDir: "assets",
      debug: {
        active: true,
        logConsole: {
          logToScreen: true,
          logToBrowserConsole: false,
          size : 10,
          color: Color.white,
          padding: 0.025,
          bgColor: "#001436",
          logInProgram: true
        }
      }
    },
    breakOnNextLoop : false,
    break: function () {
      sm.breakOnNextLoop = true;
    },
    loop : {},
    logs: [],
    ctx: {},
    canvas: {},
    utils : {
      dumpActiveComponentTree : function () {

			},
			logComponentTree : function (root, iteration) {

			},
      formatters : {
        float_two_pt : function (val) {
          return parseFloat((Math.round(val * 100) / 100).toFixed(2));
        }
      }
    },
    input: {
      fire: function (button) {
        sm.log.notify("firing! " + button, "input");
        this.state[button] = true;
        sm.sfx.beep(Notes.C4);
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
      width: 0,
      height: 0,
      clear: function (color) {
        sm.ctx.translate(-sm.canvas.width / 2, -sm.canvas.height / 2);
        if (color) {
          sm.ctx.fillStyle = color;
        } else {
          sm.ctx.fillStyle = sm.conf.debug.logConsole.bgColor;
        }
        sm.ctx.fillRect(0, 0, sm.canvas.width * 100, sm.canvas.height * 100);
        sm.ctx.translate(sm.canvas.width / 2, sm.canvas.height / 2);
      },

      drawPolygon: function (polygon, pos, fill, rotation) {
        sm.ctx.translate(pos.x, -pos.y);
        sm.ctx.rotate(rotation);
        sm.ctx.beginPath();
        if (!polygon.pts) {
          console.error('No property of name [pts] found on polygon parameter.');
        } else {
          var firstPt = polygon.pts[0];
          sm.ctx.moveTo(firstPt.x, firstPt.y);
          polygon.pts.forEach(function (pt) {
            if (pt !== firstPt) {
              sm.ctx.lineTo(pt.x , pt.y);
            }
          });
          sm.ctx.lineTo(firstPt.x, firstPt.y);
        }
        sm.ctx.closePath();
        fill ? sm.ctx.fill() : sm.ctx.stroke();
        sm.ctx.rotate(-rotation);
        sm.ctx.translate(-pos.x, pos.y);
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

      preDraw: function () {
        sm.gfx.width = sm.canvas.width;
        sm.gfx.height = sm.canvas.height;
        sm.ctx.save();
        sm.ctx.translate(sm.canvas.width / 2, sm.canvas.height / 2);
      },

      postDraw: function () {
        sm.ctx.restore();
      },

      drawRect: function (x, y, w, h, fill, rotation) {
        sm.ctx.beginPath();
        sm.ctx.fillStyle = 'white';
        var adj = Align.center(x, y, w, h);
        var transX = adj.x + (w / 2);
        var transY = adj.y + (h / 2);
        sm.ctx.translate(transX, transY);
        sm.ctx.rotate(rotation / DEG_RAD);
        sm.ctx.rect(-(w / 2), -(h / 2), w, h);
        if (fill) {
          sm.ctx.fill();
        }
        sm.ctx.stroke();
        sm.ctx.closePath();
        sm.ctx.rotate(- (rotation / DEG_RAD));
        sm.ctx.translate(-transX, -transY);
      },

      drawLine: function (x1, y1, x2, y2) {
        sm.ctx.beginPath();
        sm.ctx.moveTo(x1, y1);
        sm.ctx.lineTo(x2, y2);
        sm.ctx.stroke();
        sm.ctx.closePath();
      },

      drawVec: function (vec) {
        sm.ctx.beginPath();
        sm.ctx.moveTo(0, 0);
        sm.ctx.lineTo(vec.x, -vec.y);
        sm.ctx.stroke();
        sm.ctx.closePath();
      },

      drawPtVec: function (pt, vec) {
        sm.ctx.beginPath();
        sm.ctx.moveTo(pt.x, -pt.y);
        sm.ctx.lineTo(pt.x + vec.x, -pt.y - vec.y);
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
      beep: function (note) {
        var oscillator = this.ctx.createOscillator();
        var gainNode = this.ctx.createGain();
        oscillator.connect(gainNode);
        gainNode.connect(this.ctx.destination);
        gainNode.gain.value = .025;
        oscillator.frequency.value = note ? note : 440;
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
      if (mountPoint && mountPoint.tagName.toLowerCase() === "canvas") {
        this.ctx = mountPoint.getContext("2d");
        this.canvas = mountPoint;
        this.log.notify("Mounted @ canvas.", sm.context);
        window.requestAnimationFrame(this.appLoop);
      } else {
        this.log.error(console.error("Specified Mount Point: " + canvasMountId + " is not a canvas."), sm.context);
      }

      sm.gfx.width = sm.canvas.width;
      sm.gfx.height = sm.canvas.height;

      if (program) {
        sm.loadProgram(program);
      }
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
    },

    appLoop: function () {
      if (sm.input.state.virtualButtonSelect) {
        sm.unloadProgram();
      }
      sm.input.update();
      sm.gfx.clear();
      sm.gfx.preDraw();


      if (sm.activeProgram) {
        sm.activeProgram.update(sm);
      }

      if (!sm.activeProgram || sm.conf.debug.logConsole.logInProgram) {
        if (sm.activeProgram) {
					sm.gfx.setFillColor(Color.green);
				} else {
					sm.gfx.setFillColor(Color.white);
        }
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
              sm.conf.debug.logConsole.size,
              'Ubuntu Mono'
          );
        }
      }

      sm.gfx.postDraw();
      if (sm.conf.debug.active) {
        if (sm.activeProgram) {
          sm.gfx.setFillColor(Color.white);
          sm.gfx.text(
              false,
              sm.activeProgram.name,
              sm.canvas.width / 3,
              -sm.canvas.height / 2.2,
              14,
              'Ubuntu Mono');

          sm.gfx.text(
              false,
              sm.utils.formatters.float_two_pt(sm.activeProgram.frameRate),
              sm.canvas.width / 3,
              -sm.canvas.height / 2.35,
              14,
              'Ubuntu Mono');

        }
      }

      if (!sm.breakOnNextLoop) {
        window.requestAnimationFrame(sm.appLoop);
      } else {
        sm.breakOnNextLoop = false;
        sm.unloadProgram();
        console.log("Shutting Down SM. Logs can be found at sm.logs.");
        sm.ctx.save();
        sm.ctx.fillStyle = "#FFFFFF";
        sm.ctx.fillRect(0, 0, sm.canvas.width, sm.canvas.height);
      }
    }
  };
})();

