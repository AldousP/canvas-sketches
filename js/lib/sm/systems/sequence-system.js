'use strict';

var SequenceType = {
  NORMAL: 0,
  PING_PONG: 1,
  REVERSED: 2
};



function SequenceSystem(sequenceActions) {
	this.name = 'sequencing';

	this.sequenceActions = sequenceActions;
	
	this.pre = function () {

	};

	this.processEntity = function (entity, state, delta, entities) {
    var seq = smx.sequence(entity);
    if (seq) {
      var that = this;
      seq.forEach(function (sequence, i) {
          var newPosition = 0;
          var current = sequence.length * sequence.pos;
          newPosition = (current + delta) / sequence.length;

          if (newPosition > 1) {
            switch (sequence.type) {
              case SequenceType.NORMAL:
                newPosition -= 1;
            }
          }

          that.actions.updateSequence(entity, i, newPosition);
          if (that.sequenceActions[sequence.name]) {
            that.sequenceActions[sequence.name].update(entity, newPosition)
          }
      });
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
