Layers = require 'Layers'
doc = Framer.Importer.load "imported/iosnav"
Utils.globalLayers doc

document.body.style.cursor = "auto"
{ViewNavigationController} = require "ViewNavigationController"
Views = new ViewNavigationController
	backgroundColor: ""

# # # # # # # # # # # # # # # # # # # # # # # #
# VIEWS
# # # # # # # # # # # # # # # # # # # # # # # #

for screen in Layers.startingWith 'screen_'
	screen.shadowBlur = 40
	screen.shadowColor = "black"
	Views.add screen
	Views.flipInRight screen_settings
	
# # # # # # # # # # # # # # # # # # # # # # # #
# BUTTONS
# # # # # # # # # # # # # # # # # # # # # # # #

for btn in Layers.startingWith 'btn_'
	btn.opacity = .2
	btn.on Events.Click, ->
		screen = Layers.get @name.replace('btn_','screen_')
		Views.zoomedIn screen

for btn in Layers.withName 'backbtn'
	btn.on Events.Click, -> Views.back()
	btn.opacity = .2