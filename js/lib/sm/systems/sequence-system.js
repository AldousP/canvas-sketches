'use strict';

function SequenceSystem(ID) {
	this.ID = ID;
	this.name = 'Sequencing';
	
	this.pre = function () {

	};

	this.processEntity = function (entity, state, delta, entities) {
    var seq = smx.sequence(entity);

    if (seq) {
      console.log(seq);
    }
	};

	this.post = function () {

	};

	this.handlers = {

  };

  this.actions = {

	};
}
