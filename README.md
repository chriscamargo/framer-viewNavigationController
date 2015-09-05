## framer-viewNavigationController
A simple controller for FramerJS that allows you to transition between views with just a couple lines of code.

#### Features
- Built in method for transitioning between views.
- Multiple animations (fade, slide, flip + more)
- Customize the movement by providing animationOptions
- Automatically saves history when switching view
- Automatically plays the transition backwards when calling .back()

#### Setup
- add the module your modules folder and add

	{ViewNavigationController} = require 'ViewNavigationController'

to the top of your project

- Create a new instance of the controller

	Views = new ViewNavigationController

- Set the initial view by calling one of the transition methods

	Views.switchInstant myLayer

- Add interactivity

	myLayer.on Events.Click, -> Views.pushIn mySecondLayer


### Supported transitions
- .switchInstant
- .slideIn
- .slideInLeft 
- .slideInRight
- .slideInDown 
- .slideInUp 
- .fadeIn / .crossDissolve 
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