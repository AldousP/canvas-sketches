function SnakeSystem() {
  this.name = 'snake_system';
  this.active = true;
  this.movement_speed = 128;
  this.sequences = [];
  this.field_half_width = 256;
  this.field_half_height = 128;

  this.filter = [
    ComponentType.gameState
  ];

  var pick_up_polygon = SPoly.generatePolygon(8, 9, 1, 1);

  var that = this;
  this.setup = function (entityMapper) {
    this.sequences.push({
      length: 3,
      type: 'REPEATING',
      handler: function (mapper) {
        var root = mapper.getFirstOfTag('scene_root');
        mapper.buildEntityWithRoot([
          new RenderableComponent(),
          new ColliderComponent(pick_up_polygon),
          new TransformComponent(
            SMath.rand(-that.field_half_width, that.field_half_width),
            SMath.rand(-that.field_half_height, that.field_half_height),
            SMath.rand(0, 2 * Math.PI)
          ),
          new PolygonComponent(pick_up_polygon, new Color(255, 255, 255, 1))
        ], [], ['snake_food'], root);
      }
    })
  };

  this.process = function (entities, fire, delta, mapper) {
    var snake = mapper.getFirstOfTag('snake');
    var game_state = mapper.getFirstOfTag('game_state');

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

    if (!game_state.paused) {
      var that = this;
      this.sequences.forEach(function (sequence, index) {
        if (!sequence.progress) sequence.progress = 0;
        sequence.progress += delta;
        if (sequence.progress >= sequence.length) {
          sequence.handler(mapper);
          sequence.progress -= sequence.length;
          if (sequence.type !== 'REPEATING') {
            that.sequences.splice(index, 1);
          }
        }
      })
    }
  };

  this.listeners = {
    snake_hit_wall: {
      type: 'SNAKE_HIT_WALL',
      handle: function (data, target, delta, mapper, fire) {
        target.components[ComponentType.transform].position.x = 0;
        target.components[ComponentType.transform].position.y = 0;
        fire(data.collider, 'FLASH');
      }
    },
    snake_ate_food: {
      type: 'SNAKE_ATE_FOOD',
      handle: function (data, target, delta, mapper, fire) {
        mapper.queueForDeletion(data.collider);
      }
    }
  };
}