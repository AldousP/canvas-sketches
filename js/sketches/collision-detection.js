'use strict';

function CollisionDetection () {
  this.conf = {
    name: 'Collision Response',
    description: 'Collision Response Demos',
    date: '09.17.2017'
  };

  var BG_COLOR = SColor.colorForHex("#894e6d");
  var base_radius = 32;
  var gravity = -80;

  this.setup = function () {

    var renderRoot = this.entities.buildEntity(
      [
        new TransformComponent(0, 0),
        new RenderableComponent(),
        new RenderRoot()
      ], [], ['render_root']);


    var boxCount = 3;
    for (var i = 0; i < boxCount; i++) {
      this.entities.buildEntityWithRoot(
        [
          new TransformComponent(-256 + (64 * i), 128 + (64 * i)),
          new VelocityComponent(0, 0),
          new AccelerationComponent(0, gravity),
          new RenderableComponent(),
          { name: 'box' },
          new PolygonComponent(
            SPoly.polySquare(base_radius * 2),
            SColor.colorFromColor(sc.color.white)
          ),
          new ColliderComponent(SPoly.polySquare(base_radius * 2))
        ], [], ['box'], renderRoot);

    }

    this.entities.buildEntityWithRoot(
      [
        new TransformComponent(0, -128),
        new VelocityComponent(0, 0),
        new AccelerationComponent(0, 0),
        new RenderableComponent(),
        new PolygonComponent(
          SPoly.scalePolyConst(SPoly.polySquare(base_radius * 2), 16, 1),
          SColor.colorFromColor(sc.color.white)
        ),
        new ColliderComponent( SPoly.scalePolyConst(SPoly.polySquare(base_radius * 2), 16, 1))
      ], [], ['floor'], renderRoot);

    this.systems.addSystem({
      name: 'transformSystem',
      filter: [ ComponentType.transform ],
      process: function (entities, fire, delta, mapper) {
        entities.forEach(function (entity) {
          SVec.setVecVec(EX.transLastPos(entity), EX.transPos(entity));
        });
      }
    });

    this.systems.addSystem(new VelocitySystem());

    this.systems.addSystem({
      name: 'logicSystem',
      // filter: [ 'box' ],
      process: function (entities, fire, delta, mapper) {
        entities.forEach(function (entity) {

        });
      },
      listeners: {
        box_hit_floor: {
          type: 'BOX_HIT_FLOOR',
          handle: function (data, target, delta, mapper, fire) {
            SVec.setVecVec(EX.transPos(target), EX.transLastPos(target));
            ES.setVel(target, 0, 0);
            ES.setAccl(target, 0, 0);
            SVec.addVecVec(EX.transPos(target), data.penetration);
          }
        }
      }
    });

    this.systems.addSystem(new CollisionSystem({
      debounce_interval: 1 / 40,
      collision_map: {
        'box': {
          'floor': 'BOX_HIT_FLOOR'
        }
      }
    }));

    this.systems.addSystem(new RenderingSystem());
  };

  this.update = function (delta, g) {
    g.clear(BG_COLOR);
    this.systems.process(this.entities, delta);
  };
}

