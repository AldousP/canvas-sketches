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

    // // AI paddle
    // var AIPaddle = this.entities.buildEntity([
    //   new TransformComponent(256, 0),
    //   new RenderableComponent(),
    //   new GameplayComponent(),
    //   new PolygonComponent(paddlePoly),
    //   new ColliderComponent(paddlePoly)
    // ]);

    // ball
    var ball = this.entities.buildEntity([
      new TransformComponent(),
      new RenderableComponent(),
      new GameplayComponent(),
      // new VelocityComponent(.1, .1),
      new PolygonComponent(SPoly.polyCircle(16)),
      new ColliderComponent(SPoly.polySquare(32))
    ]);

    this.entities.tagEntity(ball.ID, 'ball');
    // this.entities.tagEntity(AIPaddle.ID, 'AIPaddle');
    this.entities.tagEntity(player.ID, 'player');

    this.systems.addSystem(new PongSystem());
    this.systems.addSystem(new VelocitySystem());
    this.systems.addSystem(new RenderingSystem());
    this.systems.addSystem(new CollisionSystem());
  };

  var poly = SPoly.polySquare(32);
  var polyPos = new SVec.Vector(32, 32);
  var polyB = SPoly.polySquare(48);
  var polyPosB = new SVec.Vector(-128, 64);

  this.update = function (delta, g) {
    g.clear("#114b53");
    this.systems.process(this.entities, delta);
    //
    // var axes = [];
    // var overlaps = [];
    // SVec.setVecVec(polyPos, sm.input.state.cursor);
    // poly.pts.forEach(function (pt, index) {
    //   SVec.rotVec(pt, Math.PI / 8 * delta);
    //   var ptA = SVec.cpyVec(pt);
    //   var ptB = SVec.cpyVec(poly.pts[SMath.wrapIndex(index + 1, poly.pts.length)]);
    //   var edge = SVec.subVecVec(SVec.cpyVec(ptA), ptB);
    //   var norm = SVec.cpyVec(edge);
    //   SVec.perp(norm);
    //   sm.gfx.drawVec(norm);
    //   axes.push(norm);
    // });
    //
    // polyB.pts.forEach(function (pt, index) {
    //   var ptA = SVec.cpyVec(pt);
    //   var ptB = SVec.cpyVec(polyB.pts[SMath.wrapIndex(index + 1, polyB.pts.length)]);
    //   var edge = SVec.subVecVec(SVec.cpyVec(ptA), ptB);
    //   var norm = SVec.cpyVec(edge);
    //   SVec.perp(norm);
    //   sm.gfx.drawVec(norm);
    //   axes.push(norm);
    // });
    //
    // var project = function (poly, pos, axis) {
    //   var axis_norm = SVec.normVec(SVec.cpyVec(axis));
    //   var min, max;
    //   for (var i = 0; i < poly.pts.length; i++) {
    //     var proj = SVec.dot(SVec.addVecVec(SVec.cpyVec(poly.pts[i]), pos), axis_norm);
    //     if (!min) {
    //       min = proj;
    //       max = proj;
    //     } else {
    //       if (proj < min) {
    //         min = proj;
    //       } else if (proj > max) {
    //         max = proj;
    //       }
    //     }
    //   }
    //   return new SVec.Vector(min, max);
    // };
    //
    // var gap_found;
    // axes.forEach(function (axis) {
    //   var proj_1 = project(poly, polyPos, axis);
    //   var proj_2 = project(polyB, polyPosB, axis);
    //   var overlap = SVec.overlap(proj_1, proj_2);
    //   if (overlap.len === 0) {
    //     gap_found = true;
    //   } else {
    //     overlaps.push(overlap);
    //   }
    //
    //   var proj_pt_A = SVec.setMag(SVec.cpyVec(axis), proj_1.x);
    //   var proj_pt_B = SVec.setMag(SVec.cpyVec(axis), proj_1.y);
    //   var proj_pt_C = SVec.setMag(SVec.cpyVec(axis), proj_2.x);
    //   var proj_pt_D = SVec.setMag(SVec.cpyVec(axis), proj_2.y);
    //   sm.gfx.setStrokeColor(sc.color.orange);
    //   sm.gfx.drawLineVec(proj_pt_A, proj_pt_B);
    //   sm.gfx.drawLineVec(proj_pt_C, proj_pt_D);
    // });
    //
    // var colliding = !gap_found;
    // if (colliding) {
    //   sm.gfx.setStrokeColor(sc.color.orange);
    // } else {
    //   sm.gfx.setStrokeColor(sc.color.white);
    // }
    //
    // sm.gfx.drawPolygon(poly, polyPos);
    // sm.gfx.drawPolygon(polyB, polyPosB);
  };
}