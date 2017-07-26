'use strict';

function RenderingSystem(ID) {
  this.ID = ID;
  this.name = 'rendering';

  this.init = function (state) {
    state.sheetCache = {};
  };

  this.loadData = function (anim, state) {
    anim.loaded = true;
    var handle = anim.handle;
    var strippedHandle = (handle.substring(handle.lastIndexOf('/') + 1, handle.lastIndexOf('.')));
    anim.imgHandle = strippedHandle;
    if (!state.sheetCache[strippedHandle]) {
      var assetLocation = state.assets + handle;
      var rootLoc = assetLocation.substring(0, assetLocation.lastIndexOf('/'));
      fetch(assetLocation).then(function (resp) {return resp.json()})
      .then( function (data) {
        var imgAsset = rootLoc + '/' + data.meta.image;
        anim.frames = data.frames;
        var img = new Image();
        img.src = imgAsset;
        img.onload = function () {
          state.sheetCache[strippedHandle] = img;
        }
      })
    }
  };

  this.processEntity = function (entity, state, delta, entities, recursion) {
    var renderRoot = smx.renderRoot(entity);
    if (!renderRoot && !recursion) return 0;

    if (!recursion) {
      state.renderData = {
        positionSum : new Vector(),
        rotationSum : 0
      };
    } else {
      if (renderRoot) {
        sm.log.error('Redundant RenderRoot component found on [' + entity.ID + ']' + entity.name + ' expect bugs.')
      }
    }

    var pos = smx.pos(entity);
    var poly = smx.poly(entity);
    var rot = smx.rot(entity);
    var col = smx.col(entity);
    var colB = smx.colB(entity);
    var clip = smx.clip(entity);
    var children = smx.children(entity);
    var cam = smx.cam(entity);
    var text = smx.text(entity);
    var anim = smx.anim(entity);

    var priorPos = cpyVec(state.renderData.positionSum);
    var priorRot = state.renderData.rotationSum;

    if (rot) {
      state.renderData.rotationSum += rot;
    }

    if (pos) {
      addVecVec(state.renderData.positionSum,  rotVec(cpyVec(pos), priorRot ? priorRot : 0));
    }

    if (rot) {
      state.renderData.priorRot = rot;
    }

    if (col) {
      sm.gfx.setStrokeColor(col);
    }

    if (clip) {
      sm.gfx.clipPoly(poly, state.renderData.positionSum, state.renderData.rotationSum);
      sm.gfx.setFillColor(colB);
      sm.gfx.drawPolygon(poly, state.renderData.positionSum, true, state.renderData.rotationSum);
      if (sm.conf.debug.active && false) {
        sm.gfx.setStrokeColor(Color.white);
        sm.gfx.drawLine(-sm.gfx.width, 0, sm.gfx.width, 0);
        sm.gfx.drawLine(0, -sm.gfx.height, 0, sm.gfx.height);
      }
    }

    if (poly && pos) {
      sm.gfx.setStrokeColor(col);
      sm.gfx.setFillColor(colB);
      sm.gfx.drawPolygon(poly, state.renderData.positionSum, colB, state.renderData.rotationSum);
    }

    if (children) {
      if (cam) {
        sm.gfx.preDraw();

        var scaleX = cam.zoom;
        var scaleY = cam.zoom;

        sm.ctx.setTransform(scaleX, 0, 0, scaleY, sm.gfx.width / 2, sm.gfx.height / 2, 320);
        sm.ctx.translate(-cam.pos.x, cam.pos.y);
      }

      for (var i = 0; i < children.length; i++) {
        sm.gfx.preDraw();
        this.processEntity(entities[children[i]], state, delta, entities, true);
        sm.gfx.postDraw();
      }
    }

    if (anim && pos) {
      if (!anim.loaded) {
        this.loadData(anim, state);
      }

      if (anim.imgHandle) {
        var image = state.sheetCache[anim.imgHandle];
        var frames = anim.frames;
        if (frames) {
          var activeFrame = Math.floor(anim.frames.length * anim.progress);
          var frame = frames[activeFrame - 1];
          if (frame) {
            frame = frame.frame;
            sm.ctx.beginPath();
            sm.gfx.preDraw();
            sm.gfx.setStrokeColor(Color.green);
            sm.ctx.rect(
                pos.x - frame.w / 2,
                -pos.y - frame.h / 2,
                frame.w,
                frame.h
            );
            sm.ctx.clip();
            sm.gfx.drawImage(
                image,
                pos.x - frame.x - frame.w / 2,
                -pos.y - frame.y - frame.h / 2,
                frame.w, frame.h,
                anim.flipped
            );
            sm.gfx.postDraw();
            sm.ctx.closePath();
          }
        }
      }
    }

    if (text && pos) {
      if (text.conf) {
        sm.gfx.setTextConf(text.conf);
      }
      sm.gfx.text(
          text.strings,
          state.renderData.positionSum.x,
          state.renderData.positionSum.y,
          state.renderData.rotationSum);
    }

    if (cam) {
      sm.gfx.postDraw();
    }


    if (pos) {
      state.renderData.positionSum = priorPos;
    }

    if (rot) {
      state.renderData.rotationSum = priorRot;
    }
  };
}