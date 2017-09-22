function BreakoutSystem(ball_speed, board_width, board_height) {
  this.name = 'breakout_system';
  this.active = true;
  this.ball_speed = ball_speed;
  this.board_width = board_width;
  this.board_height = board_height;
  this.ballID = -1;

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
    ball_tile: {
      type: 'BALL_TILE',
      handle: function (data, target, delta, mapper, fire) {
        var vel = EX.vel(target);
        var pos = EX.transPos(target);
        SVec.setVec(vel, vel.x, -vel.y);
        var tile = mapper.store[data.collider];
        // console.log(tile);
        mapper.deleteEntity(tile.ID);
      }
    },
    ball_top: {
      type: 'BALL_GUTTER_TOP',
      handle: function (data, target, delta, mapper, fire) {
        var vel = EX.vel(target);
        var pos = EX.transPos(target);
        SVec.setVec(vel, vel.x, -vel.y);
        SVec.setVec(pos, pos.x, pos.y - 4);
      }
   },
    ball_bottom: {
      type: 'BALL_GUTTER_BOTTOM',
      handle: function (data, target, delta, mapper, fire) {
        var vel = EX.vel(target);
        var pos = EX.transPos(target);
        SVec.setVec(vel, vel.x, -vel.y);
        SVec.setVec(pos, pos.x, pos.y + 4);
      }
    },
    ball_left: {
      type: 'BALL_GUTTER_LEFT',
      handle: function (data, target, delta, mapper, fire) {
        var vel = EX.vel(target);
        var pos = EX.transPos(target);
        SVec.setVec(vel, -vel.x, vel.y);
        SVec.setVec(pos, pos.x + 4, pos.y);
      }
    },
    ball_right: {
      type: 'BALL_GUTTER_RIGHT',
      handle: function (data, target, delta, mapper, fire) {
        var vel = EX.vel(target);
        var pos = EX.transPos(target);
        SVec.setVec(vel, -vel.x, vel.y);
        SVec.setVec(pos, pos.x - 4, pos.y);
      }
    },
    ball_paddle: {
      type: 'BALL_PADDLE',
      handle: function (data, target, delta, mapper, fire) {
        var vel = EX.vel(target);
        var pos = EX.transPos(target);
        var paddle_pos = EX.transPos(mapper.store[data.collider]);
        SVec.setVec(vel, vel.x, -vel.y);
        SVec.setVec(pos, pos.x, pos.y + 4);
        var ball_wiggle = Math.PI / 16;
        SVec.rotVec(vel, SMath.rand(-ball_wiggle, ball_wiggle))
      }
    }
  };
}