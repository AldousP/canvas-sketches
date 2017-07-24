'use strict';

function MovementSystem(ID) {
	this.ID = ID;
	this.name = 'movement';

	this.pre = function () {
	};

	this.processEntity = function (entity, state, delta, entities) {
    var rotMod = smx.movRot(entity);
    var rotVec = smx.movVec(entity);

    if (rotMod) {
      this.act('rotate', entity.ID, { amt: rotMod });
    }

    if (rotVec && rotVec.len) {
      this.act('move', entity.ID, { amt: sclVec(cpyVec(rotVec), delta) });
    }
	};

	this.post = function () {

	};

	this.listeners = {
	  programStarted: function (payload) {
	    console.log('!');
      console.log(payload);
    },
	  moveEntity : function ( event ) {
    }
  };

  this.actions = {
    /**
     * @payload:
     *   @vector amt: The amount the position of the entity will change by.
     */
    move : {
      components: [ComponentType.position],
      method: function ( components, payload ) {
        var pos = components[ComponentType.position];
        if (pos) {
          addVecVec(pos.position, payload.amt);
        }
      }
    },

    /**
     * @payload:
     *   @float amt: The amount the rotation of the entity will change by in degrees.
     */
    rotate : {
      components: [ComponentType.rotation],
      method: function ( components, payload ) {
        var rot = components[ComponentType.rotation];
        if (rot) {
          rot.rotation += payload.amt;
        }
      }
    }
	};
}
