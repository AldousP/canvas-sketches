# Sketch-Manager 

## Overview
Monolithic, VanillaJs canvas drawing utility. 

Loads programs which look like this:

```JavaScript
function SketchDemo() {
  this.conf = {
    name: 'Sketch Demo',
    description: 'A basic scene in SM.',
    date: '01.01.20XX'
  };

  var BG_COLOR = SColor.colorForHex("#933f5f");

  this.setup = function () {
    this.update(0, sm.gfx);

    this.entities.buildEntity([
      new TransformComponent(0, 0),
      new RenderableComponent(),
      new RenderRoot(),
      new PolygonComponent(
        SPoly.polySquare(64), 
        SColor.colorFromColor(sc.color.white)
      )
    ]);
    
   this.systems.addSystem(new RenderingSystem());
  };

  /**
   * Called each tick.
   * 
   * @param delta elapsed time since last frame
   * @param g, shorthand reference to sm.gfx.
   */
  this.update = function (delta, g) {
    g.clear(BG_COLOR);
    this.systems.process(this.entities, delta);
  };
}
```

Which take advantage of provided classes for creating geometry, manipulating scene-entities, and handling inputs.

sm lives in the window as ```sm``` it contains the following modules:

```JavaScript
conf
time
canvas
input
log
gfx
music
sfx
```

In addition to the following methods:

```JavaScript
init()
loadProgram()
unloadProgram()
toggleDebug()
togglePause()
```

To initialize sm, run ```sm.init```. sm will connect to the specified canvas element and render its idle console until a program is loaded.  

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

When a program is loaded, the name and description in its conf object will be emitted as a DOM event.
An event will also be fired when the program is unloaded.

```JavaScript
document.body.addEventListener('smProgramLoaded', function (event) {
  appTitle.innerText = event.detail.name;
  appDescription.innerText = event.detail.description;
});

document.body.addEventListener('smProgramUnloaded', function () {
  appTitle.innerText = 'No Program Loaded';
});
```
