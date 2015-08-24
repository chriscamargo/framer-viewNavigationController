class exports.ViewNavigationController extends Layer
		
	constructor: (options={}) ->
		options.width ?= Screen.width
		options.height ?= Screen.height
		options.clip ?= true
		options.animationOptions ?= curve: "spring(400,40)"
		options.backgroundColor ?= "rgba(190,190,190,0.9)"
		super options
		
		@history = []
				
	add: (view, point = {x:0, y:0}) ->
		subLayer.ignoreEvents = true for subLayer in @subLayers
		view.ignoreEvents = false
		view.superLayer = @
		view.point = point
		view.states.add
			up:     {x: 0, y: -@height}
			right:  {x: @width, y: 0}
			down:   {x: 0, y: @height}
			left:   {x: -@width, y: 0}
		view.states.animationOptions = @animationOptions
		@current = view
		
	moveIn: (view, direction = 'default') ->
		unless view is @current
			@history.unshift
				view: @current
				direction: direction
			@current = view
			subLayer.ignoreEvents = true for subLayer in @subLayers
			view.ignoreEvents = false
			view.bringToFront()
			view.states.switchInstant direction
			view.states.switch 'default'
			@emit("change:view")
		
	moveOut: (view, direction = 'right') ->
		subLayer.ignoreEvents = false for subLayer in @subLayers
		view.states.switchInstant 'default'
		view.states.switch direction
		previous = @history[0]
		@current = previous.view
		@history.shift()
		@emit("change:view")
		
	back: ->
		if @history[0]?
			@moveOut @current, @history[0].direction, false
