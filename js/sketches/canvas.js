"use strict";

var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
var last = new Date().getTime();
var current = new Date().getTime();
var delta;
var frameRate;
var frameHistory = [];
var historyCap = 30;

var worldCam = new Camera();
var padding = .95;
var view;
var backgroundColor = "#545454";

var entityHandler = new EntityHandler();
var systemHandler = new SystemHandler();

var storedState = {};

var paused = false;

var ComponentType = {
  polygon : "poly",
  position : "pos",
  tagged : "tags",
  velocity : "vel",
  acceleration : "accl"
};

setup();

function copyState() {
  storedState = entityHandler.entities;
}

function copyObject(obj) {
  var newObj = {};

}

function restoreState() {
  entityHandler.entities = storedState;
  console.log("State Restored");
  console.log("Prior State:");
  console.log(entityHandler.entities);
  console.log("Current State:");
  console.log(storedState);
}

function setup() {
  window.requestAnimationFrame(renderLoop);
  view = new View(canvas.width * padding, canvas.height * padding);
  view.worldWidth = 3;
  view.worldHeight = 3;

  var sampleEntity = new Entity();
  sampleEntity.addComponent(new PolygonComponent(generatePolygon(8, .25)));
  sampleEntity.addComponent(new PositionComponent());
  sampleEntity.addComponent(new VelocityComponent(0, -.25));
  entityHandler.addEntity(sampleEntity);

  systemHandler.addSystem(new PhysicsSystem("A"));
  systemHandler.addSystem(new RenderingSystem("B"));
  copyState();
}

function renderLoop() {
  // Blank out screen
  ctx.fillStyle = "#000000";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  update();
  window.requestAnimationFrame(renderLoop);
}

function update() {
  current = new Date().getTime();
  delta = (current - last) / 1000;
  ctx.save();
  ctx.translate(canvas.width / 2, canvas.height / 2);
  updateFrameCount();
  systemHandler.updateSystems(delta, entityHandler);
  ctx.restore();
}

function PhysicsSystem(ID) {
  this.ID = ID;
  this.name = "Physics";
  this.componentFilter = [
    ComponentType.position,
    ComponentType.velocity
  ];

  this.pre = function () {

  };

  this.processEntity = function (entity) {
    if (!paused) {
	  var vel = entity.components[ComponentType.velocity].velocity;
	  entity.components[ComponentType.position].position
		  .addVec(vel.copy().scl(delta));
    }
  };

  this.post = function () {

  }
}

function RenderingSystem(ID) {
  this.ID = ID;
  this.name = "Rendering";
  this.componentFilter = [
    ComponentType.polygon,
    ComponentType.position
  ];

  this.pre = function () {
    ctx.save();
    ctx.strokeStyle = "#FFFFFF";
    ctx.lineWidth = ".025";
    ctx.beginPath();
    ctx.rect(
        view.canvPos.x - view.canvWidth / 2,
        view.canvPos.y - view.canvHeight / 2,
        view.canvWidth,
        view.canvHeight);
    ctx.stroke();
    ctx.fillStyle = backgroundColor;
    ctx.fill();
    ctx.clip();
  };

  this.processEntity = function (entity) {
    ctx.strokeStyle = "#FFFFFF";
    view.renderPoly(
        entity.components[ComponentType.polygon].polygon,
        entity.components[ComponentType.position].position,
        worldCam
    );
    ctx.stroke();
  };

  this.post = function () {
    ctx.restore();
  };
}

function updateFrameCount() {
  frameRate = (1000 / delta) / 1000;
  last = current;
  frameHistory.push(frameRate);
  if (frameHistory.length > historyCap) {
    frameHistory.splice(0, 1);
  }

  var avg = 0;
  for (var i = 0; i < frameHistory.length; i++) {
    avg += frameHistory[i];
  }
  avg /= frameHistory.length;
  frameRate = avg;
}

function drawPolygon(polygon, pos) {
  ctx.beginPath();
  if (!polygon.pts) {
    console.error('No property of name [pts] found on polygon parameter.');
  } else {
    var firstPt = polygon.pts[0];
    ctx.moveTo(firstPt.x + pos.x, firstPt.y + pos.y);
    polygon.pts.forEach(function (pt) {
      if (pt !== firstPt) {
        ctx.lineTo(pt.x + pos.x, pt.y + pos.y);
      }
    });
    ctx.lineTo(firstPt.x + pos.x, firstPt.y + pos.y);
  }
}

/**
 * Generate a new Polygon
 * @param vertCount
 * @param radius
 * @param startingDegree
 */
function generatePolygon(vertCount, radius, startingDegree) {
  startingDegree = startingDegree ? startingDegree : 0;
  var circDiv = (2 * Math.PI)  / vertCount;
  var polygon = new Polygon();
  for (var i = 0; i < vertCount; i++ ) {
    polygon.pts.push(
        new Vector (
            Math.cos(startingDegree + circDiv * i) * radius,
            Math.sin(startingDegree + circDiv * i) * radius
        )
    )
  }
  return polygon;
}

// Geometry Classes
function Polygon() {
  this.pts = [];
}

// Simulation classes
function Entity() {
  this.components = {};

  this.addComponent = function (component) {
    if (component.name && !this.components[component.name]) {
      this.components[component.name] = component;
    }
  }
}

function PositionComponent() {
  this.name = ComponentType.position;
  this.position = new Vector();
}

function PolygonComponent(polygon) {
  this.name = ComponentType.polygon;
  this.polygon = polygon;
}

function VelocityComponent(x, y) {
  this.name = ComponentType.velocity;
  this.velocity = new Vector(x, y);
}

function AccelerationComponent() {
  this.name = ComponentType.acceleration;
  this.acceleration = new Vector();
}

function EntityHandler() {
  var entityCount = 0;
  this.entities = {};

  this.entityMap = {

  };

  this.addEntity = function (entity) {
    entity.ID = hashForInt(entityCount);
    entityCount ++;
    this.entities[entity.ID] = entity;
    var that = this;
    var keys = Object.keys(entity.components);

    keys.forEach(function (key) {
      that.mapEntity(entity.components[key].name, entity)
    });
	renderLists();
	return entity.ID;
  };

  this.mapEntity = function (componentName, entity) {
    if (this.entityMap[componentName]) {
      if (this.entityMap[componentName].indexOf(entity.ID) < 0) {
        this.entityMap[componentName].push(entity.ID);
      }
    } else {
      this.entityMap[componentName] = [];
      if (this.entityMap[componentName].indexOf(entity.ID) < 0) {
        this.entityMap[componentName].push(entity.ID);
      }
    }
  };

  this.injectComponent = function (entity, component) {
    if (this.entities[entity.ID]) {
      this.mapEntity(component.name, entity);
    }
    entity.components[component.name] = component;
	renderLists();
  };

  this.removeEntity = function (ID) {
    delete this.entities[ID];
	renderLists();
  };
}

function SystemHandler() {
  this.systems = [];

  this.sortSystems = function () {
    this.systems.sort(function (a, b) {
      return a.ID.localeCompare(b.ID);
    });
	renderLists();
  };

  this.updateSystems = function (delta, entityHandler) {
	this.systems.forEach(function (system) {
	  if (system.paused) {
	    return;
      }
      var filters = system.componentFilter;
      if (filters) {
        var sets = {};
        for (var i = 0; i < filters.length; i++) {
          var filter = filters[i];
          var set = entityHandler.entityMap[filter];
          if (set) {
            sets[filter] = set;
          } else {
            break;
          }
        }

        var setsKeys = Object.keys(sets);
        if (setsKeys.length) {
          setsKeys.sort(function (a, b) {
            return sets[a].length < sets[b].length;
          });

          var rootList = sets[setsKeys[0]];
          var finalEntities = [];
          rootList.forEach(function (value) {
            var valuePresent = false;
            for (var j = 1; j < setsKeys.length; j++) {
              var comparisonSet = sets[setsKeys[j]];
              valuePresent = comparisonSet.indexOf(value) > -1;
              if (j < 1 && !valuePresent) {
                break;
              }
            }

            if (valuePresent) {
              finalEntities.push(value);
            }
          });
          system.pre();
          finalEntities.forEach (function (entity) {
            system.processEntity(entityHandler.entities[entity]);
          });
          system.post();
        }
      } else {
        var keys = Object.keys(entityHandler.entities);
        system.pre();
        keys.forEach(function (key) {
          system.processEntity(entityHandler.entities[key]);
        });
        system.post();
      }
    })
  };

  this.addSystem = function (system) {
    renderLists();
    this.systems.push(system);
    this.sortSystems();
  }
}

function System(ID) {
  this.ID = ID;
  this.name = "";

  this.componentFilter = [

  ];

  this.pre = function () {
    
  };
  
  this.processEntity = function (entity) {

  };
  
  this.post = function () {
    
  };
}

function View(canvWidth, canvHeight) {
  this.canvPos = new Vector(0 , 0);
  this.worldWidth = 1;
  this.worldHeight = 1;
  this.canvWidth = canvWidth;
  this.canvHeight = canvHeight;

  this.renderPoly = function (poly, pos, cam) {
    var viewAspectRatio = this.canvHeight / this.canvWidth;
    var canvasAspectRatio = canvas.height / canvas.width;

    var hDiff = this.canvWidth / canvas.width;
    var vDiff = this.canvHeight / canvas.height;

    var canHDiff = canvas.width/ this.worldWidth;
    var canVDiff = canvas.height / this.worldHeight;

    ctx.setTransform(
        hDiff * canHDiff,
        0,
        0,
        vDiff * canVDiff,
        canvas.width / 2 + this.canvPos.x,
        canvas.height / 2 + this.canvPos.y
    );
    var worldFlip = pos.copy();
    worldFlip.y = -worldFlip.y;
    drawPolygon(poly, worldFlip);
  }
}


function Camera() {
  this.position = new Vector(0, 0);
  this.width = 1;
  this.height = 1;
  this.zoom = 1;
}

function Vector(x, y) {
  this.x = x ? x : 0;
  this.y = y ? y : 0;
  this.len = Math.sqrt((x * x) + (y * y));

  this.set = function (x, y) {
    this.x = x;
    this.y = y;
    this.len = Math.sqrt((x * x) + (y * y));
    return this;
  };

  this.add = function (x, y) {
    this.x += x;
    this.y += y;
    this.len = Math.sqrt((x * x) + (y * y));
    return this;
  };

  this.addVec = function (vector) {
    this.x += vector.x;
    this.y += vector.y;
    this.len = Math.sqrt((x * x) + (y * y));
    return this;
  };

  this.copy = function () {
    return new Vector(this.x, this.y);
  };
  
  this.scl = function (scalar) {
    this.x *= scalar;
    this.y *= scalar;
    this.len = Math.sqrt((x * x) + (y * y));
    return this;
  };
}


function hashForInt(integer) {
  integer = integer * 10 + 100;
  return '' +
      Math.floor(
          Math.abs(integer - integer / 2) +
          Math.abs(integer - integer / 3) +
          Math.abs(integer - integer / 4) +
          Math.abs(integer - integer / 5)
      )
}


