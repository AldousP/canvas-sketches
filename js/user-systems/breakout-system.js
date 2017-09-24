function BreakoutSystem(ball_speed, board_width, board_height) {
  this.name = 'breakout_system';
  this.active = true;
  this.ball_speed = ball_speed;
  this.board_width = board_width;
  this.board_height = board_height;
  this.paddle_range = board_width / 2;
  this.gameStateID = null;
  this.ballID = null;
  this.lastPaddleX = 0;
  this.filter = [
    ComponentType.gameState
  ];

  this.setup = function () {

  };

  this.process = function (entities, fire, delta, mapper) {
    var player = mapper.getFirstOfTag('player');
    var game_state = EX.state(mapper.getFirstOfTag('game_state'));
    var score_pane = mapper.getFirstOfTag('score_pane');

    if (!game_state.game_over) {
      ES.setPos(player, SMath.clamp(sm.input.state.cursor.x, -this.paddle_range, this.paddle_range));
      ES.setText(score_pane, game_state.score);
    }
  };
  
  this.ballHitFloor = function (ball, mapper, fire) {
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
      this.gameOver(mapper, fire);
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

  this.gameOver = function (mapper, fire) {
    var game_state = mapper.store[mapper.getEntitiesForTag('game_state')];
    var state = EX.state(game_state);

    state.game_over = true;
    fire(mapper.getFirstOfTag('root').ID, 'FADE_OUT')
  };

  this.playRandomChime = function () {
    var chimes = [
      sc.notes.C4 / 3,
      sc.notes.F4 / 3,
      sc.notes.G4 / 3,
      sc.notes.As4 / 3
    ];

    var note_index = Math.floor(SMath.rand(0, 3));
    sm.sfx.beep(chimes[note_index], 'sine', 0.005, .15);
    sm.sfx.beep(chimes[SMath.wrapIndex(note_index + 3, 3)] * 2, 'triangle', 0.005, .15);
  };

  var that = this;
  this.listeners = {
    ball_tile: {
      type: 'BALL_TILE',
      handle: function (data, target, delta, mapper, fire) {
        var vel = EX.vel(target);
        SVec.setVec(vel, vel.x, -vel.y);
        var tile = mapper.store[data.collider];
        if (tile) {
          EX.col(tile).active = false;
          mapper.queueForDeletion(tile.ID);
          EX.state(mapper.getFirstOfTag('game_state')).score += 1;
          that.playRandomChime();
        }
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
        that.playRandomChime();
      }
   },
    ball_bottom: {
      type: 'BALL_GUTTER_BOTTOM',
      handle: function (data, target, delta, mapper, fire) {
        that.ballHitFloor(target, mapper, fire);
        fire(data.collider, 'FLASH_GUTTER');
        that.playRandomChime();
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
        that.playRandomChime();
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
        that.playRandomChime();
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
        SVec.rotVec(vel, SMath.rand(-ball_wiggle, ball_wiggle));
        that.playRandomChime();
      }
    }
  };
}