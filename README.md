# Sketch-Manager 

Demos of rendering to a canvas mounted to a Sketch Manager (SM) context.

```JavaScript
/*
 * Begins sm and renders output to the specified <canvas> element.
 */
sm.init('canvas-id'); 

/*
 * Loads program.
 */
sm.loadProgram(new SampleProgram());
```

## Programs
Programs contain user-defined code which can render to the canvas via sm.gfx, a series of utilities
for faster drawing, and sm.ctx, which exposes the raw 2D rendering context of the canvas. Programs may leverage
other modules such as sm.sfx for sound rendering and sm.log for logging to the in-canvas debug console.

A simple program can be seen below.

```JavaScript
var SampleProgram = function () {


  this.state = {
    meta : {
      name : 'A Simple Program',
      date : '01.01.70',
      description : "A demonstration of a program definition."
    }
  };
  
  this.update = function (delta) {
    sm.gfx.clear(this.state.bgColor);
    sm.gfx.setStrokeColor(Color.white);
    sm.gfx.text(true, this.state.meta.description, 0, -sm.gfx.height / 2.5 + 24, 12, 'Arial');
  }
};

```

***

## Example Visualized

```javascript
var Boxes = function () {
  this.state = {
    meta : {
      name : 'Boxes',
      date : '2017',
      description : 'Box Grid.'
    },
    systemStates : {
      background : {
        bgColor: '#c3667c'
      }
    },
    entityCountX : 6,
    entityCountY : 6
  };

  this.setup = function () {
    this.systemProcessor.addSystem(new BackgroundSystem());
    this.systemProcessor.addSystem(new MovementSystem());
    this.systemProcessor.addSystem(new PathSystem());
    this.systemProcessor.addSystem(new SequenceSystem());
    this.systemProcessor.addSystem(new RenderingSystem());

    var entities = [];
    var offsetX = sm.gfx.width / 6;
    var offsetY = sm.gfx.height / 3;

    for (var i = 0; i < this.state.entityCountX; i++) {
      for (var j = 0; j < this.state.entityCountY; j++) {
        var child = this.entityMapper.createEntity([
          new ColorComponent(Color.white),
          new RotationComponent(0),
          new PositionComponent(-offsetX + i * 48, -offsetY + j * 48),
          new PolygonComponent(generatePolygon(4, 32, Math.PI / 4))
        ], 'random entity #' + i);
        entities.push(child);
      }
    }

    entities.push(this.entityMapper.createEntity([
      new SequenceComponent({ length: 2.5, pos: 0 }),
      new ColorComponent(Color.green),
      new PositionComponent(0, 0),
      new PathComponent([
        new Vector(0, 0),
        new Vector(0, 96),
        new Vector(48, 96),
        new Vector(48, 0),
        new Vector(-96, 0),
        new Vector(-96, -96),
        new Vector(96, -96),
        new Vector(96, 48),
        new Vector(-48, 48),
        new Vector(-48, 0),
        new Vector(0, 0)
      ])
    ], 'path'));

    entities.push(this.entityMapper.createEntity([
      { name: 'ball' },
      new PositionComponent(0, 0),
      new ColorComponent(Color.cyan, Color.cyan),
      new PolygonComponent(generatePolygon(32, 6, 0))
    ], 'ball'));

    this.entityMapper.createEntity([
      new ColorComponent(Color.white),
      new PositionComponent(0, 0),
      new RotationComponent(0),
      new PolygonComponent(generatePolygon(4, 128, Math.PI / 4,  3.75, 1.75)),
      new ClipComponent(),
      new RenderRoot()
    ], 'root', entities);

  };
  
  this.onResize = function (isMobile) {

  };

  this.update = function (delta) {
    this.systemProcessor.processEntities(this.state, delta);
  }
};
```

<img src="http://i.imgur.com/zWtRitW.png" width="312" />
