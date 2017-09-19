function BreakoutSystem(ball_speed, board_width, board_height) {
  this.name = 'breakout_system';
  this.active = true;
  this.ball_speed = ball_speed;
  this.board_width = board_width;
  this.board_height = board_height;

  this.filter = [
    ComponentType.gameplay
  ];

  this.setup = function () {

  };

  this.process = function (entities, fire, delta, mapper) {
    var player = mapper.store[mapper.getEntitiesForTag('player')];
    var player_pos = player.components[ComponentType.transform].position;

    var range = this.board_width / 2;
    SVec.setVec(player_pos, SMath.clamp(sm.input.state.cursor.x, -range, range), player_pos.y);
  };

  this.listeners = {
    EntityCollision: {
      type: 'not_used',
      handle: function (data, target, delta, mapper, fire) {
        console.log('!');

        // if (data.collider === ballID) {
        // }
      }
    }
  };
}