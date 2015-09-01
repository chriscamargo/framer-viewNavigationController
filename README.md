## framer-viewNavigationController
A simple controller for FramerJS that allows you to transition between views with just a couple lines of code.

#### Features
- Built in method for transitioning between views.
- Multiple animations (fade, slide, flip + more)
- Customize the movement by providing animationOptions
- Automatically saves history when switching view
- Automatically plays the transition backwards when using .back

#### Setup
- Import module
- Create a new instance of the controller, eg. Views = new ViewNavigationController
- Call one of the transition methods, eg. Views.slideInRight sketch.settingspage


### Supported transitions
- .switchInstant view
- .slideInDown(view, animationOptions)
- .slideInUp(view, animationOptions)
- .slideInRight(view, animationOptions)
- .slideInLeft(view, animationOptions)
- .fadeIn(view, animationOptions)
- .zoomIn(view, animationOptions)
- .zoomedIn(view, animationOptions)
- .flipInRight(view, animationOptions)
- .flipInLeft(view, animationOptions)