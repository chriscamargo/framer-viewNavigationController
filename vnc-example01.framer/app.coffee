{ViewNavigationController} = require 'ViewNavigationController'

Views = new ViewNavigationController
	width: 500
	height: 500
	initialViewName: 'foobar'
	#clip: false
Views.center()

view1 = new Layer 
	width: Views.width, height: Views.height, name: 'foobar'
	image: "http://bit.ly/1L86dhL", superLayer: Views, opacity: 0.8
Utils.labelLayer view1, 'view1'

view2 = new Layer
	width: Views.width, height: Views.height
	image: "http://bit.ly/1UvvNCp", superLayer: Views
Utils.labelLayer view2, 'view2'

# Add views to the view controller
#Views.add view for view in [view1,view2]
# Switch view to set the initial state
#Views.switchInstant view1
# Set up transition on click
view1.on Events.Click, -> Views.zoomIn view2
# Go back in history and reverse the previous animation
view2.on Events.Click, -> Views.back()

### Transitions
.switchInstant
.pushInRight
.pushInLeft
.slideInDown
.slideInUp
.slideInRight
.slideInLeft
.fadeIn
.zoomIn
.zoomedIn
.flipInRight
.flipInLeft
.flipInUp
.spinIn
###