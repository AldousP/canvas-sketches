"use strict";

function drawPolygon(polygon, pos) {

}

function copyState() {
  storedState = JSON.stringify(entityHandler.entities);
}

function restoreState() {
  entityHandler.entities = JSON.parse(storedState);
}
