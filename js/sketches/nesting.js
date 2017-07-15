var Nesting = function () {
  this.state = {
    meta : {
      name : 'Nesting',
      date : '06.27.2017'
    },
    bgColor: '#360638',
    sampleVec: new Vector(0, 32)
  };

  this.root = {};
  this.resourceDir = 'assets';

  this.actions = [];

  this.setup = function () {
    this.root = this.entityMapper.createEntity([
      new RootComponent(),
      new PositionComponent(64, 32),
      new MovementComponent(new Vector(0, 0), 35),
      new RotationComponent(180),
      new ColorComponent(Color.pink),
      new PolygonComponent(generatePolygon(8, 32))
    ], 'root');

    var A = this.entityMapper.createEntity([
      new PositionComponent(32, 0),
      new ColorComponent(Color.cyan),
      new PolygonComponent(generatePolygon(4, 32, Math.PI / 4))
    ]);

    var B = this.entityMapper.createEntity([
      new PositionComponent(-32, 0),
      new ColorComponent(Color.cyan),
      new PolygonComponent(generatePolygon(4, 32, Math.PI / 4))
    ]);

    this.entityMapper.bindToParent(this.root,[A, B]);

    this.systemProcessor.addSystem(new BackgroundSystem("a"));
    this.systemProcessor.addSystem(new MovementSystem("b"));
    this.systemProcessor.addSystem(new PhysicsSystem("c"));
    this.systemProcessor.addSystem(new RenderingSystem("d"));
    this.systemProcessor.addSystem(new InputSystem("e"));
  };

  this.update = function (delta) {
    this.systemProcessor.processEntities(this.state, delta);
  }
};