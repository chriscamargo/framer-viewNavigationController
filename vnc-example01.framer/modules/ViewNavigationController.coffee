class exports.ViewNavigationController extends Layer

	# Setup Class Constants
	INITIAL_VIEW_NAME = "initialView"
	BACKBUTTON_VIEW_NAME = "vnc-backButton"
	ANIMATION_OPTIONS = 
		time: 0.3
		curve: "ease-in-out"
	BACK_BUTTON_FRAME = 
		x: 0
		y: 40
		width: 88
		height: 88
	PUSH =
		UP:     "pushUp"
		DOWN:   "pushDown"
		LEFT:   "pushLeft"
		RIGHT:  "pushRight"
		CENTER: "pushCenter"
	DIR =
		UP:    "up"
		DOWN:  "down"
		LEFT:  "left"
		RIGHT: "right"
	DEBUG_MODE = false
		
	# Setup Instance and Instance Variables	
	constructor: (@options={}) ->

		@views = @history = @initialView = @currentView = @previousView = @animationOptions = @initialViewName = null
		@options.width           ?= Screen.width
		@options.height          ?= Screen.height
		@options.clip            ?= true
		@options.backgroundColor ?= "#999"
		
		super @options
		
		@views   = []
		@history = []
		@animationOptions = @options.animationOptions or ANIMATION_OPTIONS
		@initialViewName  = @options.initialViewName  or INITIAL_VIEW_NAME
		@backButtonFrame  = @options.backButtonFrame  or BACK_BUTTON_FRAME

		@debugMode = if @options.debugMode? then @options.debugMode else DEBUG_MODE
		
		@.on "change:subLayers", (changeList) ->
			@addView subLayer, true for subLayer in changeList.added

	addView: (view, viaInternalChangeEvent) ->
		
		vncWidth  = @options.width
		vncHeight = @options.height

		view.states.add(
			"#{ PUSH.UP }":
				x: 0
				y: -vncHeight
			"#{ PUSH.LEFT }":
				x: -vncWidth
				y: 0
			"#{ PUSH.CENTER }":
				x: 0
				y: 0
			"#{ PUSH.RIGHT }":
				x: vncWidth
				y: 0
			"#{ PUSH.DOWN }":
				x: 0
				y: vncHeight
		)

			
		view.states.animationOptions = @animationOptions
		
		if view.name is @initialViewName
			@initialView = view
			@currentView = view
			view.states.switchInstant PUSH.CENTER
			@history.push view
		else
			view.states.switchInstant PUSH.RIGHT
		
		unless view.superLayer is @ or viaInternalChangeEvent
			view.superLayer = @
			
		@_applyBackButton view unless view.name is @initialViewName
			
		@views.push view

	transition: (view, direction = DIR.RIGHT, switchInstant = false, preventHistory = false) ->

		return false if view is @currentView
		
		# Setup Views for the transition
		
		if direction is DIR.RIGHT
			view.states.switchInstant  PUSH.RIGHT
			@currentView.states.switch PUSH.LEFT
		else if direction is DIR.DOWN
			view.states.switchInstant  PUSH.DOWN
			@currentView.states.switch PUSH.UP
		else if direction is DIR.LEFT
			view.states.switchInstant  PUSH.LEFT
			@currentView.states.switch PUSH.RIGHT
		else if direction is DIR.UP
			view.states.switchInstant  PUSH.UP
			@currentView.states.switch PUSH.DOWN
		else
			# If they specified something different just switch immediately
			view.states.switchInstant PUSH.CENTER
			@currentView.states.switchInstant PUSH.LEFT
		
		# Push view to Center
		view.states.switch PUSH.CENTER
		# currentView is now our previousView
		@previousView = @currentView
		# Set our currentView to the view we're bringing in
		@currentView = view

		# Store the last view in history
		@history.push @previousView if preventHistory is false
		
		@emit Events.Change

	removeBackButton: (view) ->
		Utils.delay 0, =>
			view.subLayersByName(BACKBUTTON_VIEW_NAME)[0].visible = false

	back: () ->
		@transition(@_getLastHistoryItem(), direction = DIR.LEFT, switchInstant = false, preventHistory = true)
		@history.pop()

	_getLastHistoryItem: () ->
		return @history[@history.length - 1]

	_applyBackButton: (view, frame = @backButtonFrame) ->
		Utils.delay 0, =>
			if view.backButton isnt false
				backButton = new Layer
					name: BACKBUTTON_VIEW_NAME
					width: 80
					height: 80
					superLayer: view

				if @debugMode is false
					backButton.backgroundColor = "transparent"

				backButton.frame = frame

				backButton.on Events.Click, =>
					@back()
		
    

################################################################################
# USAGE EXAMPLE 1 - Define InitialViewName #####################################

# initialViewKey = "view1"
# 
# vnc = new ViewNavigationController initialViewName: initialViewKey
# view1 = new Layer
# 	name: initialViewKey
# 	width:  Screen.width
# 	height: Screen.height
# 	backgroundColor: "red"
# 	superLayer: vnc

################################################################################
# USAGE EXAMPLE 2 - Use default initialViewName "initialView" ##################

# vnc = new ViewNavigationController

# view1 = new Layer
# 	name: "initialView"
# 	width:  Screen.width
# 	height: Screen.height
# 	backgroundColor: "red"
# 	superLayer: vnc
	
# view2 = new Layer
# 	width:  Screen.width
# 	height: Screen.height
# 	backgroundColor: "green"
# 	superLayer: vnc

# view1.on Events.Click, -> vnc.transition view2
# view2.on Events.Click, -> vnc.back()
	