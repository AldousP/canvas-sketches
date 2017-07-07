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
        new PositionComponent(0, 0),
        new PolygonComponent(generatePolygon(16, 64)),
        new RootComponent()
    ], 'root');

    this.entityHandler.bindToParent(this.root, [
      this.entityHandler.createEntity([
        new PositionComponent(16, 0),
        new PolygonComponent(generatePolygon(3, 32))
      ]),
      this.entityHandler.createEntity([
        new PositionComponent(0, 16),
        new PolygonComponent(generatePolygon(3, 32))
      ]),
      this.entityHandler.createEntity([
        new PositionComponent(-16, 0),
        new PolygonComponent(generatePolygon(3, 32))
      ])
    ]);

    this.systemProcessor.addSystem(new RootSystem("a"));
    this.systemProcessor.addSystem(new RenderingSystem("b"));

    this.systemProcessor.processEntities([this.root], this.state, this.delta);
  };

  this.update = function () {
    this.updateBase();
    this.systemProcessor.processEntities([this.root], this.state, this.delta);
  }
};