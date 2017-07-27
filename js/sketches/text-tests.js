var TextTests = function () {
  this.state = {
    meta : {
      name : 'Text Tests',
      date : '06.27.2017',
      description : 'Examples of text rendering.'
    },
    inputTargets : ['root'],
    systemStates : {
      background : {
        bgColor: '#dd2a53'
      }
    },
    sampleVec: new Vector(0, 32)
  };

  this.resourceDir = 'assets';
  this.actions = [];

  this.setup = function () {
    var textPaneA = this.entityMapper.createEntity([
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

    var textPaneB = this.entityMapper.createEntity([
      new PositionComponent(-264, 64),
      new RotationComponent(0),
      new TextComponent([
        'Left Align'
      ], {
        color: Color.white,
        size: 12,
        font: 'courier',
        style : 'normal',
        align: 'left'
      })], 'textpane');

    var textPaneC = this.entityMapper.createEntity([
      new PositionComponent(-264, 0),
      new RotationComponent(0),
      new TextComponent([
        'Center Align'
      ], {
        color: Color.white,
        size: 12,
        font: 'courier',
        style : 'normal',
        align: 'center'
      })], 'textpane');

    var textPaneD = this.entityMapper.createEntity([
      new PositionComponent(-264, -64),
      new RotationComponent(0),
      new TextComponent([
        'Right Align'
      ], {
        color: Color.white,
        size: 12,
        font: 'courier',
        style : 'normal',
        align: 'right'
      })], 'textpane');

    var textPaneE = this.entityMapper.createEntity([
      new PositionComponent(200, 64),
      new RotationComponent(0),
      new MovementComponent(new Vector(0, 0), 64),
      new TextComponent([
        'Rotated Text',
        'Great Value!'
      ], {
        color: Color.white,
        size: 32,
        font: 'Serif',
        style : 'normal',
        align: 'center'
      })], 'textpane');

    var textPaneF = this.entityMapper.createEntity([
      new PositionComponent(-128, 64),
      new RotationComponent(0),
      new TextComponent([
        'Plane Separated',
        'Parallax Text!'
      ], {
        color: Color.white,
        size: 16,
        font: 'Sans-serif',
        style : 'italic',
        align: 'center'
      })], 'textpane');

    var textPaneG = this.entityMapper.createEntity([
      new PositionComponent(-64, 82),
      new RotationComponent(32),
      new TextComponent([
        'Wowza!'
      ], {
        color: '#4ce9ff',
        size: 14,
        font: 'Sans-serif',
        style : 'italic',
        align: 'center'
      })], 'textpane');

    var layer1 = this.entityMapper.createEntity([
      new PositionComponent(0, 0),
      new RotationComponent(0)
    ], 'layer1', [
        textPaneA,
        textPaneB,
        textPaneC,
        textPaneD,
        textPaneE
    ]);

    var layer2 = this.entityMapper.createEntity([
      new PositionComponent(0, 0),
      new MovementComponent(new Vector(8, 0), 0),
      new RotationComponent(0)
    ], 'layer2', [
        textPaneF,
        textPaneG
    ]);

    var root = this.entityMapper.createEntity([
      new RenderRoot(),
      new PositionComponent(0, 0),
      new RotationComponent(0)], 'root', [
          layer1,
          layer2
    ]);

    this.systemProcessor.addSystem(new BackgroundSystem());
    this.systemProcessor.addSystem(new MovementSystem());
    this.systemProcessor.addSystem(new RenderingSystem());
    this.systemProcessor.addSystem(new InputSystem({}));
  };

  this.update = function (delta) {
    this.systemProcessor.processEntities(delta);
  }
};