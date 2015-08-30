module.exports = {
	all: -> Framer.CurrentContext.getLayers()
	withName: (name) ->
		matchingLayers = []
		for layer in @all()
 			matchingLayers.push(layer) if layer.name is name
 		return matchingLayers.reverse() # to match layerlist order
	containing: (name) ->
		matchingLayers = []
		for layer in @all()
 			matchingLayers.push(layer) if layer.name.indexOf(name) isnt -1
 		return matchingLayers.reverse() # to match layerlist order
	startingWith: (name) ->
		matchingLayers = []
		for layer in @all()
 			matchingLayers.push(layer) if layer.name.substring(0,name.length) is name
 		return matchingLayers.reverse() # to match layerlist order
	endingWith: (name) ->
		matchingLayers = []
		for layer in @all()
 			matchingLayers.push(layer) if layer.name.match("#{name}$")
 		return matchingLayers.reverse() # to match layerlist order
	withState: (state) -> 
		matchingLayers = []
		for layer in @all()
			layerStates = layer.states._orderedStates
			matchingLayers.push(layer) if layerStates.indexOf(state) isnt -1
		return matchingLayers.reverse()
	withCurrentState: (state) -> 
		matchingLayers = []
		for layer in @all()
			currentState = layer.states.current
			matchingLayers.push(layer) if currentState.indexOf(state) isnt -1
		return matchingLayers.reverse()
	withSuperLayer: (name) ->
		matchingLayers = []
		for layer in @withName(name)
			matchingLayers = matchingLayers.concat(layer.subLayers)
		return matchingLayers.reverse()
	withSubLayer: (name) ->
		matchingLayers = []
		for layer in @withName(name)
			if matchingLayers.indexOf(layer.superLayer) is -1
				matchingLayers.push(layer.superLayer) 
		return matchingLayers.reverse()
	where: (obj) ->
		_.where Framer.CurrentContext.getLayers(), obj
	get: (name) ->
		@withName(name)[0]
}

Layer::prefixSwitch = (newPrefix, delimiter = '_') ->
	name = this.name
	newName = newPrefix + name.slice name.indexOf delimiter
	return module.exports.get newName

# By https://github.com/facebook/shortcuts-for-framer
Layer::findSubLayer = (needle, recursive = true) ->
  # Search direct children
  for subLayer in @subLayers
    return subLayer if subLayer.name.toLowerCase().indexOf(needle.toLowerCase()) isnt -1 
  # Recursively search children of children
  if recursive
    for subLayer in @subLayers
      return subLayer.findSubLayer(needle, recursive) if subLayer.findSubLayer(needle, recursive)
      
Layer::findSuperLayer = (needle, recursive = true) ->
  # Search direct children
  return @superLayer if @superLayer.name.toLowerCase().indexOf(needle.toLowerCase()) isnt -1 
  # Recursively search children of children
  if recursive
  	return @superLayer.findSuperLayer(needle, recursive) if @superLayer.findSuperLayer(needle, recursive)