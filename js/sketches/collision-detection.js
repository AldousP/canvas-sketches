'use strict';

var EventType = {
  sampleEvent: 'SAMPLE_EVENT'
};

function CollisionDetection () {
  this.conf = {
    name: 'Collision Response',
    description: 'Collision Response Demos',
    date: '09.17.2017'
  };

  var BG_COLOR = SColor.colorForHex("#894e6d");
  var base_radius = 32;
  var gravity = -180;
  var colliders = [];

  this.setup = function () {

    var renderRoot = this.entities.buildEntity(
      [
        new TransformComponent(0, 0),
        new RenderableComponent(),
        new RenderRoot()
      ], [], ['render_root']);

    var boxCount = 1;
    for (var i = 0; i < boxCount; i++) {
      this.entities.buildEntityWithRoot(
        [
          new TransformComponent(-256 + (64 * i), 128 + (64 * i)),
          new VelocityComponent(0, 0),
          new AccelerationComponent(0, gravity),
          new StateMachineComponent('player_FSM'),
          new RenderableComponent(),
          { name: 'box' },
          new PolygonComponent(
            SPoly.polySquare(base_radius * 2),
            SColor.colorFromColor(sc.color.white)
          ),
          new ColliderComponent(SPoly.scalePolyConst(SPoly.polySquare(base_radius * 2), 1.05, 1.05))
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

    this.entities.buildEntityWithRoot(
      [
        new TransformComponent(82, 32),
        new VelocityComponent(0, 0),
        new AccelerationComponent(0, 0),
        new RenderableComponent(),
        new PolygonComponent(
          SPoly.scalePolyConst(SPoly.polySquare(base_radius ), 4, 4),
          SColor.colorFromColor(sc.color.white)
        ),
        new ColliderComponent(SPoly.scalePolyConst(SPoly.polySquare(base_radius ), 4, 4))
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
      filter: [ 'box' ],
      process: function (entities, fire, delta, mapper) {

        colliders.forEach(function (collider) {
          sm.gfx.setStrokeColor2(sc.color.white);
          sm.gfx.setStrokeWidth(4);
          sm.gfx.drawPtVec(collider.pos, collider.pen);
        });
        entities.forEach(function (entity) {
          if (sm.input.state.keyboard[sc.keys.a]) {
            SVec.addVecConst(EX.vel(entity), -128 * delta, 0);
          }

          if (sm.input.state.keyboard[sc.keys.d]) {
            SVec.addVecConst(EX.vel(entity), 128 * delta, 0);
          }


          if (sm.input.state.keyboard[sc.keys.s]) {
            SVec.setVec(EX.vel(entity), 0, -512);
          }

          if (sm.input.state.keyboard[sc.keys.space]) {
            SVec.setVec(EX.vel(entity), 0, 256);
          }

          SVec.addVecConst(EX.vel(entity), 0, gravity * delta);
        });
      },
      listeners: {
        box_hit_floor: {
          type: 'BOX_HIT_FLOOR',
          handle: function (data, target, delta, mapper, fire) {
            ES.setVel(target, EX.vel(target).x, 0);
            ES.setAccl(target, 0, 0);
            colliders.push({ pen: data.penetration, pos: SVec.cpyVec(EX.transPos(target))});
            SVec.addVecVec(EX.transPos(target), SVec.sclVec(data.penetration, 1.25));
          }
        }
      }
    });

    this.systems.addSystem(new StateMachineSystem({
      'player_FSM' : {
        listeners: {
          SAMPLE_EVENT : function (data, target, delta, mapper, fire, shift) {
            
          }
        },
        states: {
          IDLE: {
            process: function (entity, fire, delta, timeInState, shift) {

            },

            listeners: {
              SAMPLE_EVENT : function (data, target, delta, mapper, fire, shift) {
                
              }
            }
          },
          FALLING: {
            process: function (entity, fire, delta, timeInState, shift) {

            },

            listeners: {
              SAMPLE_EVENT : function (data, target, delta, mapper, fire, shift) {

              }
            }
          },
          JUMPING: {
            process: function (entity, fire, delta, timeInState, shift) {

            },

            listeners: {
              SAMPLE_EVENT : function (data, target, delta, mapper, fire, shift) {

              }
            }
          }
        }
      }
    }));
    this.systems.addSystem(new CollisionSystem({
      debounce_interval: 1 / 45,
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

