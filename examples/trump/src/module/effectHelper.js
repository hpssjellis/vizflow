var effectHelper = { // effect module for creating effects i.e. compositions of transitions

	flash: function effect_flash (frameDuration, Nstep, item) {

		if(item === undefined) { // assume that "this" corresponds to the element item object
			item = this ;
		}

		// console.log('effect flash', 'frameDuration', frameDuration, 'Nstep', Nstep) ;
		var create_transition = step_transition_func('render', frameDuration) ;
		// console.log('effect flash 5') ;
		var blank = function () {} ;
		var valueList = [blank, drawHelper.image] ;
		var loopConfig = {
			Nstep: Nstep,
			position: 0,
			frameDur: frameDuration,
		} ;
		// console.log('effect flash 12') ;

		var loop = animate_loop (loopConfig, valueList, create_transition) ;

		transitionHelper.add.call(item, loop.animation[0]) ;

		// console.log('effect flash', 'loop', loop) ;

		return loop ;

	},

	shake: function effect_shake(item, xKey, yKey) {

		if(item === undefined) {
			item = this ;
		}

		if(xKey === undefined) {
			xKey = 'x' ;
		}

		if(yKey === undefined) {
			yKey = 'y' ;
		}

		var xShakeMove = [1, -1, -1,  1] ; 
		var yShakeMove = [1, -1,  1, -1] ; 

		var damping = 5 ;
		var dampingFactor = 1 ;
		var Nstep = 9 ;

		xTransition = new Array(Nstep) ;
		yTransition = new Array(Nstep) ;

		for (kstep = 0 ; kstep < Nstep - 1 ; kstep++) {
			xTransition[kstep] = item.transitionSet[xKey](Math.round(Math.random() * xShakeMove[(kstep + $Z.iter) % xShakeMove.length] * damping)) ;
			yTransition[kstep] = item.transitionSet[yKey](Math.round(Math.random() * yShakeMove[(kstep + $Z.iter * 3) % xShakeMove.length] * damping)) ;
			damping *= dampingFactor ;
		}

		xTransition[kstep] = item.transitionSet[xKey](0) ;
		yTransition[kstep] = item.transitionSet[yKey](0) ;

		xTransition = transition_sequence(xTransition)[0] ;
		yTransition = transition_sequence(yTransition)[0] ;

		// console.log('xTransition', xTransition, 'yTransition', yTransition) ;

		var replacementSwitch = true ;
		item.add_transition([xTransition, yTransition]) ;

	},

	zoom_inout: function effect_zoom_inout(viz, zoomDur, shakeSwitch) {
    var viewDelta = -2 * Math.floor(viz.displayCanvas.width * 0.04) ;
    var newWidth  = viz.displayCanvas.width  + viewDelta ;
    var newHeight = viz.displayCanvas.height + viewDelta ;

    var xNew = Math.floor(viz.viewportX - 0.25 * viewDelta) ;
    var yNew = Math.floor(viz.viewportY - 0.25 * viewDelta) ;

    var zoomDur   = 0.25 * zoomDur ;
    var widthIn   = $Z.transition.rounded_linear_transition_func('viewportWidth', zoomDur)(newWidth) ;
    var heightIn  = $Z.transition.rounded_linear_transition_func('viewportHeight', zoomDur)(newHeight) ;
    var xIn       = $Z.transition.rounded_linear_transition_func('viewportX', zoomDur)(xNew) ;
    var yIn       = $Z.transition.rounded_linear_transition_func('viewportY', zoomDur)(yNew) ;
    var widthOut  = $Z.transition.rounded_linear_transition_func('viewportWidth', zoomDur)(viz.viewportWidth) ;
    var heightOut = $Z.transition.rounded_linear_transition_func('viewportHeight', zoomDur)(viz.viewportHeight) ;
    var xOut      = $Z.transition.rounded_linear_transition_func('viewportX', zoomDur)(viz.viewportX) ;
    var yOut      = $Z.transition.rounded_linear_transition_func('viewportY', zoomDur)(viz.viewportY) ;

    widthIn.child  = widthOut ;
    heightIn.child = heightOut ;
    xIn.child = xOut ;
    yIn.child = yOut ;

    widthIn.pause = 0.45 * zoomDur ;
    heightIn.pause = 0.45 * zoomDur ;
    xIn.pause = 0.45 * zoomDur ;
    yIn.pause = 0.45 * zoomDur ;

    if(shakeSwitch) {
	    widthIn.end = function() {
	      viz.shake() ;
	    }    
    }

    viz.add_transition(widthIn) ;
    viz.add_transition(heightIn) ;
    viz.add_transition(xIn) ;
    viz.add_transition(yIn) ;

	},

} ; // end effectHelper