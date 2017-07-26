(function () {
  'use strict';
  var appTitle = document.getElementById('app-title');
  var appDescription = document.getElementById('app-description');

  var Keys = {
    W : 87,
    A : 65,
    S : 83,
    D : 68,
    UP : 38,
    DOWN: 40,
    LEFT : 37,
    RIGHT : 39,
    ESC: 27
  };

  attachHandlers();
  function attachHandlers() {
    document.body.onkeydown = function (e) {
      var key = e.keyCode;
      switch (key) {
        case Keys.ESC :
          sm.toggleDebug();
          break;
        case Keys.W :
          sm.input.fire('up');
          break;
        case Keys.A :
          sm.input.fire('left');
          break;
        case Keys.S :
          sm.input.fire('down');
          break;
        case Keys.D :
          sm.input.fire('right');
          break;

        case Keys.UP :
          break;
        case Keys.DOWN :
          break;
        case Keys.LEFT :
          sm.input.fire('left_bump');
          break;
        case Keys.RIGHT :
          sm.input.fire('right_bump');
          break;
      }
    }
  }

  document.body.addEventListener('smProgramLoaded', function (event) {
    appTitle.innerText = event.detail.name;
    appDescription.innerText = event.detail.description;
  });

  document.body.addEventListener('smProgramUnloaded', function () {
    appTitle.innerText = 'No Program Loaded';
  });

  window.loadNesting = function () {
    sm.loadProgram(new Nesting());
  };

  window.loadClipping = function () {
    sm.loadProgram(new Clipping());
  };

  window.loadCameras = function () {
    sm.loadProgram(new Cameras());
  };

  window.loadTextTests = function () {
    sm.loadProgram(new TextTests());
  };

  window.loadAnimation = function () {
    sm.loadProgram(new Animation());
  };

  sm.init('canvas');

  loadAnimation();
}());

