'use strict';

function Pong () {
  this.conf = {
    name: 'Pong',
    description: 'Pong in SM.',
    date: '09.14.2017'
  };

  this.setup = function () {
    this.update(0, sm.gfx);

    var paddlePoly = SPoly.polySquare(64);
    SPoly.scalePoly(paddlePoly, new SVec.Vector(.55, 2.75));

    // Player paddle
    var player = this.entities.buildEntity([
	    new TransformComponent(-64, 0),
      new RenderableComponent(),
      new GameplayComponent(),
      new PolygonComponent(paddlePoly),
      new ColliderComponent(paddlePoly)
    ]);

    // AI paddle
    var AIPaddle = this.entities.buildEntity([
      new TransformComponent(256, 0),
      new RenderableComponent(),
      new GameplayComponent(),
      new PolygonComponent(paddlePoly),
      new ColliderComponent(paddlePoly)
    ]);

    // ball
    var ball = this.entities.buildEntity([
      new TransformComponent(),
      new RenderableComponent(),
      new GameplayComponent(),
      new VelocityComponent(0, 0),
      new PolygonComponent(SPoly.polyCircle(16)),
      new ColliderComponent(SPoly.polyCircle(16))
    ]);

    this.entities.tagEntity(ball.ID, 'ball');
    this.entities.tagEntity(AIPaddle.ID, 'AIPaddle');
    this.entities.tagEntity(player.ID, 'player');

    this.systems.addSystem(new PongSystem());
    this.systems.addSystem(new VelocitySystem());
    this.systems.addSystem(new RenderingSystem());
    this.systems.addSystem(new CollisionSystem());
  };

  this.update = function (delta, g) {
    g.clear("#114b53");
    for (var i = 0; i < this.systems.eventStore.events.length; i ++) {
      var event = this.systems.eventStore.events[i];
      sm.gfx.text(event.type, -64, 64 - (32 * i));
      sm.gfx.text(
        '[' + event.eventID + '] '
        + event.targetID + ' -> '
        + event.data.collider,
        -58, 64 - (32 * i) - 16);
    }
    this.systems.process(this.entities, delta);
  };
}