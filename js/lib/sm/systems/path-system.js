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
      var alpha = seq.pos;
      var ptLen = path.pts.length;
      var adjAlpha = alpha * ptLen;
      var ptA = path.pts[0];
      var ptB = path.pts[1];
      var subDiv = 1 / ptLen;
      var rawIndex = Math.floor(adjAlpha);
      var adjIndex = 0;

      for (var i = 0; i < ptLen; i ++) {

      }

      if (ptA && ptB) {
        var result = lerpVec(ptA, ptB, alpha);
        // this.actions.updatePath(entity, new Vector(result.x, result.y));
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
