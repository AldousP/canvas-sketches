'use strict';

function SequenceSystem(ID) {
	this.ID = ID;
	this.name = 'Sequencing';
	
	this.pre = function () {

	};

	this.processEntity = function (entity, state, delta, entities) {
    var seq = smx.sequence(entity);

    if (seq) {
      var newPosition = (seq.pos * seq.length + (delta * seq.dir)) / seq.length;
      if (newPosition < 0 || newPosition > 1) {
        newPosition = seq.dir < 0 ? 0 : 1;
        seq.dir = -1 * (seq.dir);
      }
      this.actions.updateSequence(entity, newPosition);
    }
	};

	this.post = function () {

	};

	this.handlers = {

  };

  this.actions = {
    updateSequence: function (entity, position) {
      var seq = smx.sequence(entity);
      seq.pos = position;
    }
	};
}
