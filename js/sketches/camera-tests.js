var CameraTests = function () {
  this.name = 'Nesting';
  this.date = '06.27.2017';

  this.root = {};
  this.state = {

  };
  this.state = {
    bgColor: '#323232',
    sampleVec: new Vector(0, 32)
  };

  this.resourceDir = 'assets';

  this.setup = function () {
    sm.state.paused = true;
    this.root = this.entityHandler.createEntity([
      new RootComponent(),
      new PositionComponent(64, 64),
      new ColorComponent(Color.pink),
      new PolygonComponent(generatePolygon(8, 32)),
      new RotationComponent(0),
      new VelocityComponent(0, 0),
      new AccelerationComponent(0, -32)
    ], 'root');

    var A = this.entityHandler.createEntity([
      new PositionComponent(0, 0),
      new ColorComponent(Color.cyan),
      new PolygonComponent(generatePolygon(4, 32, Math.PI / 4))
    ]);

    var B = this.entityHandler.createEntity([
      new ColorComponent(Color.cyan),
      new PositionComponent(0, -64),
      new PolygonComponent(generatePolygon(4, 32, Math.PI / 4))
    ]);

    var C = this.entityHandler.createEntity([
      new ColorComponent(Color.cyan),
      new PositionComponent(0, 64),
      new PolygonComponent(generatePolygon(5, 32, Math.PI / 4))
    ]);

    var D = this.entityHandler.createEntity([
      new RotationComponent(45),
      new PositionComponent(-48, 0),
      new PolygonComponent(generatePolygon(3, 8, Math.PI / 4))
    ]);

    this.entityHandler.bindToParent(B,[
      D,
      this.entityHandler.createEntity([
        new PositionComponent(48, 0),
        new PolygonComponent(generatePolygon(3, 8, Math.PI / 4))
      ]),

      this.entityHandler.createEntity([
        new PositionComponent(0, 0),
        new PolygonComponent(generatePolygon(3, 8, Math.PI / 4))
      ])
    ]);

    this.entityHandler.bindToParent(D,[
      this.entityHandler.createEntity([
        new PositionComponent(32, 0),
        new PolygonComponent(generatePolygon(12, 8, Math.PI / 4))
      ]),

      this.entityHandler.createEntity([
        new PositionComponent(-32, 0),
        new PolygonComponent(generatePolygon(12, 8, Math.PI / 4))
      ])
    ]);

    this.state.D = D;

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
    this.root.components.rot.rotation += 15 * this.delta;
    rotVec(this.state.sampleVec, 1 * this.delta);
  }
};