var playerBattleHelper = {

  health_bar: function (player) {
    if (player === undefined) {
      player = this ;
    }

    var healthbarConfig = { 

      color:  '#FF0000',
      height: 3,
      width:  player.health,
      angle:  0,
      x:      0,
      y:      0,

    } ;

    var healthbarImage  = imageHelper.create(healthbarConfig.width, healthbarConfig.height) ;

    drawHelper.rect(healthbarConfig, healthbarImage.context() ) ; // draw the non-upsampled healthbar to a canvas

    healthbarImage  = imageHelper.adjust_ratio( healthbarImage ) ;

    return healthbarImage ;

  },

setup_buttons: function fighter_helper_setup_buttons (viz, ui) {

    var button = {} ;

    button.walkLeft = {
      viz: viz, 
      image: ui.buttonSprite.left[0],
      render: drawHelper.image,    
      x: ui.buttonX[0],
      y: ui.buttonY + ui.y,
      inert: true,
      fixed: true,
    } ;
    
    button.walkRight = {
      viz: viz, 
      image: ui.buttonSprite.right[0],
      render: drawHelper.image,      
      x: ui.buttonX[1],
      y: ui.buttonY + ui.y,
      inert: true,
      fixed: true,
    } ;
    
    button.attack = {
      viz: viz, 
      image: ui.buttonSprite.attack[0],
      render: drawHelper.image,
      x: ui.buttonX[2],
      y: ui.buttonY + ui.y, 
      inert: true,
      fixed: true,
    } ;
    
    button.jump = {
      viz: viz, 
      image: ui.buttonSprite.jump[0],
      render: drawHelper.image,
      x: ui.buttonX[3],
      y: ui.buttonY + ui.y, 
      inert: true,
      fixed: true,
    } ;

    button.transition = step_transition_func('image', viz.frameDuration * 1) ;

    return button ;

  },
  setup: function player_battle_helper_setup(viz) {

    var player             = setup_element(viz, viz.playerConfig) ;
    player.level           = 0 ;
    player.update          = playerBattleHelper.update_player ;
    player.levelup         = playerBattleHelper.levelup ;
    player.paused               = false ;
    player.state                = [] ;
    player.item.responseSet.hit = playerHitHelper.setup(viz, player) ;
    player.health = 60 ;
    player.health_bar = playerBattleHelper.health_bar ;

    player.healthbar = viz.setup_item ({
      image: player.health_bar(),
      x: 16,
      y: 20,
    }) ;

    player.healthbar.add() ;

    return player ;
  },
  
  update: function player_helper_update(player) {

    if( player === undefined ) {
      player = this ;
    }

    if( player.paused === true ) {
      return ;
    }

    var transition ;

    for (var kState = 0 ; kState < player.state.length ; kState++) {
      var keyCode = player.state[kState] ;
      var state ;

        switch (keyCode) {

          case 37: // left
            state = 'l' ;
            break;
          case 38: // up
            state = 'u' ;
            break;
          case 39: // right
            state = 'r' ;
            break;
          case 40: // down
          // case 13: // enter
          // case 32: // space
            state = 'd' ;
            break;
          case 32: // space
            state = 'a' ;
            break ;

        } 

      switch(state) {

        case 'l' :

          var xMin        = -Math.floor(player.sprite.rest[0].originalCanvas.width * 0.1 - 60 ) ;
          var x           = player.item.x - player.xMove ;
          var xNew        = Math.max(xMin, x) ;
          var xTransition = player.transitionSet.x(xNew) ;      
          player.item.add_transition(xTransition) ;

          var viewXmin = -20 ;
          var viz = player.item.viz ;

          var viewTol = -150 ;
          var center = player.item.image.originalCanvas.width * 0.5 + player.item.x ;
          var dist = center - viz.viewportX - viewTol ;

          if(dist < 0 && viz.viewportX > viewXmin) {
            var viewXnew = Math.max(viewXmin, viz.viewportX + dist) ;
            var replacementSwitch = true ;
            viz.add_transition(viz.transitionSet.x(viewXnew), replacementSwitch) ;
          } 

          break ;

        case 'r' :

          var xMax        = Math.floor(player.sprite.rest[0].originalCanvas.width * 1.7) ;
          var x           = player.item.x + player.xMove ;
          var xNew        = Math.min(xMax, x) ;
          var xTransition = player.transitionSet.x(xNew) ;      
          player.item.add_transition(xTransition) ;      

          var viewXmax = 0 ;
          var viz = player.item.viz ;
          var viewTol = 10 ;
          var center = player.item.image.originalCanvas.width * 0.5 + player.item.x ;
          var dist = (viz.viewportX + viz.width) - center ;
  
          if( dist < viewTol && viz.viewportX < viewXmax ) {
            var viewXnew = Math.min(viewXmax, viz.viewportX + (viewTol - dist)) ;
            var replacementSwitch = true ;
            viz.add_transition(viz.transitionSet.x(viewXnew), replacementSwitch) ;
          }

          break ;
       
        case 'd' :

          if( transitionHelper.find('image', player.item.transition) > -1 ) {
            return ; // don't interrupt the current attack animation 
          }

          var transitionFunc ;

          if( player.transitionSet.block === undefined ) {
            transitionFunc = player.transitionSet.image ;
          } else {
            transitionFunc = player.transitionSet.block ;
          }

          var loop = animate_loop(
            player.loop.block,
            player.sprite.block,
            transitionFunc,
            function() {} // buttonpress.reset
          ) ;

          player.loop.block.position = loop.position ;
          transition                  = loop.animation ;

          var replacementSwitch = true ;
          player.item.add_transition(transition, replacementSwitch) ;

            
            break ;

        // case 'u' :

        //   var yMin        = -Math.floor(player.sprite.rest[0].originalCanvas.height * 2.5) ;
        //   var y           = player.item.y - player.yMove ;
        //   var yNew        = Math.max(yMin, y) ;
        //   var yTransition = player.transitionSet.y(yNew) ;      
        //   player.item.add_transition(yTransition) ;           

        //   var viewYmin = -200 ;
        //   var viz = player.item.viz ;
        //   var viewTol = 150 ;
        //   var center = player.item.image.originalCanvas.height * 0.5 + player.item.y ;
        //   var dist = center - viz.viewportY ; 
        //   // console.log('dist', dist, 'viewTol', viewTol, 'viz.viewportY', viz.viewportY, 'viewYmax', viewYmax) ;
  
        //   if( dist < viewTol && viz.viewportY > viewYmin ) {
        //     var viewYnew = Math.max(viewYmin, viz.viewportY - (viewTol - dist)) ;
        //     var replacementSwitch = true ;
        //     viz.add_transition(viz.transitionSet.y(viewYnew), replacementSwitch) ;
        //   }

        //   break ;  

      case 'a' :
       
        if( transitionHelper.find('image', player.item.transition) > -1 ) {
          return ; // don't interrupt the current attack animation 
        }

        if(player.fire_bullet !== undefined) {
          player.fire_bullet('bullet') ; 
        }

        var transitionFunc ;

        if( player.transitionSet.attack === undefined ) {
          transitionFunc = player.transitionSet.image ;
        } else {
          transitionFunc = player.transitionSet.attack ;
        }

        var loop = animate_loop(
          player.loop.attack,
          player.sprite.attack,
          transitionFunc,
          function() {} // buttonpress.reset

        ) ;

        player.loop.attack.position = loop.position ;
        transition                  = loop.animation ;

        var replacementSwitch = true ;
        player.item.add_transition(transition, replacementSwitch) ;

        break ;
                  
      }

    }
        
  },

    levelup: function player_helper_levelup( player ) {
      
      if( player === undefined ) {
        player = this ;
      }

      player.level++ ; // increment the level value (level-up)

      if( player.sprite['attack' + player.level] !== undefined ) {
        player.sprite.attack = player.sprite['attack' + player.level] ;
        player.spriteL.attack = player.spriteL['attack' + player.level] ;
        player.spriteR.attack = player.spriteR['attack' + player.level] ;
      }

      if( player.sprite['hit' + player.level] !== undefined ) {
        player.sprite.hit = player.sprite['hit' + player.level] ;     
        player.spriteL.hit = player.spriteL['hit' + player.level] ;     
        player.spriteR.hit = player.spriteR['hit' + player.level] ;     
      }

      if( player.sprite['jump' + player.level] !== undefined ) {
        player.sprite.jump = player.sprite['jump' + player.level] ;     
        player.spriteL.jump = player.spriteL['jump' + player.level] ;     
        player.spriteR.jump = player.spriteR['jump' + player.level] ;     
      }

      if( player.sprite['rest' + player.level] !== undefined ) {
        player.sprite.rest = player.sprite['rest' + player.level] ;     
        player.spriteL.rest = player.spriteL['rest' + player.level] ;     
        player.spriteR.rest = player.spriteR['rest' + player.level] ;     
      }

      if( player.sprite['walk' + player.level] !== undefined ) {
        player.sprite.walk = player.sprite['walk' + player.level] ;     
        player.spriteL.walk = player.spriteL['walk' + player.level] ;     
        player.spriteR.walk = player.spriteR['walk' + player.level] ;     
      }

      player.item.image = player.sprite.rest[0] ;

    },

      
} ;