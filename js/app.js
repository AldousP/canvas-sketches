(function () {
  "use strict";
  var fullscreenButtons = document.getElementsByClassName("fullscreen-toggle");
  var appTitle = document.getElementById("app-title");

  attachHandlers();
  function attachHandlers() {
    for (var i = 0; i < fullscreenButtons.length; i++) {
      fullscreenButtons[i].onclick = function (e) {
        document.body.classList.toggle("full-screen");
        for (var j = 0; j < fullscreenButtons.length; j++) {
          fullscreenButtons[j].classList.add("active");
        }
        window.setTimeout(function () {
          for (var i = 0; i < fullscreenButtons.length; i++) {
            fullscreenButtons[i].classList.remove("active");
          }
        }, 100);
      }
    }
  }

  document.body.addEventListener("smProgramLoaded", function (event) {
    appTitle.innerText = event.detail.programName;
  });

  document.body.addEventListener("smProgramUnloaded", function (event) {
    appTitle.innerText = "No Program Loaded";
  });

  window.loadMountExample = function () {
    sm.loadProgram(new MountExample());
  }

  window.loadCameraTests = function () {
    sm.loadProgram(new CameraTests());
  };

  sm.init("canvas", new CameraTests());
  // sm.init("canvas");
  //
  // var mountPoint = document.getElementById('canvas');
  // var ctx = mountPoint.getContext('2d');
  // var drawRect = function (x, y, w, h, rotation, fill) {
  //   ctx.save();
  //   ctx.fillStyle = 'white';
  //   ctx.translate(x + (w / 2), y + (h / 2));
  //   ctx.rotate(rotation / DEG_RAD);
  //   if (fill) {
  //     ctx.fillRect(-(w / 2), -(h / 2), w, h);
  //   } else {
  //     ctx.strokeRect(-(w / 2), -(h / 2), w, h);
  //   }
  //   ctx.restore();
  // };
  //
  //
  // ctx.translate(mountPoint.width / 2, mountPoint.height / 2);
  // ctx.scale(.75, .75);
  // ctx.strokeStyle = 'white';
  // ctx.strokeWidth = 10;
  // ctx.beginPath();
  // ctx.moveTo(0, -9999);
  // ctx.lineTo(0, 9999);
  // ctx.closePath();
  // ctx.stroke();
  // ctx.beginPath();
  // ctx.moveTo(-9999, 0);
  // ctx.lineTo(9999, 0);
  // ctx.closePath();
  // ctx.stroke();
  // drawRect(16, 16, 128, 128, 45);
}());

