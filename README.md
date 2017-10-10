# Sketch-Manager 

## Overview
Monolithic, VanillaJs canvas drawing utility. 

Loads programs which look like this:

```JavaScript
function SketchDemo() {
  this.conf = {
    name: 'Sketch Demo',
    description: 'A basic scene in SM.',
    date: '08.13.2017'
  };

  var BG_COLOR = SColor.colorForHex("#933f5f");

  this.setup = function () {
    this.update(0, sm.gfx);

    this.entities.buildEntity([
      new TransformComponent(0, 0),
      new RenderableComponent(),
      new RenderRoot(),
      new PolygonComponent(SPoly.polySquare(64), SColor.colorFromColor(sc.color.white))
    ]);
    
   this.systems.addSystem(new RenderingSystem());
  };

  /**
   * Perform frame by frame behavior.
   * @param delta elapsed time since last frame
   * @param g, shorthand reference to sm.gfx.
   */
  this.update = function (delta, g) {
    g.clear(BG_COLOR);
    this.systems.process(this.entities, delta);
  };
}
```

Which take advantage of provided classes and managing geometry, scene-entities, and handling inputs.

sm lives in the window as ```sm``` it contains the following modules:

conf
time
canvas
input
log
gfx
music
sfx

In addition to the following methods:

init()
loadProgram()
unloadProgram()
toggleDebug()
togglePause()


To initialize sm, run ```sm.init```. sm will bind to the provided canvas target and renders the contents of its idle console or the active program. 

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
