var Clipping = function () {
  this.state = {
    meta : {
      name : 'Clipping',
      date : '07.14.2017'
    },
    bgColor: '#1a191b'
  };

  this.root = {};
  this.resourceDir = 'assets';

  this.setup = function () {
    this.entityMapper.createEntity([
      new PositionComponent(0, 0),
      new RotationComponent(0),
      new PolygonComponent(generatePolygon(4, 128)),
      new ClipComponent()
    ], 'root',
      [
      this.entityMapper.createEntity([
        new PositionComponent(0, 64),
        new ColorComponent(Color.pink),
        new PolygonComponent(generatePolygon(8, 64))]),
      this.entityMapper.createEntity([
        new PositionComponent(0, -64),
        new ColorComponent(Color.pink),
        new PolygonComponent(generatePolygon(8, 64))])
      ]
    );

    this.systemProcessor.addSystem(new BackgroundSystem("a"));
    this.systemProcessor.addSystem(new RenderingSystem("b"));
    this.systemProcessor.addSystem(new InputSystem("c"));
  };

  this.update = function (delta) {
    sm.ctx.rect(-75, -75, 150, 150);
    sm.ctx.stroke();


    this.systemProcessor.processEntities(this.state, delta)
  }
};