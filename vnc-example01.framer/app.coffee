Layers = require 'Layers'
doc = Framer.Importer.load "imported/iosnav"
Utils.globalLayers doc
document.body.style.cursor = "auto"
{ViewNavigationController} = require "ViewNavigationController"
Views = new ViewNavigationController

# # # # # # # # # # # # # # # # # # # # # # # #
# VIEWS
# # # # # # # # # # # # # # # # # # # # # # # #

# Preload views by adding them. Not needed, but may avoid jitter on first load
Views.add screen for screen in Layers.startingWith 'screen_'

# # # # # # # # # # # # # # # # # # # # # # # #
# BUTTONS
# # # # # # # # # # # # # # # # # # # # # # # #

for btn in Layers.startingWith 'btn_'
	btn.opacity = 0
	btn.on Events.Click, ->
		screen = Layers.get @name.replace('btn_','screen_')
		Views.slideInRight screen
		
modalbtn_push.on Events.Click, ->
	Views.zoomedIn modal_push

for btn in Layers.withName 'backbtn'
	btn.on Events.Click, -> Views.back()
	btn.opacity = 0

Views.add controlcenter, {x: 0, y: 360}
Views.switchInstant screen_settings
controlcenter_btn.on Events.Click, -> Views.slideInDown controlcenter
controlcenter.on Events.Click, -> Views.back()