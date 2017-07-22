'use strict';

function PathSystem(ID) {
	this.ID = ID;
	this.name = 'Path';
	
	this.pre = function () {

	};

	this.processEntity = function (entity, state, delta, entities) {
    var path = smx.path(entity);
    var seq = smx.sequence(entity);

    if (path && seq) {
      var ptCt = path.pts.length;
      var alpha = seq.pos;
      var pathIndexA = Math.floor(ptCt * alpha);
      var pathIndexB = pathIndexA + 1;

      if (pathIndexB > ptCt) {
        pathIndexB = pathIndexA - 1;
      }

      if (pathIndexB < 0) {
        pathIndexB = 0;
      }

      var ptA = path.pts[pathIndexA];
      var ptB = path.pts[pathIndexB];
      if (ptB && ptA) {
        var lerp = lerpVec(ptA, ptB, alpha);
        this.actions.updatePath(entity, new Vector(lerp.x, lerp.y))
      }
    }
	};

	this.post = function () {

	};

	this.handlers = {

  };

  this.actions = {
    updatePath: function (entity, pos) {
      var path = smx.path(entity);
      path.pos = pos;
    }
	};
}
