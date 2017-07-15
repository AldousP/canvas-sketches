var Clipping = function () {
  this.state = {
    meta : {
      name : 'Clipping',
      date : '07.14.2017'
    },
    bgColor: '#007908'
  };

  this.root = {};
  this.resourceDir = 'assets';

  this.setup = function () {
    this.root = this.entityHandler.createEntity([
      new PositionComponent(64, 64),
      new ColorComponent(Color.white),
      new PolygonComponent(generatePolygon(4, 32))
    ], 'root');

    this.systemProcessor.addSystem(new BackgroundSystem("a"));
  };

  this.update = function (delta) {
    this.systemProcessor.processEntities([this.root], this.state, delta)
  }
};