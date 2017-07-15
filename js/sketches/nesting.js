var Nesting = function () {
  this.state = {
    meta : {
      name : 'Nesting',
      date : '06.27.2017'
    },
    bgColor: '#730575',
    sampleVec: new Vector(0, 32)
  };

  this.root = {};
  this.resourceDir = 'assets';

  this.setup = function () {
    this.root = this.entityHandler.createEntity([
      new RootComponent(),
      new PositionComponent(64, 64),
      new ColorComponent(Color.pink),
      new PolygonComponent(generatePolygon(8, 32)),
      new VelocityComponent(0, 0)
    ], 'root');

    var A = this.entityHandler.createEntity([
      new PositionComponent(0, 0),
      new ColorComponent(Color.cyan),
      new PolygonComponent(generatePolygon(4, 32, Math.PI / 4))
    ]);

    var B = this.entityHandler.createEntity([
      new PositionComponent(48, 0),
      new PolygonComponent(generatePolygon(3, 8, Math.PI / 4))
    ]);

    this.entityHandler.bindToParent(this.root,[A, B]);

    this.systemProcessor.addSystem(new BackgroundSystem("a"));
    this.systemProcessor.addSystem(new RenderingSystem("b"));
    this.systemProcessor.addSystem(new RootSystem("c"));
    this.systemProcessor.addSystem(new PhysicsSystem("d"));
  };

  this.update = function (delta) {
    this.systemProcessor.processEntities([this.root], this.state, delta);
  }
};