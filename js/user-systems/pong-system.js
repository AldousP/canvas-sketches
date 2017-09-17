function PongSystem() {
  this.name = 'pong_system';
  this.active = true;
  this.paddle_y_axis_length = 256;

  var playerID, ballID, AIPaddleID;

  // Defines which entities will be passed into the process function.
  this.filter = [
    ComponentType.gameplay
  ];

  this.setup = function () {

  };

  this.process = function (entities, fire, delta, mapper) {
    // var balls = mapper.getEntitiesForTag('ball');
    // var ball = mapper.store[balls[0]];
    // var ball_pos = ball.components[ComponentType.transform].position;
    //
    // var player = mapper.store[mapper.getEntitiesForTag('player')];
    // var player_pos = player.components[ComponentType.transform].position;
    //
    // playerID = player.ID;
    // ballID = ball.ID;
    //
    // SVec.setVecVec(player_pos, sm.input.state.cursor);
    // entities.forEach(function (entity) {
	  	//
    // });
  };

  this.listeners = {
    EntityCollision: {
      type: EventTypes.ENTITY_COLLISION,
      handle: function (data, target, delta) {
        if (target.ID === playerID) {

        }
      }
    }
  };
}