var detectAction = {
	
  hit: function detect_action_hit () { // here "this" means the "hit config object" used to set up the "hit" action

    // var detectList = [ player.item, enemy.item ] ;
    // console.log('detect_action_hit 0', 'this.detectList', this.detectList, 'this.viz', this.viz)
    var collision  = collision_detect( this.detectList, this.viz.width, this.viz.height ) ;
    // console.log('detect_action_hit 1') ;

    if (collision.list.length > 0) { // a collision between player.item and enemy.item occurred
      // console.log ('detect_attack: collision', collision) ;
      this.perform() ;
    }

  },

  add: function detect_action_add () {
    var detectActionList = $Z._detect ;
    var index = detectActionList.indexOf (this) ;
    if (index === -1) {
      detectActionList.push(this) ;
    } else {
      detectActionList[index] = this ;
    }    
  },

  remove: function detect_action_remove () {
    var detectActionList = $Z._detect ;
    var index = detectActionList.indexOf (this) ;
    if (index === -1) {
      return ; // nothing to do
    } else {
      detectActionList.splice(index, 1) ;
    }    
  },

  set: function detect_action_set () {
    // console.log('detect action set', 'this', this) ;
    $Z.detect([this]) ;
  },

  reset: function detect_action_reset () {
    // console.log('detect action reset', 'this', this) ;
    $Z.detect([]) ; // turn off detection
  },

} ;