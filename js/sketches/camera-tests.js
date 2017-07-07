var CameraTests = function () {
  this.name = 'Camera Tests';
  this.date = '06.27.2017';

  this.root = {};

  this.state = {
    bgColor: '#323232'
  };

  this.resourceDir = 'img';

  this.setup = function () {

    this.root = this.entityHandler.createEntity([
        new PositionComponent(10, 0),
        new PolygonComponent(generatePolygon(16, 8)),
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

    this.systemProcessor.addSystem(new RenderingSystem("a"));
    this.systemProcessor.addSystem(new RootSystem("b"));
    this.systemProcessor.addSystem(new PhysicsSystem("c"));

    this.systemProcessor.processEntities([this.root], this.state, this.delta);
  };

  this.update = function () {
    this.updateBase();
    this.systemProcessor.processEntities([this.root], this.state, this.delta);
  }
};