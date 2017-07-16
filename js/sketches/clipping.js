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
    var left = this.entityMapper.createEntity([
      new PositionComponent(-128, 0),
      new RotationComponent(0),
      new PolygonComponent(generatePolygon(4, 128, Math.PI / 4))
    ], 'left');

    var right = this.entityMapper.createEntity([
      new PositionComponent(128, 0),
      new RotationComponent(0),
      new ClipComponent(),
      new InputComponent(),
      new PolygonComponent(generatePolygon(4, 128, Math.PI / 4))
    ], 'right');

    var root = this.entityMapper.createEntity([
      new PositionComponent(0, 0),
      new RotationComponent(0),
      new ColorComponent(Color.dark_blue),
      new ClipComponent(),
      new PolygonComponent((generatePolygon(4, 128, Math.PI / 4, 3.5, 1.5))),
      new RenderRoot()], 'root', [left, right]
    );

    this.entityMapper.bindToParent(right,[
        this.entityMapper.createEntity([
          new ColorComponent(Color.pink),
          new PositionComponent(32, 0),
          new RotationComponent(0),
          new PolygonComponent(generatePolygon(3, 32, Math.PI / 4))
        ])
    ]);

    this.systemProcessor.addSystem(new BackgroundSystem("a"));
    this.systemProcessor.addSystem(new MovementSystem("b"));
    this.systemProcessor.addSystem(new RenderingSystem("c"));
    this.systemProcessor.addSystem(new InputSystem("d"));
  };

  this.update = function (delta) {
    this.systemProcessor.processEntities(this.state, delta)
  }
};