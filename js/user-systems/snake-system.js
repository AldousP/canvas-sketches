function SnakeSystem() {
  this.name = 'snake_system';
  this.active = true;
  this.movement_speed = 128;

  this.sequences = [];


  this.filter = [
    ComponentType.gameState
  ];

  this.setup = function (entityMapper) {

  };

  this.process = function (entities, fire, delta, mapper) {
    var snake = mapper.getFirstOfTag('snake');

    if (sm.input.state.keyboard[sc.keys.a]) {
      ES.addVel(snake, -this.movement_speed * delta, 0);
      sm.gfx.setTextConf({
        font: 'arial',
        size: 32,
        color: sc.color.white
      });
    }

    if (sm.input.state.keyboard[sc.keys.d]) {
      ES.addVel(snake, this.movement_speed * delta, 0);
      sm.gfx.setTextConf({
        font: 'arial',
        size: 32,
        color: sc.color.white
      });
    }

    if (sm.input.state.keyboard[sc.keys.w]) {
      ES.addVel(snake, 0, this.movement_speed * delta);
      sm.gfx.setTextConf({
        font: 'arial',
        size: 32,
        color: sc.color.white
      });
    }

    if (sm.input.state.keyboard[sc.keys.s]) {
      ES.addVel(snake, 0, -this.movement_speed * delta);
      sm.gfx.setTextConf({
        font: 'arial',
        size: 32,
        color: sc.color.white
      });
    }

    this.sequences.forEach(function (sequence) {

    })
  };

  this.listeners = {
    snake_hit_wall: {
      type: 'SNAKE_HIT_WALL',
      handle: function (data, target, delta, mapper, fire) {
        target.components[ComponentType.transform].position.x = 0;
        target.components[ComponentType.transform].position.y = 0;
        fire(data.collider, 'FLASH');
      }
    }
  };
}