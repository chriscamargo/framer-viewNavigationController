# TODO:
# Ignore all events not part of children to @current (avoid click through)
# Add custom animationOptions to .back()?
# Add "moveOut" animations? what's the use case? covered by back?
# If no need for moveOut, maybe we wont need consistent "In" naming scheme
# test use case with ios native push messages
# add pages when trying to animate them. eg. if @subLayers.indexOf(view) is -1 then @add view

class exports.ViewNavigationController extends Layer
		
	constructor: (options={}) ->
		options.width ?= Screen.width
		options.height ?= Screen.height
		options.clip ?= true
		options.animationOptions ?= curve: "spring(400,40)"
		options.backgroundColor ?= "rgba(190,190,190,0.9)"
		options.perspective ?= 1000

		super options
		@history = []
				
	add: (view, point = {x:0, y:0}) ->
		#view.ignoreEvents = true
		view.superLayer = @
		#view.x = @width
		#view.y = 0
		view.on Events.Click, -> return # prevent click-through/bubbling
		view.point = point
		@current = view
		
	saveCurrentToHistory: (animation) ->
		@history.unshift
			view: @current
			animation: animation

	back: -> 
		if @history[0]?
			#@history[0].view.x = 0
			#@history[0].view.y = 0
			anim = @history[0].animation
			backwards = anim.reverse()
			backwards.start()
			previous = @history[0]
			@current = previous.view
			backwards.on Events.AnimationEnd, =>
				@current.bringToFront()
			@history.shift()

	applyAnimation: (view, animProperties, animationOptions) ->
		unless view is @current
			_.extend animProperties, animationOptions
			anim = view.animate animProperties
			@saveCurrentToHistory anim
			anim.on Events.AnimationEnd, => 
				#previous = @history[0].view
				#@subLayersIgnoreEvents previous, true
				#previous.x = @width
			@current = view
			
			@current.bringToFront()

	subLayersIgnoreEvents: (view, boolean) ->
		print view
		view.ignoreEvents = boolean
		for subLayer in view.subLayers
			@subLayersIgnoreEvents subLayer, boolean
			

	### ANIMATIONS ###

	switchInstant: (view) -> @fadeIn view, time: 0

	slideInUp: (view, animationOptions = curve: "spring(400,40)") -> 
		view.y = -@height
		animProperties =
			properties:
				y: 0
		@applyAnimation view, animProperties, animationOptions

	slideInDown: (view, animationOptions = curve: "spring(400,40)") -> 
		view.y = @height
		animProperties =
			properties:
				y: 0
		@applyAnimation view, animProperties, animationOptions

	slideInRight: (view, animationOptions = curve: "spring(400,40)") -> 
		view.x = @width
		animProperties =
			properties:
				x: 0
		@applyAnimation view, animProperties, animationOptions

	slideInLeft: (view, animationOptions = curve: "spring(400,40)") -> 
		view.x = -@width
		animProperties =
			properties:
				x: 0
		@applyAnimation view, animProperties, animationOptions

	fadeIn: (view, animationOptions = time: .2) -> 
		#view.point = x: 0, y: 0
		view.opacity = 0
		animProperties =
			properties:
				opacity: 1
		@applyAnimation view, animProperties, animationOptions
			
	zoomIn: (view, animationOptions = curve: "spring(400,40)") -> 
		#view.point = x: 0, y: 0
		view.scale = 0.8
		view.opacity = 0
		animProperties =
			properties:
				scale: 1
				opacity: 1
		@applyAnimation view, animProperties, animationOptions

	zoomedIn: (view, animationOptions = curve: "spring(400,40)") -> 
		view.point = x: 0, y: 0
		view.scale = 1.5
		view.opacity = 0
		animProperties =
			properties:
				scale: 1
				opacity: 1
		@applyAnimation view, animProperties, animationOptions

	flipInRight: (view, animationOptions = curve: "spring(300,40)") -> 
		view.x = @width/2
		view.rotationY = 100
		view.z = 800
		animProperties =
			properties:
				x: 0
				rotationY: 0
				z: 0
		@applyAnimation view, animProperties, animationOptions

	flipInLeft: (view, animationOptions = curve: "spring(300,40)") -> 
		view.x = -@width/2
		view.rotationY = -100
		view.z = 800
		animProperties =
			properties:
				x: 0
				rotationY: 0
				z: 0
		@applyAnimation view, animProperties, animationOptions