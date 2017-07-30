'use strict';

/*
 * Stupid Monolithic object for managing app context
 */

(function () {
  window.sm = {
    programDescription: function () {
      return sm.activeProgram ? sm.activeProgram.state.meta.description : 'No Program Loaded';
    },
    toggleDebug : function () {
      sm.conf.debug.active = !sm.conf.debug.active;
    },
    
    togglePause : function () {
      sm.conf.paused = !sm.conf.paused;
    },
    
    checkIfMobile : function () {
      sm.conf.mobile.is_mobile = window.innerWidth < sm.conf.mobile.mobile_break;

      if (sm.conf.mobile.last_win_width > sm.conf.mobile.mobile_break && sm.conf.mobile.is_mobile) {
        sm.resizeCanvas();
      }

      if (sm.conf.mobile.last_win_width < sm.conf.mobile.mobile_break && !sm.conf.mobile.is_mobile) {
        sm.resizeCanvas();
      }
      sm.conf.mobile.last_win_width = window.innerWidth;
    },

    resizeCanvas : function () {
      if (sm.conf.mobile.is_mobile) {
        sm.canvas.width = sm.canvas.height;
      } else {
        sm.canvas.width = sm.canvas.height * 2;
      }

      if (sm.activeProgram && sm.activeProgram.onResize) {
        sm.activeProgram.onResize(sm.conf.mobile.is_mobile);
      }
    },
    stop : function() {
      sm.breakOnNextLoop = true;
    },
    context: 'root', // Used for logging context.
    conf: {
      paused : false,
      resourceDir: 'assets',
      mobile : {
        is_mobile : true,
        last_win_width : 451,
        mobile_break : 450
      },
      debug: {
        active: false,
        logConsole: {
          logToScreen: true,
          logToBrowserConsole: true,
          textConf : {
            color: Color.white,
            size: 12,
            font: 'Arial',
            style : 'normal',
            align: 'left'
          },
          padding: 0.025,
          logInProgram: true
        }
      }
    },
    time: {
      last : new Date().getTime(),
      current : new Date().getTime(),
      delta : 0,
      frameRate : 0,
      frameHistory : [],
      historyCap : 100,
      update : function () {
        sm.time.current = new Date().getTime();
        sm.time.delta = (sm.time.current - sm.time.last) / 1000;
        sm.time.frameRate = (1000 / sm.time.delta) / 1000;
        sm.time.last = sm.time.current;
        sm.time.frameHistory.push(sm.time.frameRate);
        if (sm.time.frameHistory.length > sm.time.historyCap) {
          sm.time.frameHistory.splice(0, 1);
        }
        var avg = 0;
        for (var i = 0; i < sm.time.frameHistory.length; i++) {
          avg += sm.time.frameHistory[i];
        }
        avg /= sm.time.frameHistory.length;
        sm.time.frameRate = avg;
      }
    },
    logs: [],
    ctx: {},
    canvas: {},
    utils : {
      formatters : {
        float_two_pt : function (val) {
          return parseFloat((Math.round(val * 100) / 100).toFixed(2));
        },

        float_one_pt : function (val) {
          return parseFloat((Math.round(val * 100) / 100).toFixed(1));
        }
      }
    },
    input: {
      state: {
        keyboard: {

        },
        mousePos: new Vector(),
        controllers: [

        ]
      },
      init: function () {
        // Input initializations
        document.addEventListener('keydown', function (event) {
          var keyCode = event.keyCode;
          sm.input.state.keyboard[keyCode] = true;
        });

        document.addEventListener('keyup', function (event) {
          var keyCode = event.keyCode;
          sm.input.state.keyboard[keyCode] = false;
        });
      },
      update: function () {
        var controllers = navigator.getGamepads();

        if (controllers) {
          var realControllers = [];
          var controllerKeys = Object.keys(controllers);
          controllerKeys.forEach(function (key) {
            var entry = controllers[key];
            if (entry && entry.axes && entry.buttons) {
              realControllers.push(entry);
            }
          });
          sm.input.state.controllers = realControllers;
        }

      }
    },
    log: {
      notify: function (msg, context) {
        var date = new Date();
        var log = '[SM-Notify][' + (context ? context : 'root') + ']: ' + msg;
        if (sm.conf.debug.logConsole.logToBrowserConsole) {
          console.log(log);
        }
        sm.logs.push(this.timestamp() + log);
      },

      error: function (msg, context) {
        var log = '[SM-Error][' + (context ? context : 'root') + ']: ' + msg;
        if (sm.conf.debug.logConsole.logToBrowserConsole) {
          console.error(log);
        }
        sm.logs.push(this.timestamp() + log);
      },

      timestamp: function () {
        var date = new Date();
        return '(' +
            date.getHours() + ':' +
            date.getMinutes() + ':' +
            date.getSeconds() + ':' +
            date.getMilliseconds() +
            ')';
      }
    },

    gfx: {
      textConf : {
        color: Color.white,
        size: 12,
        font: 'Arial',
        style : 'normal',
        align: 'left'
      },
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
          sm.ctx.moveTo(firstPt.x, -firstPt.y);
          polygon.pts.forEach(function (pt) {
            if (pt !== firstPt) {
              sm.ctx.lineTo(pt.x , -pt.y);
            }
          });
          sm.ctx.lineTo(firstPt.x, -firstPt.y);
        }
        sm.ctx.closePath();
        sm.ctx.stroke();
        if (fill) {
          sm.ctx.fill();
        }
        sm.ctx.rotate(-rotation);
        sm.ctx.translate(-pos.x, pos.y);
      },

      clipPoly: function (polygon, pos, rotation) {
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
        sm.ctx.clip();
        sm.ctx.rotate(-rotation);
        sm.ctx.translate(-pos.x, pos.y);
      },

      drawImage: function (image, x, y, w, h, flipped) {
        if (image) {
          if (flipped) {
            sm.ctx.translate(x + image.width, 0);
            sm.ctx.scale(-1,1);
            sm.ctx.drawImage(image, 0, y);
          } else {
            sm.ctx.drawImage(image, x, y);
          }
        }
      },

      loadImage: function (handle, callback) {
        var img = new Image();
        if (sm.activeProgram) {
          img.src = sm.activeProgram.resourceDir + '/' + handle;
        } else {
          img.src = sm.conf.resourceDir + '/' + handle;
        }
        img.onload = callback;
      },

      preDraw: function () {
        sm.gfx.width = sm.canvas.width;
        sm.gfx.height = sm.canvas.height;
        sm.ctx.save();
      },

      postDraw: function () {
        sm.ctx.restore();
      },

      drawRect: function (x, y, w, h, fill, rotation, noAlign) {
        sm.ctx.beginPath();
        sm.ctx.fillStyle = 'white';
        var adj;

        if (!noAlign) {
          adj = Align.center(x, y, w, h);
        } else {
          adj = { x: x, y: y};
        }
        var transX = adj.x + (w / 2);
        var transY = adj.y + (h / 2);
        sm.ctx.translate(transX, -transY);
        sm.ctx.rotate(rotation / DEG_RAD);
        sm.ctx.rect(-(w / 2), -(h / 2), w, h);
        if (fill) {
          sm.ctx.fill();
        }
        sm.ctx.stroke();
        sm.ctx.closePath();
        sm.ctx.rotate(- (rotation / DEG_RAD));
        sm.ctx.translate(-transX, transY);
      },

      drawRectVec: function (vec, w, h, fill, rotation) {
        sm.ctx.beginPath();
        sm.ctx.fillStyle = 'white';
        var x = vec.x;
        var y = vec.y;
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

      setTextConf: function (conf) {
        this.textConf = conf;
        var keys = Object.keys(conf);
        keys.forEach(function (key) {
          if (conf[key]) {
            sm.gfx.textConf[key] = conf[key];
          }
        });
        this._processTextConf();
      },

      _processTextConf : function () {
        var styleString =
            sm.gfx.textConf.style + ' ' +
            'normal ' +                         // Font-Variant
            'normal ' +                         // Font-Variant
            sm.gfx.textConf.size + 'px ' +
            sm.gfx.textConf.font;
        sm.ctx.font = styleString;
        var align = sm.gfx.textConf.align;
        sm.ctx.textAlign = align ? align : 'center';
      },

      text: function (msgs, x, y, rotation) {
        this._processTextConf();
        var currentColor = sm.ctx.fillStyle;
        var fontSize = sm.gfx.textConf.size;

        y = y ? -y : 0;
        x = x ? x : 0;

        sm.gfx.setFillColor(this.textConf.color);
        if (msgs.forEach) {
          sm.ctx.save();
          sm.ctx.translate(x, y);
          sm.ctx.rotate(rotation);
          msgs.forEach(function (msg, index) {
            sm.ctx.fillText(msg, 0, (index * fontSize));
          });
          sm.ctx.restore();
        } else {
          sm.ctx.save();
          sm.ctx.translate(x, y);
          sm.ctx.rotate(rotation);
          sm.ctx.fillText(msgs, 0, 0);
          sm.ctx.restore();
        }

        if (currentColor) {
          sm.gfx.setFillColor(currentColor);
        }
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
        oscillator.type = 'square';
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
      this.log.notify('Mounting @ ' + canvasMountId + '...', sm.context);
      var mountPoint = document.getElementById(canvasMountId);

      if (mountPoint && mountPoint.tagName.toLowerCase() === 'canvas') {
        this.ctx = mountPoint.getContext('2d');
        this.canvas = mountPoint;
        window.requestAnimationFrame(this.appLoop);
      } else {
        this.log.error(console.error('Specified Mount Point: ' + canvasMountId + ' is not a canvas.'), sm.context);
      }

      sm.gfx.width = sm.canvas.width;
      sm.gfx.height = sm.canvas.height;


      sm.input.init();
      sm.input.update();
      if (program) {
        sm.loadProgram(program);
      }
    },

    loadProgram: function (program) {
      var state = program.state;
      var meta = state ? state.meta : null;

      if (!state) {
        sm.log.error('No state found on provided program.');
        return -1;
      }

      if (!meta) {
        sm.log.error('No meta object found on the provided program');
        return -1;
      }

      sm.log.notify('Loading Program: ' + meta.name + '...', sm.context);
      program.entityMapper = new EntityMapper();
      program.systemProcessor = new SystemProcessor(program.entityMapper, state);

      program.fireEvent = function (event, payload) {
        program.systemProcessor.fireEvent(event, payload);
      };

      try {
        program.setup();
      } catch (e) {
        sm.log.error('Error loading program: ' + meta.name);
        sm.log.error(e);
        return;
      }

      sm.activeProgram = program;
      sm.log.notify('Starting...', meta.name);
      document.body.dispatchEvent(new CustomEvent('smProgramLoaded',
          {
            'detail': {
              'name': meta.name,
              'description': meta.description
            }
          })
      );
    },

    unloadProgram: function () {
      if (!sm.activeProgram) {
        sm.log.notify('Nothing to unload. Did you load a program?', sm.context);
      } else {
        var name = sm.activeProgram.state.meta.name;
        sm.log.notify('Unloading: ' + name + '...', sm.context);
        sm.activeProgram = undefined;
        document.body.dispatchEvent(
            new CustomEvent('smProgramUnloaded', {'detail': {'programName': name}})
        );
      }
    },

    appLoop: function () {
      sm.time.update();
      sm.input.update();

      sm.gfx.clear(Color.dark_blue);

      sm.gfx.preDraw();
      var state;
      var meta;
      if (sm.activeProgram) {
        state = sm.activeProgram.state;
        meta = state.meta;
        if (!sm.conf.paused ) {
          sm.ctx.translate(sm.canvas.width / 2, sm.canvas.height / 2);
          sm.activeProgram.update(sm.time.delta);
          sm.ctx.translate(-sm.canvas.width / 2, -sm.canvas.height / 2);
        } else {
          sm.gfx.setFillColor(Color.green);
          sm.gfx.text(true, 'SM-PAUSED', 0, 0);
        }
      }
      sm.gfx.postDraw();
      sm.ctx.translate(sm.canvas.width / 2, sm.canvas.height / 2 );

      // Render Log
      if (!sm.activeProgram || (sm.conf.debug.logConsole.logInProgram && sm.conf.debug.active)) {
        if (sm.activeProgram) {
					sm.gfx.setFillColor(sm.conf.debug.logConsole.color);
				} else {
					sm.gfx.setFillColor(Color.white);
        }
        var viewPortW = sm.canvas.width;
        var viewPortH = sm.canvas.height;
        var padding = sm.conf.debug.logConsole.padding;
        var offsetW = viewPortW * padding;
        var offsetH = viewPortH * padding;
        sm.gfx.setTextConf(sm.conf.debug.logConsole.textConf);
        sm.logs.reverse();
        sm.gfx.text(
            sm.logs,
            (-viewPortW / 2) + offsetW,
            ((viewPortH / 2) - offsetH * 2)
        );
        sm.logs.reverse();
      }

      // Render FPS & Title
      if (sm.conf.debug.active) {
        if (sm.activeProgram) {
          sm.gfx.setTextConf(sm.conf.debug.logConsole.textConf);
          sm.gfx.text(meta.name, sm.canvas.width / 2.75, sm.canvas.height / 2.2);
          sm.gfx.text(sm.utils.formatters.float_two_pt(sm.time.frameRate),
              sm.canvas.width / 2.75,
              sm.canvas.height / 2.45
          );
        }
      }

      // Reset State and Input
      sm.ctx.translate(-sm.canvas.width / 2, -sm.canvas.height / 2 );
      sm.checkIfMobile();

      if (!sm.breakOnNextLoop) {
        window.requestAnimationFrame(sm.appLoop);
      } else {
        sm.breakOnNextLoop = false;
        sm.unloadProgram();
        console.log('Logs can be found at sm.logs.');
        sm.ctx.save();
        sm.ctx.fillStyle = '#000000';
        sm.ctx.fillRect(0, 0, sm.canvas.width, sm.canvas.height);
      }
    }
  };
})();

