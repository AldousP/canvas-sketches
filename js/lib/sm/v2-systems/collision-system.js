function CollisionSystem () {
	this.name = 'collision';

	this.filter = [
		ComponentType.transform,
		ComponentType.collider
	];
	
	this.process = function (entities, fire) {
	  var col, pos;

	  // Each entity in the root list compares against each in the list excluding itself
	  entities.forEach(function (entity) {
	    col = entity.components[ComponentType.collider].volume;
	    pos = entity.components[ComponentType.transform].position;
	    if (col && pos) {
	      var poly_axes = [];
	      var poly_overlaps = [];
        var ptA, ptB, edge, normal;

        if (col && pos) {
          // Get the axes for this entity.
          for (var i = 0; i < col.pts.length; i++) {
            ptA = col.pts[i];
            ptB = col.pts[SMath.wrapIndex(i + 1, col.pts.length)];
            edge = SVec.subVecVec(SVec.cpyVec(ptA), ptB);
            normal = SVec.cpyVec(edge);
            SVec.setVec(normal, -edge.y, edge.x);
            SVec.normVec(normal);
            poly_axes.push(normal);
          }


          var collider_axes;

          // Proceed to check against each entity in the list.
          entities.forEach(function (collider) {
            poly_overlaps = [];
            collider_axes = [];
            if (collider.ID !== entity.ID) {
              var collider_col = entity.components[ComponentType.collider].volume;
              var collider_pos = entity.components[ComponentType.transform].position;

              // Get the axes for this collider that we're checking against the entity.
              if (collider_col && collider_pos) {
                for (var i = 0; i < collider_col.pts.length; i++) {
                  ptA = collider_col.pts[i];
                  ptB = collider_col.pts[SMath.wrapIndex(i + 1, collider_col.pts.length)];
                  edge = SVec.subVecVec(SVec.cpyVec(ptA), ptB);
                  normal = SVec.cpyVec(edge);
                  SVec.setVec(normal, -edge.y, edge.x);
                  SVec.normVec(normal);
                  collider_axes.push(normal);
                }
              }
              
              poly_axes.forEach(function (axe) {
                var proj1 = SPoly.project(col, axe);
                var proj2 = SPoly.project(collider_col, axe);
                var overlap = SVec.overlap(proj1, proj2);
                poly_overlaps.push(overlap);
              });

              collider_axes.forEach(function (axe) {
                var proj1 = SPoly.project(col, axe);
                var proj2 = SPoly.project(collider_col, axe);
                var overlap = SVec.overlap(proj1, proj2);
                poly_overlaps.push(overlap);
              })
            }

            if (poly_overlaps.length) {
              console.log(entity.ID, 'colliding with', collider.ID);
            }
          });
        }
      }
    });
	};

  var getComp = function (entity, type) {
		return entity.components[type];
	};
}