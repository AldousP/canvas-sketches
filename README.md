# Sketch-Manager 

## Overview
Utility library for quickly creating interactive media in HTML5 canvas. Loads user defined programs which can call out to a variety of SM's modules to render polygons and text, poll for keyboard and controller input, play music and sound, and manage state. SM also exposes a Entity Component System API for use within programs which allows users to quickly compose interactive entities with children, and declare behavior using events and a finite state machine.

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
