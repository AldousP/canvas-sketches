ComponentType.snakeHead = 'SnakeHead';
ComponentType.snakeChild = 'SnakeChild';

var SnakeHeadComponent = function () {
  this.name = ComponentType.snakeHead;
  this.next = -1;
  this.length = 0;
  this.tail = -1;
};

var SnakeChildComponent = function (prev, movement_speed) {
  this.name = ComponentType.snakeChild;
  this.root = -1;
  this.prev = prev;
  this.next = -1;
  this.max_dst_from_parent = 16;
  this.movement_speed = movement_speed;
};

EX.snakeHead = function (entity) {
  return entity.components[ComponentType.snakeHead];
};

EX.snakeChild = function (entity) {
  return entity.components[ComponentType.snakeChild];
};

function SnakeSystem() {
  this.name = 'snake_system';
  this.active = true;
  this.movement_speed = 128;
  this.sequences = [];
  this.field_half_width = 256;
  this.field_half_height = 128;
  this.max_food = 1;

  this.filter = [
    ComponentType.gameState
  ];

  var pickUpPolygon = SPoly.generatePolygon(8, 9, 1, 1);
  var snakeSegment = SPoly.generatePolygon(16, 7.5, 1, 1);
  var snakeSegmentCollider = SPoly.generatePolygon(4, 7, 1, 1);

  var that = this;
  this.setup = function (entityMapper) {
    this.sequences.push({
      length: 3,
      type: 'REPEATING',
      handler: function (mapper) {
        var root = mapper.getFirstOfTag('scene_root');
        var food = mapper.getEntitiesForTag('snake_food');
        if (!food || food.length < that.max_food) {
          mapper.buildEntityWithRoot([
            new RenderableComponent(),
            new ColliderComponent(pickUpPolygon),
            new TransformComponent(
              SMath.rand(-that.field_half_width, that.field_half_width),
              SMath.rand(-that.field_half_height, that.field_half_height),
              SMath.rand(0, 2 * Math.PI)
            ),
            new PolygonComponent(pickUpPolygon, new Color(255, 255, 255, 1))
          ], [], ['snake_food'], root);
        }
      }
    })
  };

  var parentPos = new SVec.Vector();
  var displacement = new SVec.Vector();
  this.process = function (entities, fire, delta, mapper) {
    var snake = mapper.getFirstOfTag('snake');
    var gameState = mapper.getFirstOfTag('game_state');

    if (!gameState.paused) {
      var headData = EX.snakeHead(snake);

      if (headData) {
        var child = mapper.store[headData.next];
        if (child) {
          SVec.setVecVec(parentPos, EX.transPos(snake));
          SVec.setVec(displacement, 0, 0);

          var childPos;
          while (child) {
            childPos = EX.transPos(child);
            var dst = SVec.dst(childPos, parentPos);
            var childData = EX.snakeChild(child);

            if (dst > childData.max_dst_from_parent) {
              SVec.subVecVec2(displacement, parentPos, childPos);
              SVec.setMag(displacement, childData.movement_speed * delta);
              SVec.addVecVec(childPos, displacement);
              SVec.setVecVec(parentPos, childPos);
              childData.movement_speed = this.movement_speed;
              child = mapper.store[childData.next];
            } else {
              child = null;
            }
          }
        }
      }

      if (sm.input.state.keyboard[sc.keys.a]) {
        ES.setVel(snake, -this.movement_speed, 0);
      }

      if (sm.input.state.keyboard[sc.keys.d]) {
        ES.setVel(snake, this.movement_speed, 0);
      }

      if (sm.input.state.keyboard[sc.keys.w]) {
        ES.setVel(snake, 0, this.movement_speed);
      }

      if (sm.input.state.keyboard[sc.keys.s]) {
        ES.setVel(snake, 0, -this.movement_speed);
      }

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
  
  this.addSnakeComponent = function (mapper, delta) {
    var sceneRoot = mapper.getFirstOfTag('scene_root');
    var snake = mapper.getFirstOfTag('snake');
    var snakePos = EX.transPos(snake);
    var headData = EX.snakeHead(snake);
    var tail = mapper.store[headData.tail];
    var snakeVel = EX.vel(snake);

    var priorID;
    var priorPos = new SVec.Vector();
    if (tail) {
      priorID = tail.ID;
      SVec.setVecVec(priorPos, EX.transPos(tail));
    } else {
      priorID = snake.ID;
      SVec.setVecVec(priorPos, snakePos);
    }

    SVec.rotVec(snakeVel, Math.PI);
    SVec.addVecConst(priorPos, snakeVel.x * delta, snakeVel.y * delta);
    SVec.rotVec(snakeVel, -Math.PI);

    var new_tail = mapper.buildEntityWithRoot([
      new SnakeChildComponent(priorID, this.movement_speed),
      new RenderableComponent(),
      new TransformComponent(priorPos.x, priorPos.y),
      new ColliderComponent(snakeSegmentCollider),
      new PolygonComponent(
        snakeSegment,
        SColor.colorFromColor(sc.color.white),
        SColor.colorFromColor(sc.color.white))
    ], [], ['snake_child'], sceneRoot);

    if (tail) {
      var tailData = EX.snakeChild(tail);
      tailData.next = new_tail.ID;
    } else {
      headData.next = new_tail.ID;
    }

    headData.tail = new_tail.ID;
    headData.length ++;
  };

  var that = this;
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
        that.addSnakeComponent(mapper, delta);
        that.movement_speed += 10;
        that.max_food += 1;
      }
    },
    snake_hit_self: {
      type: 'SNAKE_HIT_SELF',
      handle: function (data, target, delta, mapper, fire) {
        var snakeData = EX.snakeHead(target);
        if (data.collider !== snakeData.next) {
          var textPane = mapper.getFirstOfTag('score_pane');
          var gameState = mapper.getFirstOfTag('game_state');

          ES.setGameState(gameState, 'score', snakeData.length);
          ES.setText(textPane, snakeData.length);

          target.components[ComponentType.transform].position.x = 0;
          target.components[ComponentType.transform].position.y = 0;
          target.components[ComponentType.snakeHead].tail = -1;
          target.components[ComponentType.snakeHead].next = -1;
          target.components[ComponentType.snakeHead].length = 0;
          that.movement_speed = 128;

          var children = mapper.getEntitiesForTag('snake_child');
          children.forEach(function (child) {
            mapper.queueForDeletion(child);
          });
        }
      }
    }
  };
}