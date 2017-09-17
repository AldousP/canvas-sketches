function PongSystem(ball_speed) {
  this.name = 'pong_system';
  this.active = true;
  this.ball_speed = ball_speed;

  var playerID, ballID;

  this.filter = [
    ComponentType.gameplay
  ];

  this.setup = function () {

  };

  this.process = function (entities, fire, delta, mapper) {
    var ball = mapper.store[mapper.getEntitiesForTag('ball')[0]];

    var player = mapper.store[mapper.getEntitiesForTag('player')];
    var player_pos = player.components[ComponentType.transform].position;

    playerID = player.ID;
    ballID = ball.ID;

    SVec.setVec(player_pos, player_pos.x, SMath.clamp(sm.input.state.cursor.y, -72, 72));
    entities.forEach(function (entity) {

    });
  };

  this.listeners = {
    EntityCollision: {
      type: EventTypes.ENTITY_COLLISION,
      handle: function (data, target, delta, mapper, fire) {
        if (data.collider === ballID) {
          var ball = mapper.store[data.collider];
          var vel = ball.components[ComponentType.velocity].velocity;

          if (target.tags.indexOf('gutter') !== -1) {
            vel.y = -vel.y;
          }

          if (target.tags.indexOf('paddle') !== -1) {
            vel.x = -vel.x;
            SVec.sclVec(vel, 1.10);
          }

          if (target.tags.indexOf('player_goal') !== -1) {
            SVec.setVec(ball.components[ComponentType.transform].position, 0, 0);
            SVec.setVec(ball.components[ComponentType.velocity].velocity, -ball_speed, SMath.rand(-ball_speed, ball_speed));
            fire()
          }

          if (target.tags.indexOf('AI_goal') !== -1) {
            SVec.setVec(ball.components[ComponentType.transform].position, 0, 0);
            SVec.setVec(ball.components[ComponentType.velocity].velocity, ball_speed, SMath.rand(-ball_speed, ball_speed));
          }
        }
      }
    }
  };
}