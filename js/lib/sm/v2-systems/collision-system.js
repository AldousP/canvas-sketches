function CollisionSystem (config) {
  if (!config) {
    console.error('[SM][COLLISION] No config object passed.');
    return;
  }
  this.config = config;
	this.name = 'collision';
	var debug = false;

	this.filter = [
		ComponentType.transform,
		ComponentType.collider
	];

	var lastFireDelta = 0;
	var that = this;
	
	this.overlapping = function (entity, collider) {
    var axes = [];
    var overlaps = [];

    var poly = entity.components[ComponentType.collider].volume;
    var pos = entity.components[ComponentType.transform].position;

    poly.pts.forEach(function (pt, index) {
      var ptA = SVec.cpyVec(pt);
      var ptB = SVec.cpyVec(poly.pts[SMath.wrapIndex(index + 1, poly.pts.length)]);
      var edge = SVec.subVecVec(SVec.cpyVec(ptA), ptB);
      var norm = SVec.cpyVec(edge);
      SVec.perp(norm);
      axes.push(norm);
    });

    var col_poly = collider.components[ComponentType.collider].volume;
    var col_pos = collider.components[ComponentType.transform].position;
    col_poly.pts.forEach(function (pt, index) {
      var ptA = SVec.cpyVec(pt);
      var ptB = SVec.cpyVec(col_poly.pts[SMath.wrapIndex(index + 1, col_poly.pts.length)]);
      var edge = SVec.subVecVec(SVec.cpyVec(ptA), ptB);
      var norm = SVec.cpyVec(edge);
      SVec.perp(norm);
      axes.push(norm);
    });

    var gap_found = false;
    axes.forEach(function (axis) {
      var proj_1 = SPoly.project(poly, pos, axis);
      var proj_2 = SPoly.project(col_poly, col_pos, axis);
      var overlap = SVec.overlap(proj_1, proj_2);
      if (overlap.len === 0) {
        gap_found = true;
      } else {
        overlaps.push(overlap);
      }
    });

    return !gap_found;
  };

	this.process = function (entities, fire, delta, mapper) {
	  lastFireDelta += delta;

    if (lastFireDelta > this.config.debounce_interval) {
	    lastFireDelta = 0;
    } else {
	    return;
    }

    var entity;
    var tag_index;
    var mapKeys = Object.keys(this.config.collision_map);
    var listeners;
    var collider;
    for (var i = 0; i < entities.length; i++) {
      entity = entities[i];
      for (var j = 0; j < mapKeys.length; j++) {
        tag_index = entity.tags.indexOf(mapKeys[j]);
        if (tag_index > -1) {
          listeners  = this.config.collision_map[mapKeys[j]];
          var listeners_keys = Object.keys(listeners);
          for (var k = 0; k < entities.length; k++) {
            collider = entities[k];
            if (collider.ID !== entity.ID) {
              for (var ll = 0; ll < listeners_keys.length; ll++) {
                if (collider.tags.indexOf(listeners_keys[ll]) !== -1) {
                  if (this.overlapping(entity, collider)) {
                    fire(entity.ID, listeners[listeners_keys[ll]], {
                      collider: collider.ID
                    });
                  }
                }
              }
            }
          }
        }
      }
    }
	};
}