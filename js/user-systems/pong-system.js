function PongSystem () {
	this.name = 'pong_system';
	this.active = true;
  this.paddle_y_axis_length = 256;

	// Defines which entities will be passed into the process function.
	this.filter = [
	  ComponentType.gameplay
	];

	this.setup = function () {
    
  };
	
	this.process = function (entities, fire, delta, mapper) {
	  var balls = mapper.getEntitiesForTag('ball');
	  var ball = mapper.store[balls[0]];
    var ball_pos = ball.components[ComponentType.transform].position;

    var player = mapper.store[mapper.getEntitiesForTag('player')];
    var player_pos = player.components[ComponentType.transform].position;

    SVec.setVecVec(player_pos, sm.input.state.cursor);
	  entities.forEach(function (entity) {

    });
	};
}