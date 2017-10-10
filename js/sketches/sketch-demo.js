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