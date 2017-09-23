function BreakoutSystem(ball_speed, board_width, board_height) {
  this.name = 'breakout_system';
  this.active = true;
  this.ball_speed = ball_speed;
  this.board_width = board_width;
  this.board_height = board_height;
  this.gameStateID;
  this.ballID;
  this.lastPaddleX = 0;

  this.collision_notes = [

  ];

  this.filter = [
    ComponentType.gameState
  ];

  this.setup = function () {

  };

  this.process = function (entities, fire, delta, mapper) {
    var player = mapper.store[mapper.getEntitiesForTag('player')];
    var player_pos = player.components[ComponentType.transform].position;
    var range = this.board_width / 2;
    var text_pane = mapper.store[mapper.getEntitiesForTag('score_pane')[0]];

    if (!this.ballID) {
      this.ballID = mapper.store[mapper.getEntitiesForTag('ball')].ID;
    }

    if (!this.gameStateID) {
      this.gameStateID = mapper.store[mapper.getEntitiesForTag('game_state')].ID;
    }

    var state = EX.state(mapper.store[this.gameStateID]);

    if (!state.game_over) {
      // Set Paddle Pos
      SVec.setVec(player_pos, SMath.clamp(sm.input.state.cursor.x, -range, range), player_pos.y);
      // Set Score
      text_pane.components[ComponentType.text].strings = [state.score];

      if (Math.abs(player_pos.x -  this.lastPaddleX) > 4) {
        SVec.setVec(EX.renderableVec(player).vector, - (player_pos.x - this.lastPaddleX) * 128, 0);
      }
      this.lastPaddleX = player_pos.x;

      SVec.setMag(EX.renderableVec(player).vector, (EX.renderableVec(player).vector.len * (0.85 * delta)));
    }
  };
  
  this.ballHitFloor = function (ball, mapper) {
    EX.renderable(ball).disabled = true;
    var game_state = mapper.store[mapper.getEntitiesForTag('game_state')];
    var state = EX.state(game_state);
    SVec.setVec(EX.transPos(ball), 0, -64);
    SVec.setVec(EX.vel(ball), 0, 0);

    // Remove ball from state and UI
    var panel = mapper.store[mapper.getEntitiesForTag('ball_indicator')[0]];
    state.balls--;

    if (state.balls >= 0) {
      EX.renderable(mapper.store[panel.children[state.balls]]).disabled = true;
    }

    if (state.balls < 0) {
      this.gameOver(mapper);
    } else {
      // Reveal the ball after 2 seconds
      setTimeout(function () {
        EX.renderable(ball).disabled = false;
      }, 2000);

      // Pick a new speed for the ball and serve it
      setTimeout(function () {
        var new_vel = new SVec.Vector(0, -that.ball_speed);
        SVec.rotVec(new_vel, SMath.rand(-Math.PI / 3, Math.PI / 3));
        SVec.setVecVec(EX.vel(ball), new_vel);
      }, 3000);
    }
  };
  
  this.gameOver = function (mapper) {
    var game_state = mapper.store[mapper.getEntitiesForTag('game_state')];
    var state = EX.state(game_state);
    state.game_over = true;
  };

  var that = this;
  this.listeners = {
    ball_tile: {
      type: 'BALL_TILE',
      handle: function (data, target, delta, mapper, fire) {
        var vel = EX.vel(target);
        SVec.setVec(vel, vel.x, -vel.y);
        var tile = mapper.store[data.collider];
        EX.col(tile).active = false;
        mapper.queueForDeletion(tile.ID);
        mapper.store[that.gameStateID].components[ComponentType.gameState].gameState.score += 1;
      }
    },
    ball_top: {
      type: 'BALL_GUTTER_TOP',
      handle: function (data, target, delta, mapper, fire) {
        var vel = EX.vel(target);
        var pos = EX.transPos(target);
        SVec.setVec(vel, vel.x, -vel.y);
        SVec.setVec(pos, pos.x, pos.y - 4);
        fire(data.collider, 'FLASH_GUTTER');
      }
   },
    ball_bottom: {
      type: 'BALL_GUTTER_BOTTOM',
      handle: function (data, target, delta, mapper, fire) {
        that.ballHitFloor(target, mapper)
      }
    },
    ball_left: {
      type: 'BALL_GUTTER_LEFT',
      handle: function (data, target, delta, mapper, fire) {
        var vel = EX.vel(target);
        var pos = EX.transPos(target);
        SVec.setVec(vel, -vel.x, vel.y);
        SVec.setVec(pos, pos.x + 4, pos.y);
        fire(data.collider, 'FLASH_GUTTER');
      }
    },
    ball_right: {
      type: 'BALL_GUTTER_RIGHT',
      handle: function (data, target, delta, mapper, fire) {
        var vel = EX.vel(target);
        var pos = EX.transPos(target);
        SVec.setVec(vel, -vel.x, vel.y);
        SVec.setVec(pos, pos.x - 4, pos.y);
        fire(data.collider, 'FLASH_GUTTER');
      }
    },
    ball_paddle: {
      type: 'BALL_PADDLE',
      handle: function (data, target, delta, mapper, fire) {
        var vel = EX.vel(target);
        var pos = EX.transPos(target);
        SVec.setVec(vel, vel.x, -vel.y);
        SVec.setVec(pos, pos.x, pos.y + 4);
        var ball_wiggle = Math.PI / 16;
        SVec.rotVec(vel, SMath.rand(-ball_wiggle, ball_wiggle))
      }
    }
  };
}