document.body.style.cursor = "auto"
{ViewNavigationController} = require "ViewNavigationController"
Views = new ViewNavigationController

# This is optional, but allows you to customize the transition
# Views.animationOptions =
# 	curve: "ease-in-out"
# 	time: 0.3

# # # # # # # # # # # # # # # # # # # # # # # #
# VIEWS
# # # # # # # # # # # # # # # # # # # # # # # #
viewSettings = new Layer
	name: 'settings'
	width: 750, height: 1334
	image: "images/screen_01_settings.png"

viewGeneral = new Layer
	name: 'general'
	width: 750, height: 1334
	image: "images/screen_02_general.png"

viewSiri = new Layer
	name: 'siri'
	width: 750, height: 1334
	image: "images/screen_03_siri.png"
	
viewUpdate = new Layer
	name: 'update'
	width: 750, height: 1334
	image: "images/screen_04_update.png"
	
# for view in [viewSettings, viewGeneral,viewSiri,viewUpdate]
	
for view in [viewSettings,viewGeneral,viewSiri,viewUpdate]
	Views.add view
	btnBack = new Layer
		name: 'btnback'
		superLayer: view
		backgroundColor: ""
		width: 88*2
		y: 40
	btnBack.on Events.Click, -> 
		Views.back()
	
# # # # # # # # # # # # # # # # # # # # # # # #
# BUTTONS
# # # # # # # # # # # # # # # # # # # # # # # #
btnGeneral = new Layer
	name: "gen"
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

Views.switchInstant viewSettings

## TODOS:
# General is not clickable after being inside the menu?!

# # # # # # # # # # # # # # # # # # # # # # # #
# EVENTS
# # # # # # # # # # # # # # # # # # # # # # # #
btnGeneral.on Events.Click, -> Views.flipInRight viewGeneral
btnSiri.on Events.Click, -> Views.fadeIn viewSiri
btnUpdate.on Events.Click, -> Views.switchInstant viewUpdate