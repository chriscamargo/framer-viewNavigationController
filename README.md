## framer-viewNavigationController
A simple controller for FramerJS that allows you to transition between views with just a couple lines of code.

#### Features
- Built in method for transitioning between views.
- Multiple transitions built in (fade, slide, flip + more)
- Customize the movement by providing animationOptions
- Automatically saves history when switching view
- Automatically plays the transition backwards when calling .back()
- Magic move! Layers sharing the same name will tween between its .frame values.

#### Setup
- add the module your modules folder and add

	{ViewNavigationController} = require 'ViewNavigationController'

to the top of your project

- Create a new instance of the controller and set the initial view

	Views = new ViewNavigationController
		initialView: myLayer

- Add interactivity

	myLayer.on Events.Click, -> Views.pushIn mySecondLayer
	mySecondLayer.on Events.Click, -> Views.magicMove myThirdLayer


### Supported transitions
- .switchInstant
- .slideIn
- .slideInLeft 
- .slideInRight
- .slideInDown 
- .slideInUp 
- .fadeIn / .crossDissolve 
- .fadeInBlack
- .zoomIn 
- .zoomedIn
- .flipIn / .flipInRight 
- .flipInLeft
- .flipInUp
- .spinIn 
- .pushIn / .pushInRight 
- .pushInLeft 
- .moveIn / .moveInRight 
- .moveInLeft 
- .moveInUp
- .moveInDown 
- .modal
- .magicMove