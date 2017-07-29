var InputDemos = function () {
  this.state = {
    assets: 'assets',
    meta : {
      name : 'Input Demos',
      date : '07.27.2017',
      description : 'Input Tests (Connect a controller)'
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

    var controller = this.entityMapper.createEntity([
        new PositionComponent(0, 0)
    ], 'controller', this.buildController());

    entities.push(controller);

    var root = this.entityMapper.createEntity([
      new PositionComponent(),
      new RenderRoot()
    ], 'root', entities );

    this.state.rootID = root.ID;

    this.systemProcessor.addSystem(new BackgroundSystem());
    this.systemProcessor.addSystem(new RenderingSystem());
  };


  this.update = function (delta) {
    this.systemProcessor.processEntities(delta);

    var leftStickPos = smx.pos(this.leftStick);
    var rightStickPos = smx.pos(this.rightStick);

    var span = 8;
    var controller = sm.input.state.controllers[0];
    var axes = controller.axes;
    setVec(leftStickPos, span * axes[0], -span * axes[1]);
    setVec(rightStickPos, span * axes[2], -span * axes[3]);

    if (sm.conf.debug.active) {
      sm.gfx.setTextConf({ align: 'right', color: 'white', font: 'arial', style: 'normal', size: 15});

      sm.gfx.text( [
        sm.utils.formatters.float_two_pt(sm.input.state.controllers[0].axes[0]),
        sm.utils.formatters.float_two_pt(sm.input.state.controllers[0].axes[1]),
        sm.utils.formatters.float_two_pt(sm.input.state.controllers[0].axes[2]),
        sm.utils.formatters.float_two_pt(sm.input.state.controllers[0].axes[3])
      ], sm.gfx.width / 3, 0);
    }


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


    var leftHand = [];
    var directionSize = circleSize / 4;
    var placementRadius = circleSize / 2;

    this.padUp = this.entityMapper.createEntity([
      new ColorComponent(Color.white),
      new PositionComponent(0, placementRadius),
      new PolygonComponent(generatePolygon(32, directionSize))
    ]);

    this.padLeft = this.entityMapper.createEntity([
      new ColorComponent(Color.white),
      new PositionComponent(-placementRadius, 0),
      new PolygonComponent(generatePolygon(32, directionSize))
    ]);

    this.padRight = this.entityMapper.createEntity([
      new ColorComponent(Color.white),
      new PositionComponent(placementRadius, 0),
      new PolygonComponent(generatePolygon(32, directionSize))
    ]);

    this.padBottom = this.entityMapper.createEntity([
      new ColorComponent(Color.white),
      new PositionComponent(0, -placementRadius),
      new PolygonComponent(generatePolygon(32, directionSize))
    ]);

    leftHand.push(
        this.padUp,
        this.padLeft,
        this.padRight,
        this.padBottom
    );

    var leftCircle = this.entityMapper.createEntity([
      new ColorComponent(Color.white),
      new PositionComponent(- controller_width / 6, 0),
      new PolygonComponent(generatePolygon(32, circleSize))
    ], 'leftCirc', leftHand);

    var rightHand = [];
    var buttonSize = circleSize / 4;
    var radius = circleSize / 2;

    var top = this.entityMapper.createEntity([
      new ColorComponent(Color.white),
      new PositionComponent(0, radius),
      new PolygonComponent(generatePolygon(32, buttonSize))
    ]);

    var left = this.entityMapper.createEntity([
      new ColorComponent(Color.white),
      new PositionComponent(-radius, 0),
      new PolygonComponent(generatePolygon(32, buttonSize))
    ]);

    var right = this.entityMapper.createEntity([
      new ColorComponent(Color.white),
      new PositionComponent(radius, 0),
      new PolygonComponent(generatePolygon(32, buttonSize))
    ]);

    var bottom = this.entityMapper.createEntity([
      new ColorComponent(Color.white),
      new PositionComponent(0, -radius),
      new PolygonComponent(generatePolygon(32, buttonSize))
    ]);

    rightHand.push(top, left, right, bottom);

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

    var leftStickCircle = this.entityMapper.createEntity([
      new ColorComponent(Color.white),
      new PositionComponent(- controller_width / 12, -controller_width / 8),
      new PolygonComponent(generatePolygon(32, circleSize * .75))
    ], 'leftCirc', [this.leftStick]);

    this.rightStick = this.entityMapper.createEntity([
      new ColorComponent(Color.white, this.state.systemStates.background.bgColor),
      new PositionComponent(),
      new PolygonComponent(generatePolygon(32, circleSize * .65))
    ]);

    var rightStickCircle = this.entityMapper.createEntity([
      new ColorComponent(Color.white),
      new PositionComponent( controller_width / 12, -controller_width / 8),
      new PolygonComponent(generatePolygon(32, circleSize * .75))
    ], 'rightCirc', [this.rightStick]);

    entities.push(leftCircle, rightCircle, leftStickCircle, rightStickCircle);
    return entities;
  }
};