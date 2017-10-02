function PlatformingDemos () {
  'use strict';
  this.conf = {
    name: 'Platforming Demos',
    description: 'Non SAT based platforming demos.',
    date: '10.02.2017'
  };

  this.board_width = sm.gfx.width * 0.85;
  this.board_height = sm.gfx.height * 0.85;
  var BG_COLOR = SColor.colorForHex("#288156");

  this.setup = function () {
    var e = this.entities;
    var s = this.systems;

    this.setupAppState(e);
    this.setupRenderState(this.render_root, e);
    this.setupSceneState(e);
    this.setupUIState(e);

    s.addSystem(new VelocitySystem(), e);
    s.addSystem(new SensorSystem(), e);
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
  this.setupSceneState = function (e) {

    var base_radius = 16;
    var gravity = new SVec.Vector(0, -64);

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
      ], [], ['floor'], this.scene_root);

    this.entities.buildEntityWithRoot(
      [
        new TransformComponent(),
        new VelocityComponent(0, 0),
        new AccelerationComponent(gravity.x, gravity.y),
        new StateMachineComponent('player_FSM'),
        new RenderableComponent(),
        new PolygonComponent(
          SPoly.polySquare(base_radius * 2),
          SColor.colorFromColor(sc.color.white)
        ),
        new ColliderComponent(SPoly.scalePolyConst(SPoly.polySquare(base_radius * 2), 1.05, 1.05))
      ], [], ['box'], this.scene_root);
  };

  this.setupUIState = function (e) {

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