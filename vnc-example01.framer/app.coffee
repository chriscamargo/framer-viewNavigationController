{ViewNavigationController} = require "ViewNavigationController"

bg = new BackgroundLayer

vnc = new ViewNavigationController

vnc.animationOptions =
	curve: "spring(160,10,0)"

# # # # # # # # # # # # # # # # # # # # # # # #
# VIEWS
# # # # # # # # # # # # # # # # # # # # # # # #
viewSettings = new Layer
	name: "initialView"
	width: 750, height: 1334
	image: "images/screen_01_settings.png"
	superLayer: vnc

viewGeneral = new Layer
	width: 750, height: 1334
	image: "images/screen_02_general.png"
	superLayer: vnc

viewSiri = new Layer
	width: 750, height: 1334
	image: "images/screen_03_siri.png"
	superLayer: vnc
	
viewUpdate = new Layer
	width: 750, height: 1334
	image: "images/screen_04_update.png"
	superLayer: vnc

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
btnGeneral.on Events.Click, ->
	vnc.transition viewGeneral
	
btnSiri.on Events.Click, ->
	vnc.transition viewSiri

btnUpdate.on Events.Click, ->
	vnc.transition viewUpdate