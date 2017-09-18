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

  sm.init('canvas');
  sm.loadV2Program(new CollisionDetection());
}());