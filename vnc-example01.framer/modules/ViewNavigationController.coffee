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
		#subLayer.ignoreEvents = true for subLayer in @subLayers
		#view.ignoreEvents = false
		view.superLayer = @
		view.point = point
		# view.states.add
		# 	up:     {x: 0, y: -@height}
		# 	right:  {x: @width, y: 0}
		# 	down:   {x: 0, y: @height}
		# 	left:   {x: -@width, y: 0}
		# view.states.animationOptions = @animationOptions
		@current = view
		
	saveCurrentToHistory: (animation) ->
		@history.unshift
			view: @current
			animation: animation

	back: ->
		if @history[0]?
			#subLayer.ignoreEvents = false for subLayer in @subLayers
			#@current.states.switchInstant 'default'
			#print @history[0].name
			#@history[0].opacity = 0.4
			anim = @history[0].animation
			backwards = anim.reverse()
			backwards.start()
			backwards.on Events.AnimationEnd, =>
				previous = @history[0]
				@current = previous.view
				@history.shift()


	# appear: (view, direction = 'default') ->
	# 	@current = view
	# 	#subLayer.ignoreEvents = true for subLayer in @subLayers
	# 	#view.ignoreEvents = false
		

	applyAnimation: (view, animProperties, animationOptions) ->
		unless view is @current
			_.extend animProperties, animationOptions
			anim = view.animate animProperties
			@saveCurrentToHistory anim
			@current = view
			view.bringToFront()

	### ANIMATIONS <3 ###

	slideInRight: (view, animationOptions = curve: "spring(400,40)") -> 
		view.x = @width
		animProperties =
			properties:
				x: 0
		@applyAnimation view, animProperties, animationOptions

	fadeIn: (view, animationOptions = time: .2) -> 
		view.opacity = 0
		animProperties =
			properties:
				opacity: 1
		@applyAnimation view, animProperties, animationOptions
			
	spinIn: (view, animationOptions = curve: "spring(200,30)") -> 
		view.rotation = 0
		view.opacity = 0
		view.scale = 0.4
		animProperties =
			properties:
				rotation: 360
				opacity: 1
				scale: 1
		@applyAnimation view, animProperties, animationOptions