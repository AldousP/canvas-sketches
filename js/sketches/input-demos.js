var InputDemos = function () {
  this.state = {
    assets: 'assets',
    meta : {
      name : 'Input Demos',
      date : '07.27.2017',
      description : 'Input tests and Chrome controller demo.'
    },
    systemStates : {
      rendering: {
        assets: 'assets/animations/'
      },
      background : {
        bgColor: '#ff495b'
      }
    }
  };

  this.setup = function () {
    var entities = [];
    var controllerPane = this.entityMapper.createEntity([
      new PositionComponent(-128, 0),
      new ColorComponent(Color.white),
      new ClipComponent(),
      new PolygonComponent(generatePolygon(4, 128, 45 / DEG_RAD, 2, 1.55))
    ], 'controllerPane', this.buildController() );

    var actionPane = this.entityMapper.createEntity([
      new PositionComponent(172, -112),
      new ColorComponent(Color.white),
      new ClipComponent(),
      new PolygonComponent(generatePolygon(4, 128, 45 / DEG_RAD, 1.25, .35))
    ], 'actionPane', this.buildActionPane());

    var scenePane = this.entityMapper.createEntity([
      new PositionComponent(172, 32),
      new ColorComponent(Color.white),
      new ClipComponent(),
      new PolygonComponent(generatePolygon(4, 128, 45 / DEG_RAD, 1.25, 1.2))
    ], 'scenePane', this.buildScenePane());

    entities.push(controllerPane, scenePane, actionPane);

    var root = this.entityMapper.createEntity([
      new RenderRoot()
    ], 'root', entities );

    this.state.rootID = root.ID;
    this.systemProcessor.addSystem(new BackgroundSystem());
    this.systemProcessor.addSystem(new RenderingSystem());
  };

  var L1lastFrame = false;
  var R1lastFrame = false;
  this.update = function (delta) {
    this.systemProcessor.processEntities(delta);
    this.animateInput();
  };

  this.animateInput = function () {
    var leftStickPos = smx.pos(this.leftStick);
    var rightStickPos = smx.pos(this.rightStick);

    var span = 8;
    var controller = sm.input.state.controllers[1];
    if (!controller) {
      return;
    }
    var axes = controller.axes;
    setVec(leftStickPos, span * axes[0], -span * axes[1]);
    setVec(rightStickPos, span * axes[2], -span * axes[3]);

    var buttons = controller.buttons;
    var pressedButtons = [];
    buttons.forEach(function (button, i) {
      if (button.pressed) {
        pressedButtons[i] = button;
      }
    });

    if (pressedButtons[DS4.up]){
      this.padUp.components[ComponentType.color].colorB = Color.white;
    } else {
      this.padUp.components[ComponentType.color].colorB = Color.clear;
    }

    if (pressedButtons[DS4.down]){
      this.padBottom.components[ComponentType.color].colorB = Color.white;
    } else {
      this.padBottom.components[ComponentType.color].colorB = Color.clear;
    }

    if (pressedButtons[DS4.left]){
      this.padLeft.components[ComponentType.color].colorB = Color.white;
    } else {
      this.padLeft.components[ComponentType.color].colorB = Color.clear;
    }

    if (pressedButtons[DS4.right]){
      this.padRight.components[ComponentType.color].colorB = Color.white;
    } else {
      this.padRight.components[ComponentType.color].colorB = Color.clear;
    }

    if (pressedButtons[DS4.triangle]){
      this.top.components[ComponentType.color].colorB = Color.white;
    } else {
      this.top.components[ComponentType.color].colorB = Color.clear;
    }

    if (pressedButtons[DS4.cross]){
      this.bottom.components[ComponentType.color].colorB = Color.white;
    } else {
      this.bottom.components[ComponentType.color].colorB = Color.clear;
    }

    if (pressedButtons[DS4.square]){
      this.left.components[ComponentType.color].colorB = Color.white;
    } else {
      this.left.components[ComponentType.color].colorB = Color.clear;
    }

    if (pressedButtons[DS4.circle]){
      this.right.components[ComponentType.color].colorB = Color.white;
    } else {
      this.right.components[ComponentType.color].colorB = Color.clear;
    }

    if (pressedButtons[DS4.leftstick]){
      this.leftStick.components[ComponentType.color].colorB = Color.white;
    } else {
      this.leftStick.components[ComponentType.color].colorB = this.state.systemStates.background.bgColor;
    }

    if (pressedButtons[DS4.rightstick]){
      this.rightStick.components[ComponentType.color].colorB = Color.white;
    } else {
      this.rightStick.components[ComponentType.color].colorB = this.state.systemStates.background.bgColor;
    }

    if (pressedButtons[DS4.options]){
      this.start.components[ComponentType.color].colorB = Color.white;
    } else {
      this.start.components[ComponentType.color].colorB = this.state.systemStates.background.bgColor;
    }

    if (pressedButtons[DS4.share]){
      this.select.components[ComponentType.color].colorB = Color.white;
    } else {
      this.select.components[ComponentType.color].colorB = this.state.systemStates.background.bgColor;
    }

    if (pressedButtons[DS4.L2]){
      this.L2.components[ComponentType.color].colorB = Color.white;
    } else {
      this.L2.components[ComponentType.color].colorB = this.state.systemStates.background.bgColor;
    }

    if (pressedButtons[DS4.R2]){
      this.R2.components[ComponentType.color].colorB = Color.white;
    } else {
      this.R2.components[ComponentType.color].colorB = this.state.systemStates.background.bgColor;
    }

    if (pressedButtons[DS4.L1]) {
      if (!L1lastFrame) {
        this.leftTriggers.components[ComponentType.polygon].polygon = this.downPolygon;
        addVecConst(this.leftTriggers.components[ComponentType.position].position, 0, -5);
      }
      L1lastFrame = true;
    } else {
      if (L1lastFrame) {
        this.leftTriggers.components[ComponentType.polygon].polygon = this.upPolygon;
        addVecConst(this.leftTriggers.components[ComponentType.position].position, 0, 5);
      }
      L1lastFrame = false;
    }

    if (pressedButtons[DS4.R1]) {
      if (!R1lastFrame) {
        this.rightTriggers.components[ComponentType.polygon].polygon = this.downPolygon;
        addVecConst(this.rightTriggers.components[ComponentType.position].position, 0, -5);
      }
      R1lastFrame = true;
    } else {
      if (R1lastFrame) {
        this.rightTriggers.components[ComponentType.polygon].polygon = this.upPolygon;
        addVecConst(this.rightTriggers.components[ComponentType.position].position, 0, 5);
      }
      R1lastFrame = false;
    }

    if (pressedButtons[DS4.L2]) {
      var button = pressedButtons[DS4.L2];
      this.L2.components[ComponentType.polygon].polygon = generatePolygon(4, 16, Math.PI / 4, 1.85, 1 - button.value);
    } else {
      this.L2.components[ComponentType.polygon].polygon = generatePolygon(4, 16, Math.PI / 4, 1.85, 1);
    }

    if (pressedButtons[DS4.R2]) {
      button = pressedButtons[DS4.R2];
      this.R2.components[ComponentType.polygon].polygon = generatePolygon(4, 16, Math.PI / 4, 1.85, 1 - button.value);
    } else {
      this.R2.components[ComponentType.polygon].polygon = generatePolygon(4, 16, Math.PI / 4, 1.85, 1);
    }

    if (sm.conf.debug.active) {
      sm.gfx.setTextConf({ align: 'right', color: 'white', font: 'arial', style: 'normal', size: 15});
      sm.gfx.text( [
        sm.utils.formatters.float_two_pt(sm.input.state.controllers[0].axes[0]),
        sm.utils.formatters.float_two_pt(sm.input.state.controllers[0].axes[1]),
        sm.utils.formatters.float_two_pt(sm.input.state.controllers[0].axes[2]),
        sm.utils.formatters.float_two_pt(sm.input.state.controllers[0].axes[3])
      ], sm.gfx.width / 3, 0);
      sm.gfx.text(Object.keys(pressedButtons), -sm.gfx.width / 3, 0);
    }
  };

  this.buildActionPane = function () {
    var entities = [];
    // this.pressedKey = this.entityMapper.createEntity([
    //   new PolygonComponent(generatePolygon(4, 16, 45 / DEG_RAD)),
    //   new PositionComponent(),
    //   new ColorComponent(Color.white)
    // ], 'pressedKey');
    return entities;
  };
  
  this.buildScenePane = function () {
    var entities = [];

    var square = this.entityMapper.createEntity([
      new PositionComponent(0, 0),
      new PolygonComponent(generatePolygon(4, 32, 45 / DEG_RAD)),
      new ColorComponent(Color.white)
    ]);

    entities.push(square);

    entities.push(this.entityMapper.createEntity([
      new ColorComponent(Color.white),
      new PositionComponent(0, -128),
      new PolygonComponent(generatePolygon(4, 64, 45 / DEG_RAD, 4, 1))
    ]));
    return entities;
  };

  /**
   * Constructor for the controller animation geometry.
   *
   * An array of Entities.
   */
  this.buildController = function () {
    var entities = [];

    var controller_width = 612;
    var circleSize = controller_width / 12;
    var circle_offset = controller_width / 6;

    var leftHand = [];
    var directionSize = circleSize / 4;
    var placementRadius = circleSize / 2;

    this.leftTriggers = this.entityMapper.createEntity([
      new ColorComponent(Color.white),
      new PositionComponent(0, circleSize * 1.25 ),
      new PolygonComponent(generatePolygon(4, directionSize * 1.5, Math.PI / 4, 2, .25))
    ], 'L1');

    this.L2 = this.entityMapper.createEntity([
      new ColorComponent(Color.white),
      new PositionComponent(0, circleSize * 1.75),
      new PolygonComponent(generatePolygon(4, 16, Math.PI / 4, 1, 1))
    ], 'L2');

    this.padUp = this.entityMapper.createEntity([
      new ColorComponent(Color.white),
      new PositionComponent(0, placementRadius),
      new PolygonComponent(generatePolygon(4, directionSize, Math.PI / 4))
    ]);

    this.padLeft = this.entityMapper.createEntity([
      new ColorComponent(Color.white),
      new PositionComponent(-placementRadius, 0),
      new PolygonComponent(generatePolygon(4, directionSize, Math.PI / 4))
    ]);

    this.padRight = this.entityMapper.createEntity([
      new ColorComponent(Color.white),
      new PositionComponent(placementRadius, 0),
      new PolygonComponent(generatePolygon(4, directionSize, Math.PI / 4))
    ]);

    this.padBottom = this.entityMapper.createEntity([
      new ColorComponent(Color.white),
      new PositionComponent(0, -placementRadius),
      new PolygonComponent(generatePolygon(4, directionSize, Math.PI / 4))
    ]);

    leftHand.push(
        this.padUp,
        this.padLeft,
        this.padRight,
        this.padBottom,
        this.leftTriggers,
        this.L2
    );

    var leftCircle = this.entityMapper.createEntity([
      new ColorComponent(Color.white),
      new PositionComponent(- circle_offset, 0),
      new PolygonComponent(generatePolygon(32, circleSize))
    ], 'leftCirc', leftHand);

    var rightHand = [];
    var buttonSize = circleSize / 4;
    var radius = circleSize / 2;

    this.top = this.entityMapper.createEntity([
      new ColorComponent(Color.white),
      new PositionComponent(0, radius),
      new PolygonComponent(generatePolygon(32, buttonSize))
    ]);

    this.left = this.entityMapper.createEntity([
      new ColorComponent(Color.white),
      new PositionComponent(-radius, 0),
      new PolygonComponent(generatePolygon(32, buttonSize))
    ]);

    this.right = this.entityMapper.createEntity([
      new ColorComponent(Color.white),
      new PositionComponent(radius, 0),
      new PolygonComponent(generatePolygon(32, buttonSize))
    ]);

    this.bottom = this.entityMapper.createEntity([
      new ColorComponent(Color.white),
      new PositionComponent(0, -radius),
      new PolygonComponent(generatePolygon(32, buttonSize))
    ]);

    this.rightTriggers = this.entityMapper.createEntity([
      new ColorComponent(Color.white),
      new PositionComponent(0, circleSize * 1.25 ),
      new PolygonComponent(generatePolygon(4, directionSize * 1.5, Math.PI / 4, 2, .25))
    ], 'R1');

    this.R2 = this.entityMapper.createEntity([
      new ColorComponent(Color.white),
      new PositionComponent(0, circleSize * 1.75),
      new PolygonComponent(generatePolygon(4, 16, Math.PI / 4, 1, 1))
    ], 'R2');

    rightHand.push(
        this.top,
        this.left,
        this.right,
        this.bottom,
        this.rightTriggers,
        this.R2
    );

    var rightCircle = this.entityMapper.createEntity([
      new ColorComponent(Color.white),
      new PositionComponent( controller_width / 6, 0),
      new PolygonComponent(generatePolygon(32, circleSize))
    ], 'rightCirc', rightHand);

    this.leftStick = this.entityMapper.createEntity([
      new ColorComponent(Color.white, this.state.systemStates.background.bgColor),
      new PositionComponent(),
      new PolygonComponent(generatePolygon(32, circleSize * .65))
    ]);

    this.leftStickCircle = this.entityMapper.createEntity([
      new ColorComponent(Color.white),
      new PositionComponent(- controller_width / 12, -controller_width / 8),
      new PolygonComponent(generatePolygon(32, circleSize * .75))
    ], 'leftStickCirc', [this.leftStick]);

    this.rightStick = this.entityMapper.createEntity([
      new ColorComponent(Color.white, this.state.systemStates.background.bgColor),
      new PositionComponent(),
      new PolygonComponent(generatePolygon(32, circleSize * .65))
    ]);

    this.rightStickCircle = this.entityMapper.createEntity([
      new ColorComponent(Color.white),
      new PositionComponent( controller_width / 12, -controller_width / 8),
      new PolygonComponent(generatePolygon(32, circleSize * .75))
    ], 'rightStickCirc', [this.rightStick]);

    this.downPolygon = generatePolygon(4, directionSize * 1.5, Math.PI / 4, 2, .05);
    this.upPolygon = generatePolygon(4, directionSize * 1.5, Math.PI / 4, 2, .25);

    this.start = this.entityMapper.createEntity([
      new ColorComponent(Color.white),
      new PositionComponent(circle_offset / 6, 0),
      new PolygonComponent(generatePolygon(4, circleSize * .25, Math.PI / 4, 1.25, .45))
    ], 'start');

    this.select = this.entityMapper.createEntity([
      new ColorComponent(Color.white),
      new PositionComponent(-circle_offset / 6, 0),
      new PolygonComponent(generatePolygon(4, circleSize * .25, Math.PI / 4, 1.25, .45))
    ], 'select');

    entities.push(leftCircle, rightCircle, this.leftStickCircle, this.rightStickCircle, this.start, this.select);
    return entities;
  }
};