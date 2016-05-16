{ViewNavigationController} = require "ViewNavigationController"

bg = new BackgroundLayer

vnc = new ViewNavigationController

# This is optional, but allows you to customize the transition
vnc.animationOptions =
	curve: "ease-in-out"
	time: 0.3

# # # # # # # # # # # # # # # # # # # # # # # #
# VIEWS
# # # # # # # # # # # # # # # # # # # # # # # #
viewSettings = new Layer
	name: "initialView"
	width: 750, height: 1334
	image: "images/screen_01_settings.png"
	parent: vnc

viewGeneral = new Layer
	width: 750, height: 1334
	image: "images/screen_02_general.png"
	parent: vnc

viewSiri = new Layer
	width: 750, height: 1334
	image: "images/screen_03_siri.png"
	parent: vnc
	
viewUpdate = new Layer
	width: 750, height: 1334
	image: "images/screen_04_update.png"
	parent: vnc

# To remove the back button from a view, do this:
# viewUpdate.backButton = false

# # # # # # # # # # # # # # # # # # # # # # # #
# BUTTONS
# # # # # # # # # # # # # # # # # # # # # # # #
btnGeneral = new Layer
	width: Screen.width
	height: 88
	y: 1130
	backgroundColor: "transparent"
	parent: viewSettings
	
btnSiri = new Layer
	width: Screen.width
	height: 88
	y: 444
	backgroundColor: "transparent"
	parent: viewGeneral
	
btnUpdate = new Layer
	width: Screen.width
	height: 88
	y: 284
	backgroundColor: "transparent"
	parent: viewGeneral


# # # # # # # # # # # # # # # # # # # # # # # #
# EVENTS
# # # # # # # # # # # # # # # # # # # # # # # #
btnGeneral.on Events.Click, ->
	vnc.transition viewGeneral
	
btnSiri.on Events.Click, ->
	vnc.transition viewSiri

btnUpdate.on Events.Click, ->
	vnc.transition viewUpdate
	
# To change the direction of the transition, just add a transition property.
# "up", "down", "left" and "right" are the only built-in transitions available.
# Example:
# btnUpdate.on Events.Click, ->
# 	vnc.transition viewUpdate, direction = "up"