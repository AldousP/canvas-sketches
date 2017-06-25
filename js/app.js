"use strict";

var systemList = document.getElementById("systems-list");
var entityList = document.getElementById("entities-list");

var fullscreenButtons = document.getElementsByClassName("fullscreen-toggle");
var listItemTemplate = document.getElementById("list-item-template");
var entityListItemTemplate = document.getElementById("entity-list-item-template");

attachHandlers();

/* Render the UI lists in the DOM */
function renderLists() {
  systemList.innerHTML = '';
  entityList.innerHTML = '';
  systemHandler.systems.forEach(function (system) {
    var newEntry = listItemTemplate.cloneNode(true);
    newEntry.removeAttribute("id");
    newEntry.childNodes[1].innerHTML = system.name;
    var button = newEntry.getElementsByTagName('button')[0];
	button.setAttribute( "onclick", "javascript: pauseSystem('" + system.ID + "');");
	if (system.paused) {
	  newEntry.getElementsByTagName('button')[0].classList.add('active');
	}
	systemList.appendChild(newEntry);
  });

  var keys = Object.keys(entityHandler.entities);
  keys.forEach(function (key) {
    var entity = entityHandler.entities[key];
	var newEntry = entityListItemTemplate.cloneNode(true);
	newEntry.removeAttribute("id");
    newEntry.childNodes[1].innerHTML = entity.name ? entity.name : entity.ID;
    var button = newEntry.getElementsByTagName('button')[0];
    button.setAttribute( "onclick", "javascript: logEntity('" + entity.ID + "');");
	entityList.appendChild(newEntry);
  });
}

/* Click handlers for list entities */
function pauseSystem(ID) {
  systemHandler.systems.forEach(function (system) {
    if (system.ID === ID) {
      system.paused = !system.paused;
      renderLists();
	}
  })
}

function logEntity(entityID) {
  console.log(entityHandler.entities[entityID]);
}

function resetSim() {
  vibrate();
  restoreState();
  for (var i = 0; i < resetButtons.length; i++) {
	resetButtons[i].classList.add('active');
  }

  window.setTimeout(function () {
	for (var i = 0; i < resetButtons.length; i++) {
	  resetButtons[i].classList.remove('active');
	}
  }, 100);
}

function togglePause() {
  paused = !paused;
  vibrate();
  for (var i = 0; i < pauseButtons.length; i++) {
	if (paused) {
	  pauseButtons[i].classList.add("active");
	} else {
	  pauseButtons[i].classList.remove("active");
	}
  }
}

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
}

sm.init('canvas', new programs.mountExample());



