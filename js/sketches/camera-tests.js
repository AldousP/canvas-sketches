var CameraTests = function () {
  this.name = 'Camera Tests';
  this.date = '06.27.2017';

  this.root = {};

  this.state = {
    bgColor: '#323232',
    sampleVec: new Vector(100, 10)
  };

  this.resourceDir = 'assets';

  this.setup = function () {
    sm.state.paused = true;
    this.root = this.entityHandler.createEntity([
        new PositionComponent(-64, 0),
        new ColorComponent(Color.pink),
        new PolygonComponent(generatePolygon(8, 32)),
        new RotationComponent(15),
        new RootComponent(),
        new VelocityComponent(0, 10),
        new AccelerationComponent(0, 64)
    ], 'root');

    var A = this.entityHandler.createEntity([
          new PositionComponent(0, 0),
          new PolygonComponent(generatePolygon(4, 32, Math.PI / 4))
        ]);

    var B = this.entityHandler.createEntity([
          new PositionComponent(0, -48),
          new PolygonComponent(generatePolygon(4, 32, Math.PI / 4))
        ]);

    var C = this.entityHandler.createEntity([
      new PositionComponent(0, 48),
      new PolygonComponent(generatePolygon(4, 32, Math.PI / 4))
    ]);

    this.entityHandler.bindToParent(A,[
        this.entityHandler.createEntity([
          new PositionComponent(-32, 0),
          new PolygonComponent(generatePolygon(3, 8, Math.PI / 4))
        ]),

      this.entityHandler.createEntity([
        new PositionComponent(32, 0),
        new PolygonComponent(generatePolygon(3, 8, Math.PI / 4))
      ]),

      this.entityHandler.createEntity([
        new PositionComponent(0, 0),
        new PolygonComponent(generatePolygon(3, 8, Math.PI / 4))
      ])
    ]);

    this.entityHandler.bindToParent(this.root, [A, B, C]);

    this.systemProcessor.addSystem(new BackgroundSystem("a"));
    this.systemProcessor.addSystem(new RenderingSystem("b"));
    this.systemProcessor.addSystem(new RootSystem("c"));
    this.systemProcessor.addSystem(new PhysicsSystem("d"));
    this.systemProcessor.processEntities([this.root], this.state, this.delta);
  };

  this.update = function () {
    this.updateBase();
    this.systemProcessor.processEntities([this.root], {}, this.delta);
    this.root.components.rot.rotation += 45 * this.delta;

    sm.gfx.setStrokeColor(Color.pink);
    rotVec(this.state.sampleVec, this.delta * (Math.PI / 16));

  }
};