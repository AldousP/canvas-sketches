var CameraTests = function () {
  this.name = 'Camera Tests';
  this.date = '06.27.2017';

  this.root = {};

  this.state = {
    bgColor: '#323232'
  };

  this.resourceDir = 'assets';

  this.setup = function () {
    sm.state.paused = true;
    this.root = this.entityHandler.createEntity([
        new PositionComponent(0, 0),
        new ColorComponent(Color.pink),
        new PolygonComponent(generatePolygon(8, 32)),
        new RotationComponent(64),
        new RootComponent(),
        new VelocityComponent(0, 10),
        new AccelerationComponent(0, 64)
    ], 'root');

    this.entityHandler.bindToParent(this.root, [
      this.entityHandler.createEntity([
        new PositionComponent(0, 0),
        new PolygonComponent(generatePolygon(4, 32, Math.PI / 4))
      ]),
      this.entityHandler.createEntity([
        new PositionComponent(0, -48),
        new PolygonComponent(generatePolygon(4, 32, Math.PI / 4))
      ]),
      this.entityHandler.createEntity([
        new PositionComponent(0, 48),
        new PolygonComponent(generatePolygon(4, 32, Math.PI / 4))
      ])
    ]);

    this.systemProcessor.addSystem(new BackgroundSystem("a"));
    this.systemProcessor.addSystem(new RenderingSystem("b"));
    this.systemProcessor.addSystem(new RootSystem("c"));
    this.systemProcessor.addSystem(new PhysicsSystem("d"));
    this.systemProcessor.processEntities([this.root], this.state, this.delta);
  };

  this.update = function () {
    this.updateBase();
    this.systemProcessor.processEntities([this.root], this.state, this.delta);
    this.root.components.rot.rotation += 45 * this.delta;

    sm.gfx.setStrokeColor(Color.yellow);
    sm.gfx.drawRect(0, 0, 64, 64, true, 45);
  }
};