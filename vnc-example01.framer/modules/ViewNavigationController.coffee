# TODO:
# Add custom animationOptions to .back()?
# Add "moveOut" animations? what's the use case? covered by back?
# If no need for moveOut, maybe we wont need consistent "In" naming scheme

class exports.ViewNavigationController extends Layer
		
	constructor: (options={}) ->
		options.width ?= Screen.width
		options.height ?= Screen.height
		options.clip ?= true
		options.initialViewName ?= 'initialView'
		options.animationOptions ?= curve: "cubic-bezier(0.19, 1, 0.22, 1)", time: .7
		options.backgroundColor ?= "rgba(190,190,190,0.9)"
		options.perspective ?= 1000

		super options
		@history = []
		@on "change:subLayers", (changeList) ->
			if changeList.added[0].name is options.initialViewName
				@switchInstant changeList.added[0]
			else
				changeList.added[0].x = @width

	add: (view, point = {x:0, y:0}, viaInternalChangeEvent = false) ->
		if viaInternalChangeEvent
			@switchInstant view
		else
			view.superLayer = @
		view.on Events.Click, -> return # prevent click-through/bubbling
		view.originalPoint = point
		view.point = point

	readyToAnimate: (view) ->
		if view isnt @current
			if @subLayers.indexOf(view) is -1
				@add view
			return true
		else
			return false

		
	saveCurrentToHistory: (animation) ->
		@history.unshift
			view: @current
			animation: animation

	back: -> 
		previous = @history[0]
		if previous.view?

			animProperties = 
				layer: previous.view
				properties:
					x: if previous.view.originalPoint? then previous.view.originalPoint.x else 0
					y: if previous.view.originalPoint? then previous.view.originalPoint.y else 0
					scale: 1
					brightness: 100

			animation = new Animation animProperties
			animation.options.curveOptions = previous.animation.options.curveOptions
			animation.start()
	
			anim = previous.animation
			backwards = anim.reverse()
			backwards.start()
			@current = previous.view
			@history.shift()
			backwards.on Events.AnimationEnd, =>
				@current.bringToFront()

	applyAnimation: (view, animProperties, animationOptions) ->
		unless view is @current
			obj = layer: view
			_.extend obj, animProperties, animationOptions
			animation = new Animation obj
			animation.start()
			@saveCurrentToHistory animation
			@current = view
			@current.bringToFront()

	applyAnimation2: (view, animProperties, animationOptions) ->
		return unless @readyToAnimate view
		unless view is @current
			_.extend view, animProperties.from
			obj = 
				layer: view
				properties: {}
			_.extend obj.properties, animProperties.to
			_.extend obj, animationOptions
			animation = new Animation obj
			animation.start()
			@saveCurrentToHistory animation
			@current = view
			@current.bringToFront()


	### ANIMATIONS ###

	switchInstant: (view) -> @fadeIn view, time: 0


	slideInLeft: (view, animationOptions = @animationOptions) -> 
		animationProperties =
			from:
				x: -@width
			to:
				x: if view.originalPoint? then view.originalPoint.x else 0

		@applyAnimation2 view, animationProperties, animationOptions

	slideInRight: (view, animationOptions = @animationOptions) -> 
		animationProperties =
			from:
				x: @width
			to:
				x: if view.originalPoint? then view.originalPoint.x else 0

		@applyAnimation2 view, animationProperties, animationOptions

	slideInDown: (view, animationOptions = @animationOptions) -> 
		animationProperties =
			from:
				y: -@height
				x: 0
			to:
				y: if view.originalPoint? then view.originalPoint.y else 0

		@applyAnimation2 view, animationProperties, animationOptions

	slideInUp: (view, animationOptions = @animationOptions) ->
		animationProperties =
			from:
				y: @height
				x: 0
			to:
				y: if view.originalPoint? then view.originalPoint.y else 0

		@applyAnimation2 view, animationProperties, animationOptions

	fadeIn: (view, animationOptions = @animationOptions) ->
		animationProperties =
			from:
				y: 0
				x: 0
				opacity: 0
			to:
				opacity: 1

		@applyAnimation2 view, animationProperties, animationOptions

	crossDissolve: (view, animationOptions = @animationOptions) ->
		@fadeIn view, animationOptions
			
	zoomIn: (view, animationOptions = @animationOptions) ->
		animationProperties =
			from:
				x: 0
				y: 0
				scale: 0.8
				opacity: 0
			to:
				scale: 1
				opacity: 1

		@applyAnimation2 view, animationProperties, animationOptions

	zoomedIn: (view, animationOptions = @animationOptions) ->
		animationProperties =
			from:
				x: 0
				y: 0
				scale: 1.5
				opacity: 0
			to:
				scale: 1
				opacity: 1

		@applyAnimation2 view, animationProperties, animationOptions

	flipInRight: (view, animationOptions = @animationOptions) ->
		animationProperties =
			from:
				x: @width/2
				z: 800
				rotationY: 100
			to:
				x: if view.originalPoint? then view.originalPoint.x else 0
				rotationY: 0
				z: 0
		@applyAnimation2 view, animationProperties, animationOptions

	flipInLeft: (view, animationOptions = @animationOptions) ->
		animationProperties =
			from:
				x: -@width/2
				z: 800
				rotationY: -100
			to:
				x: if view.originalPoint? then view.originalPoint.x else 0
				rotationY: 0
				z: 0
		@applyAnimation2 view, animationProperties, animationOptions

	flipInUp: (view, animationOptions = @animationOptions) ->
		animationProperties =
			from:
				x: 0
				z: 800
				y: @height
				rotationX: -100
			to:
				y: if view.originalPoint? then view.originalPoint.y else 0
				rotationX: 0
				z: 0

		@applyAnimation2 view, animationProperties, animationOptions
		
	spinIn: (view, animationOptions = @animationOptions) ->

		animationProperties =
			from:
				x: 0
				y: 0
				rotation: 180
				scale: 0.8
				opacity: 0
			to:
				scale: 1
				opacity: 1
				rotation: 0

		@applyAnimation2 view, animationProperties, animationOptions

	iosPushInRight: (view, animationOptions = @animationOptions) ->
		return unless @readyToAnimate view
		move =
			layer: @current
			properties:
				x: -(@width/5)
				brightness: 90
		_.extend move, animationOptions
		moveOut = new Animation move
		moveOut.start()

		view.x = @width
		animProperties =
			properties:
				x: if view.originalPoint? then view.originalPoint.x else 0
		@applyAnimation view, animProperties, animationOptions

	pushInRight: (view, animationOptions = @animationOptions) ->
		return unless @readyToAnimate view
		move =
			layer: @current
			properties:
				x: -@width
		_.extend move, animationOptions
		moveOut = new Animation move
		moveOut.start()

		view.x = @width
		animProperties =
			properties:
				x: if view.originalPoint? then view.originalPoint.x else 0
		@applyAnimation view, animProperties, animationOptions

	pushInLeft: (view, animationOptions = @animationOptions) ->
		return unless @readyToAnimate view
		move =
			layer: @current
			properties:
				x: @width
		_.extend move, animationOptions
		moveOut = new Animation move
		moveOut.start()

		view.x = -@width
		animProperties =
			properties:
				x: if view.originalPoint? then view.originalPoint.x else 0
		@applyAnimation view, animProperties, animationOptions

	pushInUp: (view, animationOptions = @animationOptions) ->
		return unless @readyToAnimate view
		move =
			layer: @current
			properties:
				y: -@height
		_.extend move, animationOptions
		moveOut = new Animation move
		moveOut.start()

		view.x = 0
		view.y = @height
		animProperties =
			properties:
				y: if view.originalPoint? then view.originalPoint.y else 0
		@applyAnimation view, animProperties, animationOptions

	pushInDown: (view, animationOptions = @animationOptions) ->
		return unless @readyToAnimate view
		move =
			layer: @current
			properties:
				y: @height
		_.extend move, animationOptions
		moveOut = new Animation move
		moveOut.start()
		
		view.x = 0
		view.y = -@height
		animProperties =
			properties:
				y: if view.originalPoint? then view.originalPoint.y else 0
		@applyAnimation view, animProperties, animationOptions

	appleMail: (view, animationOptions = @animationOptions) ->
		return unless @readyToAnimate view
		move =
			layer: @current
			properties:
				scale: 0.8
		_.extend move, animationOptions
		moveOut = new Animation move
		moveOut.start()

		view.y = @height
		view.x = 0
		animProperties =
			properties:
				y: if view.originalPoint? then view.originalPoint.y else 100
		@applyAnimation view, animProperties, animationOptions

	# Backwards compatibility
	transition: (view, direction = 'right') ->
		switch direction
			when 'up' then @pushInDown view
			when 'right' then @pushInRight view
			when 'down' then @pushInUp view
			when 'left' then @pushInLeft view