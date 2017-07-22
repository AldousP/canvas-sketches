var TextTests = function () {
  this.state = {
    meta : {
      name : 'Text Tests',
      date : '06.27.2017',
      description : 'Examples of test rendering.',
    },
    inputTargets : ['root'],
    bgColor: '#0b4775',
    sampleVec: new Vector(0, 32)
  };

  this.resourceDir = 'assets';
  this.actions = [];

  this.setup = function () {
    var root = this.entityMapper.createEntity([
      new RenderRoot(),
      new PositionComponent(0, 0),
      new MovementComponent(new Vector(), 0),
      new RotationComponent(0)], 'root');

    var textPane = this.entityMapper.createEntity([
        new PositionComponent(0, 0),
        new RotationComponent(0),
        new TextComponent([
            'Oh',
            'Man',
            'Line',
            'Breaks'
        ], {
          color: Color.white,
          size: 16,
          font: 'Arial',
          style : 'normal',
          align: 'center'
        })], 'textpane');

    this.entityMapper.bindToParent(root, [textPane]);

    this.systemProcessor.addSystem(new BackgroundSystem("a"));
    this.systemProcessor.addSystem(new MovementSystem("b"));
    this.systemProcessor.addSystem(new RenderingSystem("c"));
    this.systemProcessor.addSystem(new InputSystem("e"));
  };

  this.update = function (delta) {
    this.systemProcessor.processEntities(this.state, delta);
  }
};