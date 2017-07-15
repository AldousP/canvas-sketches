'use strict';

var Actions = {
  rotate : function (entity, rot) {
    /*
     * Meta data about the action.
     * Actions are calculated dynamically with the current component value
     * so that the actions can stack, rather than overwrite each other with
     * stale state.
     */
    return {
      entityID: entity.ID,
      name : 'rotate',
      srcComp : ComponentType.rotation,
      params : {
        rot : rot
      },
      exec : function (srcComp, params) {
        // The new state for the source component.
        return {
          rotation : params.rot + srcComp.rotation
        };
      }
    }
  },
  
  move : function (entity, vec) {

  }
};
