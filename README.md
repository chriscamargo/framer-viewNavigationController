## framer-viewNavigationController
fVNC is a simple view controller for FramerJS that allows you to transition between views with just a couple lines of code.

#### Features
- Built-in method for transitioning between views.
- Customize the transition by choosing `up`, `down`, `left`, or `right` transitions.
- Customize the movement by providing `animationOptions`.
- Automatically places back buttons in your flow at the top left of your views.
- Automatically transitions backward, using the opposite direction of your initial transition. (v1.1)

#### TODO
- Allow custom states for building unique screen-to-screen transitions.
- Moar documentation!

#### How to Get Started

**Step 1:** Include the module in your protoype.
```coffeescript
{ViewNavigationController} = require "ViewNavigationController"
```


**Step 2:** Create a new view controller.
```coffeescript
vnc = new ViewNavigationController
```
In this case, I've called my view controller `vnc`. By default, the view controller will match the size of the device's screen. You can add `width` and `height` properties to modify the size of the view controller.


**Step 3:** Create your views and add them to the view controller.
```coffeescript
myFirstView = new Layer
	name: "initialView"
	width: 750, height: 1334
	image: "images/screen01.png"
	parent: vnc

mySecondView = new Layer
	width: 750, height: 1334
	image: "images/screen02.png"
	parent: vnc
```
To add them to the view controller, just make sure the it's their parent. You can see I've also set the `name` property of `myFirstView` to `initialView`. This tells the view controller that I want to start with this view appearing first.


**Step 4:** Set up a button to change views.
```coffeescript
myButton = new Layer
	width: Screen.width
	height: 88
	y: 1130
	parent: myFirstView

myButton.on Events.Click, ->
	vnc.transition(mySecondView)
```
Now I can quickly create a button that causes our view controller to change views. I don't need to worry about creating a 'back' button for `mySecondView`, the view controller has already done that for me. And if I add more views and create more transitions, the view controler will remember which views I've seen, and will step me back in the correct order.

#### Methods
fVNC comes with a few methods built-in to help you do things like transition backward, or remove the automatically created back buttons from an existing view.

##### back()
To move backward by one history item, simply call the `back()` method.
```coffeescript
myBackButton.on Events.Click, ->
	vnc.back()
```
Just remember, if there's no prior view in the history stack, there's nothing to go back to, so nothing will happen.

##### removeBackButton(view)
To remove the back button from a view, just call `removeBackButton()` and pass in the view you'd like to affect.
```coffeescript
vnc.removeBackButton(mySecondView)
```
This code will prevent the back button from appearing on `mySecondView`.

#### Feature Requests
If you'd like to see new features added to fVNC, just drop me a line on Twitter ([@chriscamargo](http://www.twitter.com/chriscamargo)), or better yet, submit a pull request.

#### Changelog

##### v1.1 (Sun, May 15, 2016)
- fVNC now emits a `change:view` event to notify you when a view change happens.
- fVNC now keeps track of the transition you use, so the direction is automatically reversed when using 'back'.