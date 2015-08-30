Layers = require 'Layers'
doc = Framer.Importer.load "imported/iosnav"
Utils.globalLayers doc

document.body.style.cursor = "auto"
{ViewNavigationController} = require "ViewNavigationController"
Views = new ViewNavigationController

# # # # # # # # # # # # # # # # # # # # # # # #
# VIEWS
# # # # # # # # # # # # # # # # # # # # # # # #

for screen in Layers.startingWith 'screen_'
	Views.add screen
	
# # # # # # # # # # # # # # # # # # # # # # # #
# BUTTONS
# # # # # # # # # # # # # # # # # # # # # # # #

for btn in Layers.startingWith 'btn_'
	btn.opacity = .2
	btn.on Events.Click, ->
		screen = Layers.get @name.replace('btn_','screen_')
		Views.switchInstant screen

for btn in Layers.withName 'backbtn'
	btn.on Events.Click, -> Views.back()
	btn.opacity = .2