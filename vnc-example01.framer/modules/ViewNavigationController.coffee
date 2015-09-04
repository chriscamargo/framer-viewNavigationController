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
		options.animationOptions ?= curve: "bezier-curve(.2, 1, .2, 1)", time: .6
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


	### ANIMATIONS ###

	switchInstant: (view) -> @fadeIn view, time: 0

	slideInDown: (view, animationOptions = @animationOptions) -> 
		return unless @readyToAnimate view

		view.y = -@height
		animProperties =
			properties:
				y: if view.originalPoint? then view.originalPoint.y else 0
		@applyAnimation view, animProperties, animationOptions

	slideInUp: (view, animationOptions = @animationOptions) ->
		return unless @readyToAnimate view

		view.y = @height
		animProperties =
			properties:
				y: if view.originalPoint? then view.originalPoint.y else 0
		@applyAnimation view, animProperties, animationOptions

	slideInRight: (view, animationOptions = @animationOptions) ->
		return unless @readyToAnimate view

		view.x = @width
		animProperties =
			properties:
				x: if view.originalPoint? then view.originalPoint.x else 0
		@applyAnimation view, animProperties, animationOptions

	slideInLeft: (view, animationOptions = @animationOptions) ->
		return unless @readyToAnimate view

		view.x = -@width
		animProperties =
			properties:
				x: if view.originalPoint? then view.originalPoint.x else 0
		@applyAnimation view, animProperties, animationOptions

	fadeIn: (view, animationOptions = @animationOptions) ->
		return unless @readyToAnimate view

		view.opacity = 0
		view.x = 0
		view.y = 0
		animProperties =
			properties:
				opacity: 1
		@applyAnimation view, animProperties, animationOptions

	crossDissolve: (view, animationOptions = @animationOptions) ->
		@fadeIn view, animationOptions
			
	zoomIn: (view, animationOptions = @animationOptions) ->
		return unless @readyToAnimate view

		view.scale = 0.8
		view.opacity = 0
		animProperties =
			properties:
				scale: 1
				opacity: 1
		@applyAnimation view, animProperties, animationOptions

	zoomedIn: (view, animationOptions = @animationOptions) ->
		return unless @readyToAnimate view

		view.scale = 1.5
		view.opacity = 0
		animProperties =
			properties:
				scale: 1
				opacity: 1
		@applyAnimation view, animProperties, animationOptions

	flipInRight: (view, animationOptions = @animationOptions) ->
		return unless @readyToAnimate view

		view.x = @width/2
		view.rotationY = 100
		view.z = 800
		animProperties =
			properties:
				x: if view.originalPoint? then view.originalPoint.x else 0
				rotationY: 0
				z: 0
		@applyAnimation view, animProperties, animationOptions

	flipInLeft: (view, animationOptions = @animationOptions) ->
		return unless @readyToAnimate view

		view.x = -@width/2
		view.rotationY = -100
		view.z = 800
		animProperties =
			properties:
				x: if view.originalPoint? then view.originalPoint.x else 0
				rotationY: 0
				z: 0
		@applyAnimation view, animProperties, animationOptions

	flipInUp: (view, animationOptions = @animationOptions) ->
		return unless @readyToAnimate view

		view.y = @height
		view.rotationX = -100
		view.z = 800
		animProperties =
			properties:
				y: if view.originalPoint? then view.originalPoint.y else 0
				rotationX: 0
				z: 0
		@applyAnimation view, animProperties, animationOptions
		
	spinIn: (view, animationOptions = @animationOptions) ->
		return unless @readyToAnimate view

		view.opacity = 0
		view.scale = 0.8
		view.rotation = 180
		animProperties =
			properties:
				opacity: 1
				scale: 1
				rotation: 0
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