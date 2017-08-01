(function () {
  'use strict';
  var appTitle = document.getElementById('app-title');
  var appDescription = document.getElementById('app-description');

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

  window.loadStateMachines = function () {
    sm.loadProgram(new StateMachines());
  };

  window.loadInputTests = function () {
    sm.loadProgram(new InputDemos());
  };

  window.loadSequences= function () {
    sm.loadProgram(new Sequences());
  };

  window.loadFSMAnimations= function () {
    sm.loadProgram(new FSMAnimations());
  };

  sm.init('canvas');

  loadFSMAnimations();
}());