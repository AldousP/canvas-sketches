"use strict";

/*
 * Stupid Monolithic object for managing app context
 */

(function () {
  window.sm = {
    poly: generatePolygon(8, 100, 0),
    debug: {
      active: true,
      logConsole: {
        logToScreen: true,
        logToBrowserConsole: false,
        style: "12px Ubuntu Mono",
        color: Color.white,
        padding: 0.025
      }
    },
    conf: {
      resourceDir: "/img"
    },
    logs: [],
    ctx: {},
    canvas: {},
    startTime: 0,
    programs: [],
    init: function (canvasMountId, program) {
      this.log.notify("Sketch Manager Initializing!", "init");
      this.log.notify("Mounting @ " + canvasMountId + "...", "init");
      var mountPoint = document.getElementById(canvasMountId);
      if (mountPoint.tagName.toLowerCase() === "canvas") {
        this.ctx = mountPoint.getContext("2d");
        this.canvas = mountPoint;
        this.log.notify("Mounted @ canvas!", "init");
        this.log.notify("Loading Program: " + program.name + "...", "init");
        program.__proto__ = new ProgramBase();
        this.activeProgram = program;

        program.setup();
        this.log.notify("Loaded. Resource DIR is: " + program.resourceDir + " Starting...", "init");
        window.requestAnimationFrame(this.appLoop);
      } else {
        this.log.error(console.error("Specified Mount Point: " + canvasMountId + " is not a canvas."), "init");
      }
    },
    input: {
      addController: function (mapping) {
        sm.log.notify("Adding controller of type: " + mapping.name, "input");

      },

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
        if (sm.debug.logConsole.logToBrowserConsole) {
          console.log(log);
        }
        sm.logs.push(log);
      },

      error: function (msg, context) {
        var log = this.timestamp() + "[SM-Error][" + (context ? context : "root") + "]: " + msg;
        if (sm.debug.logConsole.logToBrowserConsole) {
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
      clear: function () {
        sm.ctx.fillStyle = "#001436";
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
    appLoop: function () {
      sm.input.update();
      sm.gfx.preDraw();
      sm.gfx.setFillColor(Color.white);
      if (sm.activeProgram) {
        sm.activeProgram.update(sm);
      }

      // sm.gfx.setStrokeColor(Color.white);
      // sm.gfx.drawPolygon(sm.poly, new Vector(0, 0));

      var viewPortW = sm.canvas.width;
      var viewPortH = sm.canvas.height;
      var padding = sm.debug.logConsole.padding;
      var offsetW = viewPortW * padding;
      var offsetH = viewPortH * padding;
      if (sm.debug.logConsole.logToScreen) {
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
    }
  };
})();

