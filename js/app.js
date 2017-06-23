"use strict";

var systemList = document.getElementById("systems-list");
var entityList = document.getElementById("entities-list");
var pauseButtons = document.getElementsByClassName("pause-sim");
var resetButtons = document.getElementsByClassName("reset-sim");
var listItemTemplate = document.getElementById("list-item-template");
var entityListItemTemplate = document.getElementById("entity-list-item-template");

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
	newEntry.childNodes[1].innerHTML = entity.ID;
	entityList.appendChild(newEntry);
  });
}

function pauseSystem(ID) {
  systemHandler.systems.forEach(function (system) {
    if (system.ID === ID) {
      system.paused = !system.paused;
      renderLists();
	}
  })
}

function toggleFullScreen() {
  
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

for (var i = 0; i < resetButtons.length; i++) {
  resetButtons[i].onclick = resetSim;
}

for (i = 0; i < pauseButtons.length; i++) {
  pauseButtons[i].onclick = togglePause;
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

function vibrate() {
  // navigator.vibrate([50, 30, 10]);  paused = !paused;
}




