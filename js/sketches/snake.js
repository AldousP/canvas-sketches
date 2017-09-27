function Snake () {
  'use strict';
  this.conf = {
    name: 'Snake',
    description: 'Snake but it\'s terrible.',
    date: '09.23.2017'
  };

  var BG_COLOR = SColor.colorForHex("#812e4d");

  this.setup = function () {
    this.update(0, sm.gfx);
    var e = this.entities;
    var s = this.systems;

    this.setupAppState(e);
    this.setupRenderState(this.render_root, e);
    this.setupSceneState(e);

    s.addSystem(new SnakeSystem(), e);
    s.addSystem(new VelocitySystem(), e);
    s.addSystem(new CollisionSystem({
      debounce_interval: 1 / 40,
      collision_map: {
        'snake': {
          'wall' : 'SNAKE_HIT_WALL'
        }
      }
    }));
    s.addSystem(new SequenceSystem({
      flash: {
        type: SequenceType.NORMAL,
        length: .25,
        startOn: ['FLASH'],
        reset: false,
        sequence: [
          {
            start: 0,
            end: .25,
            handle: function (target, progress) {
              target.components[ComponentType.polygon].fill.r = 255;
              target.components[ComponentType.polygon].fill.g = 255;
              target.components[ComponentType.polygon].fill.b = 255;
              target.components[ComponentType.polygon].fill.a = Math.pow(SFormat.float_two_pt(1 - progress), 3);
            }
          }
        ]
      }
    }));
    s.addSystem(new RenderingSystem(), e);
  };
  
  this.setupAppState = function (e) {
    /**
     * Create an App root with two children:
     * - A Render Root
     * - A Game State
     */
    var app_root = e.buildEntity([
      new AppRoot()
    ], [], ['app_root']);

    this.game_state = e.buildEntityWithRoot([
      new GameStateComponent({
        paused: true
      })
    ], [], ['game_state'], app_root);

    this.render_root = e.buildEntityWithRoot([
      new RenderRoot(),
      new TransformComponent(),
      new RenderableComponent()
    ], [], ['render_root'], app_root);
  };

  /**
   * Set the render_root component's children to a UI_root and a scene_root.
   * @param render_root the render_root component.
   * @param e the entity mapper.
   */
  this.setupRenderState = function (render_root, e) {
    this.UI_root = e.buildEntityWithRoot([
      new TransformComponent(),
      new RenderableComponent()
    ], [], ['UI_root'], render_root);

    this.scene_root = e.buildEntityWithRoot([
      new TransformComponent(),
      new RenderableComponent()
    ], [], ['scene_root'], render_root);
  };

  /**
   * Create the scene full of entities for gameplay.
   * @param e the entity mapper.
   */
  var snake_size = 18;
  this.setupSceneState = function (e) {
    var the_snake = e.buildEntityWithRoot([
      new RenderableComponent(),
      new TransformComponent(),
      new VelocityComponent(0, 0, 32),
      new PolygonComponent(SPoly.polyCircle(snake_size / 2), SColor.colorFromColor(sc.color.white), SColor.colorFromColor(sc.color.clear)),
      new ColliderComponent(SPoly.polySquare(snake_size))
      ], [], ['snake'], this.scene_root);

    e.buildEntityWithRoot([
      new TransformComponent(-324, 0),
      new PolygonComponent(SPoly.polyRect(72, 512), SColor.colorFromColor(sc.color.clear), SColor.colorFromColor(sc.color.clear)),
      new ColliderComponent(SPoly.polyRect(72, 512)),
      new RenderableComponent(),
      new SequenceComponent([ { name: 'flash'} ])
    ], [], ['wall'], this.scene_root);

    e.buildEntityWithRoot([
      new TransformComponent(0, 182),
      new PolygonComponent(SPoly.polyRect(1024, 72), SColor.colorFromColor(sc.color.clear), SColor.colorFromColor(sc.color.clear)),
      new ColliderComponent(SPoly.polyRect(1024, 72)),
      new RenderableComponent(),
      new SequenceComponent([ { name: 'flash'} ])
    ], [], ['wall'], this.scene_root);

    e.buildEntityWithRoot([
      new TransformComponent(0, -182),
      new PolygonComponent(SPoly.polyRect(1024, 72), SColor.colorFromColor(sc.color.clear), SColor.colorFromColor(sc.color.clear)),
      new ColliderComponent(SPoly.polyRect(1024, 72)),
      new RenderableComponent(),
      new SequenceComponent([ { name: 'flash'} ])
    ], [], ['wall'], this.scene_root);

    e.buildEntityWithRoot([
      new TransformComponent(324, 0),
      new PolygonComponent(SPoly.polyRect(72, 512), SColor.colorFromColor(sc.color.clear), SColor.colorFromColor(sc.color.clear)),
      new ColliderComponent(SPoly.polyRect(72, 512)),
      new RenderableComponent(),
      new SequenceComponent([ { name: 'flash'} ])
    ], [], ['wall'], this.scene_root);
  };

  /**
   * Updates the program and all its systems.
   * @param delta the time elapsed since the last tick
   * @param g shorthand reference to sm.gfx
   */
  this.update = function (delta, g) {
    g.clear(BG_COLOR);
    this.systems.process(this.entities, delta);
  };
}