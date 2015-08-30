# TODO:
# Add custom animationOptions to .back()?
# Add "moveOut" animations? what's the use case? covered by back?
# If no need for moveOut, maybe we wont need consistent "In" naming scheme
# add pages when trying to animate them. eg. if @subLayers.indexOf(view) is -1 then @add view

class exports.ViewNavigationController extends Layer
		
	constructor: (options={}) ->
		options.width ?= Screen.width
		options.height ?= Screen.height
		options.clip ?= true
		options.animationOptions ?= curve: "bezier-curve(.2, 1, .2, 1)", time: .6
		options.backgroundColor ?= "rgba(190,190,190,0.9)"
		options.perspective ?= 1000

		super options
		@history = []
				
	add: (view, point = {x:0, y:0}) ->
		view.superLayer = @
		view.on Events.Click, -> return # prevent click-through/bubbling
		view.originalPoint = point
		view.point = point
		@current = view
		
	saveCurrentToHistory: (animation) ->
		@history.unshift
			view: @current
			animation: animation

	back: -> 
		previous = @history[0]
		if previous.view?
			anim = previous.animation
			backwards = anim.reverse()
			backwards.start()
			@current = previous.view
			@history.shift()
			backwards.on Events.AnimationEnd, =>
				@current.bringToFront()
			

	applyAnimation: (view, animProperties, animationOptions) ->
		unless view is @current
			_.extend animProperties, animationOptions
			anim = view.animate animProperties
			@saveCurrentToHistory anim
			#anim.on Events.AnimationEnd, =>
			@current = view
			if @subLayers.indexOf(view) is -1 then @add view
			@current.bringToFront()

	subLayersIgnoreEvents: (view, boolean) ->
		print view
		view.ignoreEvents = boolean
		for subLayer in view.subLayers
			@subLayersIgnoreEvents subLayer, boolean
			

	### ANIMATIONS ###

	switchInstant: (view) -> @fadeIn view, time: 0

	slideInUp: (view, animationOptions = @animationOptions) -> 
		view.y = -@height
		animProperties =
			properties:
				y: if view.originalPoint? then view.originalPoint.y else 0
		@applyAnimation view, animProperties, animationOptions

	slideInDown: (view, animationOptions = @animationOptions) ->
		view.y = @height
		animProperties =
			properties:
				y: if view.originalPoint? then view.originalPoint.y else 0
		@applyAnimation view, animProperties, animationOptions

	slideInRight: (view, animationOptions = @animationOptions) -> 
		view.x = @width
		animProperties =
			properties:
				x: if view.originalPoint? then view.originalPoint.x else 0
		@applyAnimation view, animProperties, animationOptions

	slideInLeft: (view, animationOptions = @animationOptions) -> 
		view.x = -@width
		animProperties =
			properties:
				x: if view.originalPoint? then view.originalPoint.x else 0
		@applyAnimation view, animProperties, animationOptions

	fadeIn: (view, animationOptions = @animationOptions) -> 
		view.opacity = 0
		animProperties =
			properties:
				opacity: 1
		@applyAnimation view, animProperties, animationOptions
			
	zoomIn: (view, animationOptions = @animationOptions) -> 
		view.scale = 0.8
		view.opacity = 0
		animProperties =
			properties:
				scale: 1
				opacity: 1
		@applyAnimation view, animProperties, animationOptions

	zoomedIn: (view, animationOptions = @animationOptions) -> 
		view.scale = 1.5
		view.opacity = 0
		animProperties =
			properties:
				scale: 1
				opacity: 1
		@applyAnimation view, animProperties, animationOptions

	flipInRight: (view, animationOptions = @animationOptions) -> 
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
		view.x = -@width/2
		view.rotationY = -100
		view.z = 800
		animProperties =
			properties:
				x: if view.originalPoint? then view.originalPoint.x else 0
				rotationY: 0
				z: 0
		@applyAnimation view, animProperties, animationOptions