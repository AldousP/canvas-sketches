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
      // console.log(Math.floor(ptCt * alpha));
    }
	};

	this.post = function () {

	};

	this.handlers = {

  };

  this.actions = {
    updateSequence: function (entity, position) {
      var seq = smx.sequence(entity);
      seq.position = position;
    }
	};
}
