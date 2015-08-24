{ViewNavigationController} = require "ViewNavigationController"
vnc = new ViewNavigationController

# This is optional, but allows you to customize the transition
# vnc.animationOptions =
# 	curve: "ease-in-out"
# 	time: 0.3

# # # # # # # # # # # # # # # # # # # # # # # #
# VIEWS
# # # # # # # # # # # # # # # # # # # # # # # #
viewSettings = new Layer
	width: 750, height: 1334
	image: "images/screen_01_settings.png"

viewGeneral = new Layer
	width: 750, height: 1334
	image: "images/screen_02_general.png"

viewSiri = new Layer
	width: 750, height: 1334
	image: "images/screen_03_siri.png"
	
viewUpdate = new Layer
	width: 750, height: 1334
	image: "images/screen_04_update.png"
	
# for view in [viewSettings, viewGeneral,viewSiri,viewUpdate]
	
for view in [viewSettings,viewGeneral,viewSiri,viewUpdate]
	vnc.add view
	btnBack = new Layer
		superLayer: view
		backgroundColor: ""
		width: 88*2
		y: 40
	btnBack.on Events.Click, -> vnc.back()
	
vnc.moveIn viewSettings

# # # # # # # # # # # # # # # # # # # # # # # #
# BUTTONS
# # # # # # # # # # # # # # # # # # # # # # # #
btnGeneral = new Layer
	width: Screen.width
	height: 88
	y: 1130
	backgroundColor: "transparent"
	superLayer: viewSettings
	
btnSiri = new Layer
	width: Screen.width
	height: 88
	y: 444
	backgroundColor: "transparent"
	superLayer: viewGeneral
	
btnUpdate = new Layer
	width: Screen.width
	height: 88
	y: 284
	backgroundColor: "transparent"
	superLayer: viewGeneral


# # # # # # # # # # # # # # # # # # # # # # # #
# EVENTS
# # # # # # # # # # # # # # # # # # # # # # # #
btnGeneral.on Events.Click, -> vnc.moveIn viewGeneral, 'right'
btnSiri.on Events.Click, -> vnc.moveIn viewSiri, 'right'
btnUpdate.on Events.Click, -> vnc.moveIn viewUpdate, 'right'