function CollisionSystem () {
	this.name = 'collision';
	var debug = false;
	var debounce_interval = .033;

	this.filter = [
		ComponentType.transform,
		ComponentType.collider
	];

	var lastFireDelta = 0;

	this.process = function (entities, fire, delta, mapper) {

	  lastFireDelta += delta;

	  if (lastFireDelta > debounce_interval) {
	    lastFireDelta = 0;
    } else {
	    return;
    }

	  var poly, pos;
	  // Each entity in the root list compares against each in the list excluding itself
	  entities.forEach(function (entity) {
	    poly = entity.components[ComponentType.collider].volume;
	    pos = entity.components[ComponentType.transform].position;

      var axes = [];
      var overlaps = [];

      poly.pts.forEach(function (pt, index) {
        var ptA = SVec.cpyVec(pt);
        var ptB = SVec.cpyVec(poly.pts[SMath.wrapIndex(index + 1, poly.pts.length)]);
        var edge = SVec.subVecVec(SVec.cpyVec(ptA), ptB);
        var norm = SVec.cpyVec(edge);
        SVec.perp(norm);
        if (debug) {
          sm.gfx.drawVec(norm);
        }
        axes.push(norm);
      });

      entities.forEach(function (collider) {
        if (collider.ID !== entity.ID) {
          var col_poly = collider.components[ComponentType.collider].volume;
          var col_pos = collider.components[ComponentType.transform].position;
          col_poly.pts.forEach(function (pt, index) {
            var ptA = SVec.cpyVec(pt);
            var ptB = SVec.cpyVec(col_poly.pts[SMath.wrapIndex(index + 1, col_poly.pts.length)]);
            var edge = SVec.subVecVec(SVec.cpyVec(ptA), ptB);
            var norm = SVec.cpyVec(edge);
            SVec.perp(norm);
            if (debug) {
              sm.gfx.drawVec(norm);
            }
            axes.push(norm);
          });

          var gap_found;
          axes.forEach(function (axis) {
            var proj_1 = SPoly.project(poly, pos, axis);
            var proj_2 = SPoly.project(col_poly, col_pos, axis);
            var overlap = SVec.overlap(proj_1, proj_2);
            if (overlap.len === 0) {
              gap_found = true;
            } else {
              overlaps.push(overlap);
            }

            var proj_pt_A = SVec.setMag(SVec.cpyVec(axis), proj_1.x);
            var proj_pt_B = SVec.setMag(SVec.cpyVec(axis), proj_1.y);
            var proj_pt_C = SVec.setMag(SVec.cpyVec(axis), proj_2.x);
            var proj_pt_D = SVec.setMag(SVec.cpyVec(axis), proj_2.y);
            if (debug) {
              sm.gfx.setStrokeColor(sc.color.orange);
              sm.gfx.drawLineVec(proj_pt_A, proj_pt_B);
              sm.gfx.drawLineVec(proj_pt_C, proj_pt_D);
            }
          });

          if (!gap_found) {
            fire(collider.ID, EventTypes.ENTITY_COLLISION, {
              collider: entity.ID
            });
            if (debug) {
              sm.gfx.setStrokeColor(sc.color.orange);
              sm.gfx.drawPolygon(poly, pos);
            }
          }
        }
      });
    });
	};

  var getComp = function (entity, type) {
		return entity.components[type];
	};
}