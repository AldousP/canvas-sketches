function BreakoutSystem(ball_speed) {
  this.name = 'breakout_system';
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

    SVec.setVec(player_pos, SMath.clamp(sm.input.state.cursor.x, -256, 256), player_pos.y);
  };

  this.listeners = {
    EntityCollision: {
      type: EventTypes.ENTITY_COLLISION,
      handle: function (data, target, delta, mapper, fire) {
        if (data.collider === ballID) {
          var ball = mapper.store[data.collider];
          var vel = ball.components[ComponentType.velocity].velocity;

          if (target.tags.indexOf('paddle') !== -1) {
            vel.x = -vel.x;
            SVec.sclVec(vel, 1.10);
          }
        }
      }
    }
  };
}