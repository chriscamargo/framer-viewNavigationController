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
		options.backgroundColor ?= "black"
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
		view.sendToBack()
		
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

	applyAnimation: (newView, incoming, animationOptions, outgoing = {}) ->
		unless newView is @current

			# reset common properties in case they
			# were changed during last animation
			#@current.z = 0
			newView.opacity = 1
			newView.brightness = 100
			newView.scale = 1

			@add newView if @subLayers.indexOf(newView) is -1

			# Animate the current view
			_.extend @current, outgoing.start
			outgoingAnimation = 
				layer: @current
				properties: {}
			_.extend outgoingAnimation.properties, outgoing.end
			_.extend outgoingAnimation, animationOptions
			animation = new Animation(outgoingAnimation)
			animation.start()

			# Animate the new view
			_.extend newView, incoming.start
			incomingAnimation = 
				layer: newView
				properties: {}
			_.extend incomingAnimation.properties, incoming.end
			_.extend incomingAnimation, animationOptions
			animation = new Animation(incomingAnimation)
			animation.start()

			@saveCurrentToHistory animation
			@current = newView
			@current.bringToFront()

	getPoint: (view, point) -> view.originalPoint || {x:0,y:0}

	### ANIMATIONS ###

	switchInstant: (newView) -> @fadeIn newView, time: 0

	slideIn: (newView, animationOptions = @animationOptions) -> 
		@slideInRight newView, animationOptions

	slideInLeft: (newView, animationOptions = @animationOptions) -> 
		incoming =
			start:
				x: -@width
			end:
				x: @getPoint(newView).x
		@applyAnimation newView, incoming, animationOptions

	slideInRight: (newView, animationOptions = @animationOptions) -> 
		incoming =
			start:
				x: @width
			end:
				x: @getPoint(newView).x
		@applyAnimation newView, incoming, animationOptions

	slideInDown: (newView, animationOptions = @animationOptions) -> 
		incoming =
			start:
				y: -@height
				x: 0
			end:
				y: @getPoint(newView).y
		@applyAnimation newView, incoming, animationOptions

	slideInUp: (newView, animationOptions = @animationOptions) ->
		incoming =
			start:
				y: @height
				x: 0
			end:
				y: @getPoint(newView).y
		@applyAnimation newView, incoming, animationOptions

	fadeIn: (newView, animationOptions = @animationOptions) ->
		incoming =
			start:
				x: @getPoint(newView).x
				y: @getPoint(newView).y
				opacity: 0
			end:
				opacity: 1
		@applyAnimation newView, incoming, animationOptions

	crossDissolve: (newView, animationOptions = @animationOptions) ->
		@fadeIn newView, animationOptions

	fadeInBlack: (newView, animationOptions = @animationOptions) ->
		outgoing =
			start: 
				brightness: 100
			end:
				brightness: 0
		incoming =
			start: 
				opacity: 0
				brightness: 0
				x: @getPoint(newView).x
				y: @getPoint(newView).y
			end:
				opacity: 1
				brightness: 100
		@applyAnimation newView, incoming, animationOptions, outgoing
			
	zoomIn: (newView, animationOptions = @animationOptions) ->
		incoming =
			start:
				x: 0
				y: 0
				scale: 0.8
				opacity: 0
			end:
				scale: 1
				opacity: 1
		@applyAnimation newView, incoming, animationOptions

	zoomedIn: (newView, animationOptions = @animationOptions) ->
		incoming =
			start:
				x: 0
				y: 0
				scale: 1.5
				opacity: 0
			end:
				scale: 1
				opacity: 1
		@applyAnimation newView, incoming, animationOptions

	flipIn: (newView, animationOptions = @animationOptions) -> 
		@flipInRight newView, animationOptions

	flipInRight: (newView, animationOptions = @animationOptions) ->
		incoming =
			start:
				x: @width/2
				z: @width
				rotationY: 100
			end:
				x: @getPoint(newView).x
				rotationY: 0
				z: 0
		@applyAnimation newView, incoming, animationOptions

	flipInLeft: (newView, animationOptions = @animationOptions) ->
		incoming =
			start:
				x: -@width/2
				z: @width
				rotationY: -100
			end:
				x: @getPoint(newView).x
				rotationY: 0
				z: 0
		@applyAnimation newView, incoming, animationOptions

	flipInUp: (newView, animationOptions = @animationOptions) ->
		incoming =
			start:
				x: 0
				z: @height
				y: @height
				rotationX: -100
			end:
				y: @getPoint(newView).y
				rotationX: 0
				z: 0
		@applyAnimation newView, incoming, animationOptions
		
	spinIn: (newView, animationOptions = @animationOptions) ->
		incoming =
			start:
				x: 0
				y: 0
				rotation: 180
				scale: 0.8
				opacity: 0
			end:
				scale: 1
				opacity: 1
				rotation: 0
		@applyAnimation newView, incoming, animationOptions

	pushIn: (newView, animationOptions = @animationOptions) -> 
		@pushInRight newView, animationOptions

	pushInRight: (newView, animationOptions = @animationOptions) ->
		outgoing =
			start: {}
			end:
				x: -(@width/5)
				brightness: 80
		incoming =
			start:
				brightness: 100
				x: @width
			end:
				x: @getPoint(newView).x
		@applyAnimation newView, incoming, animationOptions, outgoing

	pushInLeft: (newView, animationOptions = @animationOptions) ->
		outgoing =
			start: {}
			end:
				x: +(@width/5)
				brightness: 90
		incoming =
			start:
				x: -@width
			end:
				x: @getPoint(newView).x
		@applyAnimation newView, incoming, animationOptions, outgoing

	moveIn: (newView, animationOptions = @animationOptions) -> 
		@moveInRight newView, animationOptions

	moveInRight: (newView, animationOptions = @animationOptions) ->
		outgoing =
			start: {}
			end:
				x: -@width
		incoming =
			start:
				x: @width
			end:
				x: @getPoint(newView).x
		@applyAnimation newView, incoming, animationOptions, outgoing

	moveInLeft: (newView, animationOptions = @animationOptions) ->
		outgoing =
			start: {}
			end:
				x: @width
		incoming =
			start:
				x: -@width
			end:
				x: @getPoint(newView).x
		@applyAnimation newView, incoming, animationOptions, outgoing

	moveInUp: (newView, animationOptions = @animationOptions) ->
		outgoing =
			start: {}
			end:
				y: -@height
		incoming =
			start:
				x: 0
				y: @height
			end:
				y: @getPoint(newView).y
		@applyAnimation newView, incoming, animationOptions, outgoing

	moveInDown: (newView, animationOptions = @animationOptions) ->
		outgoing =
			start: {}
			end:
				y: @height
		incoming =
			start:
				x: 0
				y: -@height
			end:
				y: @getPoint(newView).y
		@applyAnimation newView, incoming, animationOptions, outgoing

	modal: (newView, animationOptions = @animationOptions) ->
		outgoing =
			start: {}
			end:
				scale: 0.9
		incoming =
			start:
				x: 0
				y: @height
			end:
				y: if newView.originalPoint? then newView.originalPoint.y else @height/10
		@applyAnimation newView, incoming, animationOptions, outgoing

	magicMove: (newView, animationOptions = @animationOptions) ->

		traverseSubLayers = (layer) ->
			arr = []
			findSubLayer = (layer) ->
				for subLayer in layer.subLayers
					arr.push subLayer
					if subLayer.subLayers.length > 0
						findSubLayer subLayer
				return arr
			findSubLayer layer
		
		exisitingLayers = {}
		for sub in traverseSubLayers @current
			exisitingLayers[sub.name] = sub
		
		# proper switch with history support
		@switchInstant newView
		
		# fancy animations with magic move
		for sub in traverseSubLayers newView
			if exisitingLayers[sub.name]?
				match = exisitingLayers[sub.name]
				newFrame = sub.frame
				prevFrame = match.frame
				sub.frame = prevFrame
				animationObj = 
					properties:
						x: newFrame.x
						y: newFrame.y
						width: newFrame.width
						height: newFrame.height
			else # fade in
				sub.opacity = 0
				animationObj = 
					properties:
						opacity: 1
			_.extend animationObj, animationOptions
			sub.animate animationObj

	# Backwards compatibility
	transition: (newView, direction = 'right') ->
		switch direction
			when 'up' then @moveInDown newView
			when 'right' then @pushInRight newView
			when 'down' then @moveInUp newView
			when 'left' then @pushInLeft newView