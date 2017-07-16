(function () {
  'use strict';
  var fullscreenButtons = document.getElementsByClassName('fullscreen-toggle');
  var appTitle = document.getElementById('app-title');

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
    for (var i = 0; i < fullscreenButtons.length; i++) {
      fullscreenButtons[i].onclick = function (e) {
        document.body.classList.toggle('full-screen');
        for (var j = 0; j < fullscreenButtons.length; j++) {
          fullscreenButtons[j].classList.add('active');
        }
        window.setTimeout(function () {
          for (var i = 0; i < fullscreenButtons.length; i++) {
            fullscreenButtons[i].classList.remove('active');
          }
        }, 100);
      }
    }

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
          // sm.input.fire('up');
          break;
        case Keys.DOWN :
          // sm.input.fire('left');
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
    appTitle.innerText = event.detail.programName;
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

  sm.init('canvas');
  loadNesting();
}());

