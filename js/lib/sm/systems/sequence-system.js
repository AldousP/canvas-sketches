'use strict';

function SequenceSystem() {
	this.name = 'sequencing';
	
	this.pre = function () {

	};

	this.processEntity = function (entity, state, delta, entities) {
    var seq = smx.sequence(entity);

    if (seq) {
      var that = this;
      seq.forEach(function (sequence, i) {
        if (!sequence.dir) {
          sequence.dir = 1;
        }
        var newPosition = (sequence.pos * sequence.length + (delta * sequence.dir)) / sequence.length;
        if (newPosition < 0 || newPosition > 1) {
          newPosition = sequence.dir < 0 ? 0 : 1;
          sequence.dir = -1 * (sequence.dir);
          that.fireEvent(sequence.onComplete);
        }
        that.actions.updateSequence(entity, i, newPosition);
      })
    }
	};

	this.post = function () {

	};

	this.handlers = {

  };

  this.actions = {
    updateSequence: function (entity, index, position) {
      var seq = smx.sequence(entity)[index];
      seq.pos = position;
    }
	};
}
