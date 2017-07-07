(function () {
  "use strict";
  var fullscreenButtons = document.getElementsByClassName("fullscreen-toggle");
  var listItemTemplate = document.getElementById("list-item-template");
  var entityListItemTemplate = document.getElementById("entity-list-item-template");
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

  function loadMountExample() {
    sm.loadProgram(new MountExample());
  }

  window.loadCameraTests = function () {
    sm.loadProgram(new CameraTests());
  };

  sm.init("canvas", new CameraTests());
}());

