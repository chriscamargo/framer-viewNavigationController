Layers = require 'Layers'
doc = Framer.Importer.load "imported/iosnav"
Utils.globalLayers doc
document.body.style.cursor = "auto"
{ViewNavigationController} = require "ViewNavigationController"
Views = new ViewNavigationController

# # # # # # # # # # # # # # # # # # # # # # # #
# VIEWS
# # # # # # # # # # # # # # # # # # # # # # # #

Views.add screen for screen in Layers.startingWith 'screen_'
# # # # # # # # # # # # # # # # # # # # # # # #
# BUTTONS
# # # # # # # # # # # # # # # # # # # # # # # #

for btn in Layers.startingWith 'btn_'
	btn.opacity = .2
	btn.on Events.Click, ->
		screen = Layers.get @name.replace('btn_','screen_')
		Views.slideInRight screen
		
modalbtn_push.on Events.Click, ->
	Views.zoomedIn modal_push

for btn in Layers.withName 'backbtn'
	btn.on Events.Click, -> Views.back()
	btn.opacity = .2