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

  window.loadCameraTests = function () {
    sm.loadProgram(new CameraTests());
  };

  sm.init("canvas", new CameraTests());

  // var mountPoint = document.getElementById('canvas');
  // var ctx = mountPoint.getContext('2d');
  //
  // ctx.scale(.75, .75);
  // ctx.strokeStyle = 'white';
  // ctx.strokeWidth = 10;
  //
  //
  //
  // ctx.beginPath();
  // ctx.moveTo(0, -9999);
  // ctx.lineTo(0, 9999);
  // ctx.closePath();
  // ctx.stroke();
  //
  // ctx.beginPath();
  // ctx.moveTo(-9999, 0);
  // ctx.lineTo(9999, 0);
  // ctx.closePath();
  // ctx.stroke();
  //
  // ctx.translate(64, 64);
  // ctx.fillStyle = 'white';
  // ctx.rect(0, 0, 256, 256);
  // ctx.clip();
  // ctx.stroke();
  // ctx.translate(-64, -64);
  //
  // ctx.translate(54, 72);
  // ctx.strokeStyle = Color.pink;
  // ctx.strokeRect(0, 0, 128, 128);
  // ctx.translate(-54, -72);
}());

