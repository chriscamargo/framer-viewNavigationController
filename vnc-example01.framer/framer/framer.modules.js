require=(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({"ViewNavigationController":[function(require,module,exports){
var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

exports.ViewNavigationController = (function(superClass) {
  var ANIMATION_OPTIONS, BACKBUTTON_VIEW_NAME, BACK_BUTTON_FRAME, DEBUG_MODE, DIR, INITIAL_VIEW_NAME, PUSH;

  extend(ViewNavigationController, superClass);

  INITIAL_VIEW_NAME = "initialView";

  BACKBUTTON_VIEW_NAME = "vnc-backButton";

  ANIMATION_OPTIONS = {
    time: 0.3,
    curve: "ease-in-out"
  };

  BACK_BUTTON_FRAME = {
    x: 0,
    y: 40,
    width: 88,
    height: 88
  };

  PUSH = {
    UP: "pushUp",
    DOWN: "pushDown",
    LEFT: "pushLeft",
    RIGHT: "pushRight",
    CENTER: "pushCenter"
  };

  DIR = {
    UP: "up",
    DOWN: "down",
    LEFT: "left",
    RIGHT: "right"
  };

  DEBUG_MODE = false;

  function ViewNavigationController(options) {
    var base, base1, base2, base3;
    this.options = options != null ? options : {};
    this.views = this.history = this.initialView = this.currentView = this.previousView = this.initialViewName = null;
    if ((base = this.options).width == null) {
      base.width = Screen.width;
    }
    if ((base1 = this.options).height == null) {
      base1.height = Screen.height;
    }
    if ((base2 = this.options).clip == null) {
      base2.clip = true;
    }
    if ((base3 = this.options).backgroundColor == null) {
      base3.backgroundColor = "#999";
    }
    ViewNavigationController.__super__.constructor.call(this, this.options);
    this.views = [];
    this.history = [];
    this.animationOptions = this.options.animationOptions || ANIMATION_OPTIONS;
    this.initialViewName = this.options.initialViewName || INITIAL_VIEW_NAME;
    this.backButtonFrame = this.options.backButtonFrame || BACK_BUTTON_FRAME;
    this.debugMode = this.options.debugMode != null ? this.options.debugMode : DEBUG_MODE;
    this.on("change:subLayers", function(changeList) {
      return Utils.delay(0, (function(_this) {
        return function() {
          var i, len, ref, results, subLayer;
          ref = changeList.added;
          results = [];
          for (i = 0, len = ref.length; i < len; i++) {
            subLayer = ref[i];
            results.push(_this.addView(subLayer, true));
          }
          return results;
        };
      })(this));
    });
  }

  ViewNavigationController.prototype.addView = function(view, viaInternalChangeEvent) {
    var obj, vncHeight, vncWidth;
    vncWidth = this.options.width;
    vncHeight = this.options.height;
    view.states.add((
      obj = {},
      obj["" + PUSH.UP] = {
        x: 0,
        y: -vncHeight
      },
      obj["" + PUSH.LEFT] = {
        x: -vncWidth,
        y: 0
      },
      obj["" + PUSH.CENTER] = {
        x: 0,
        y: 0
      },
      obj["" + PUSH.RIGHT] = {
        x: vncWidth,
        y: 0
      },
      obj["" + PUSH.DOWN] = {
        x: 0,
        y: vncHeight
      },
      obj
    ));
    view.states.animationOptions = this.animationOptions;
    if (view.name === this.initialViewName) {
      this.initialView = view;
      this.currentView = view;
      view.states.switchInstant(PUSH.CENTER);
      this.history.push(view);
    } else {
      view.states.switchInstant(PUSH.RIGHT);
    }
    if (!(view.superLayer === this || viaInternalChangeEvent)) {
      view.superLayer = this;
    }
    if (view.name !== this.initialViewName) {
      this._applyBackButton(view);
    }
    return this.views.push(view);
  };

  ViewNavigationController.prototype.transition = function(view, direction, switchInstant, preventHistory) {
    if (direction == null) {
      direction = DIR.RIGHT;
    }
    if (switchInstant == null) {
      switchInstant = false;
    }
    if (preventHistory == null) {
      preventHistory = false;
    }
    if (view === this.currentView) {
      return false;
    }
    if (direction === DIR.RIGHT) {
      view.states.switchInstant(PUSH.RIGHT);
      this.currentView.states["switch"](PUSH.LEFT);
    } else if (direction === DIR.DOWN) {
      view.states.switchInstant(PUSH.DOWN);
      this.currentView.states["switch"](PUSH.UP);
    } else if (direction === DIR.LEFT) {
      view.states.switchInstant(PUSH.LEFT);
      this.currentView.states["switch"](PUSH.RIGHT);
    } else if (direction === DIR.UP) {
      view.states.switchInstant(PUSH.UP);
      this.currentView.states["switch"](PUSH.DOWN);
    } else {
      view.states.switchInstant(PUSH.CENTER);
      this.currentView.states.switchInstant(PUSH.LEFT);
    }
    view.states["switch"](PUSH.CENTER);
    this.previousView = this.currentView;
    this.previousView.custom = {
      lastTransition: direction
    };
    this.currentView = view;
    if (preventHistory === false) {
      this.history.push(this.previousView);
    }
    return this.emit("change:view");
  };

  ViewNavigationController.prototype.removeBackButton = function(view) {
    return Utils.delay(0, (function(_this) {
      return function() {
        return view.subLayersByName(BACKBUTTON_VIEW_NAME)[0].visible = false;
      };
    })(this));
  };

  ViewNavigationController.prototype.back = function() {
    var direction, lastTransition, lastView, oppositeTransition, preventHistory, switchInstant;
    lastView = this._getLastHistoryItem();
    lastTransition = lastView.custom.lastTransition;
    oppositeTransition = this._getOppositeDirection(lastTransition);
    this.transition(lastView, direction = oppositeTransition, switchInstant = false, preventHistory = true);
    return this.history.pop();
  };

  ViewNavigationController.prototype._getLastHistoryItem = function() {
    return this.history[this.history.length - 1];
  };

  ViewNavigationController.prototype._applyBackButton = function(view, frame) {
    if (frame == null) {
      frame = this.backButtonFrame;
    }
    return Utils.delay(0, (function(_this) {
      return function() {
        var backButton;
        if (view.backButton !== false) {
          backButton = new Layer({
            name: BACKBUTTON_VIEW_NAME,
            width: 80,
            height: 80,
            superLayer: view
          });
          if (_this.debugMode === false) {
            backButton.backgroundColor = "transparent";
          }
          backButton.frame = frame;
          return backButton.on(Events.Click, function() {
            return _this.back();
          });
        }
      };
    })(this));
  };

  ViewNavigationController.prototype._getOppositeDirection = function(initialDirection) {
    if (initialDirection === DIR.UP) {
      return DIR.DOWN;
    } else if (initialDirection === DIR.DOWN) {
      return DIR.UP;
    } else if (initialDirection === DIR.RIGHT) {
      return DIR.LEFT;
    } else if (initialDirection === DIR.LEFT) {
      return DIR.RIGHT;
    } else {
      return DIR.LEFT;
    }
  };

  return ViewNavigationController;

})(Layer);


/*

USAGE EXAMPLE 1 - Define InitialViewName

initialViewKey = "view1"

vnc = new ViewNavigationController
	initialViewName: initialViewKey

view1 = new Layer
	name: initialViewKey
	width:  Screen.width
	height: Screen.height
	backgroundColor: "red"
	parent: vnc
 */


/*

USAGE EXAMPLE 2 - Use default initialViewName "initialView"

vnc = new ViewNavigationController

view1 = new Layer
	name: "initialView"
	width:  Screen.width
	height: Screen.height
	backgroundColor: "red"
	parent: vnc

view2 = new Layer
	width:  Screen.width
	height: Screen.height
	backgroundColor: "green"
	parent: vnc

view1.onClick ->
	vnc.transition view2

view2.onClick ->
	vnc.back()
 */


},{}]},{},[])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZnJhbWVyLm1vZHVsZXMuanMiLCJzb3VyY2VzIjpbIi4uL21vZHVsZXMvVmlld05hdmlnYXRpb25Db250cm9sbGVyLmNvZmZlZSIsIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiXSwic291cmNlc0NvbnRlbnQiOlsiY2xhc3MgZXhwb3J0cy5WaWV3TmF2aWdhdGlvbkNvbnRyb2xsZXIgZXh0ZW5kcyBMYXllclxuXG5cdCMgU2V0dXAgQ2xhc3MgQ29uc3RhbnRzXG5cdElOSVRJQUxfVklFV19OQU1FID0gXCJpbml0aWFsVmlld1wiXG5cblx0QkFDS0JVVFRPTl9WSUVXX05BTUUgPSBcInZuYy1iYWNrQnV0dG9uXCJcblxuXHRBTklNQVRJT05fT1BUSU9OUyA9IFxuXHRcdHRpbWU6IDAuM1xuXHRcdGN1cnZlOiBcImVhc2UtaW4tb3V0XCJcblxuXHRCQUNLX0JVVFRPTl9GUkFNRSA9IFxuXHRcdHg6IDBcblx0XHR5OiA0MFxuXHRcdHdpZHRoOiA4OFxuXHRcdGhlaWdodDogODhcblxuXHRQVVNIID1cblx0XHRVUDogICAgIFwicHVzaFVwXCJcblx0XHRET1dOOiAgIFwicHVzaERvd25cIlxuXHRcdExFRlQ6ICAgXCJwdXNoTGVmdFwiXG5cdFx0UklHSFQ6ICBcInB1c2hSaWdodFwiXG5cdFx0Q0VOVEVSOiBcInB1c2hDZW50ZXJcIlxuXG5cdERJUiA9XG5cdFx0VVA6ICAgIFwidXBcIlxuXHRcdERPV046ICBcImRvd25cIlxuXHRcdExFRlQ6ICBcImxlZnRcIlxuXHRcdFJJR0hUOiBcInJpZ2h0XCJcblxuXHRERUJVR19NT0RFID0gZmFsc2VcblxuXHQjIFNldHVwIEluc3RhbmNlIGFuZCBJbnN0YW5jZSBWYXJpYWJsZXNcblx0Y29uc3RydWN0b3I6IChAb3B0aW9ucz17fSkgLT5cblxuXHRcdEB2aWV3cyA9IEBoaXN0b3J5ID0gQGluaXRpYWxWaWV3ID0gQGN1cnJlbnRWaWV3ID0gQHByZXZpb3VzVmlldyA9IEBpbml0aWFsVmlld05hbWUgPSBudWxsXG5cdFx0QG9wdGlvbnMud2lkdGggICAgICAgICAgID89IFNjcmVlbi53aWR0aFxuXHRcdEBvcHRpb25zLmhlaWdodCAgICAgICAgICA/PSBTY3JlZW4uaGVpZ2h0XG5cdFx0QG9wdGlvbnMuY2xpcCAgICAgICAgICAgID89IHRydWVcblx0XHRAb3B0aW9ucy5iYWNrZ3JvdW5kQ29sb3IgPz0gXCIjOTk5XCJcblxuXHRcdHN1cGVyIEBvcHRpb25zXG5cblx0XHRAdmlld3MgICA9IFtdXG5cdFx0QGhpc3RvcnkgPSBbXVxuXHRcdEBhbmltYXRpb25PcHRpb25zID0gQG9wdGlvbnMuYW5pbWF0aW9uT3B0aW9ucyBvciBBTklNQVRJT05fT1BUSU9OU1xuXHRcdEBpbml0aWFsVmlld05hbWUgID0gQG9wdGlvbnMuaW5pdGlhbFZpZXdOYW1lICBvciBJTklUSUFMX1ZJRVdfTkFNRVxuXHRcdEBiYWNrQnV0dG9uRnJhbWUgID0gQG9wdGlvbnMuYmFja0J1dHRvbkZyYW1lICBvciBCQUNLX0JVVFRPTl9GUkFNRVxuXG5cdFx0QGRlYnVnTW9kZSA9IGlmIEBvcHRpb25zLmRlYnVnTW9kZT8gdGhlbiBAb3B0aW9ucy5kZWJ1Z01vZGUgZWxzZSBERUJVR19NT0RFXG5cblx0XHRALm9uIFwiY2hhbmdlOnN1YkxheWVyc1wiLCAoY2hhbmdlTGlzdCkgLT5cblx0XHRcdFV0aWxzLmRlbGF5IDAsID0+XG5cdFx0XHRcdEBhZGRWaWV3IHN1YkxheWVyLCB0cnVlIGZvciBzdWJMYXllciBpbiBjaGFuZ2VMaXN0LmFkZGVkXG5cblx0YWRkVmlldzogKHZpZXcsIHZpYUludGVybmFsQ2hhbmdlRXZlbnQpIC0+XG5cblx0XHR2bmNXaWR0aCAgPSBAb3B0aW9ucy53aWR0aFxuXHRcdHZuY0hlaWdodCA9IEBvcHRpb25zLmhlaWdodFxuXG5cdFx0dmlldy5zdGF0ZXMuYWRkXG5cdFx0XHRcIiN7IFBVU0guVVAgfVwiOlxuXHRcdFx0XHR4OiAwXG5cdFx0XHRcdHk6IC12bmNIZWlnaHRcblx0XHRcdFwiI3sgUFVTSC5MRUZUIH1cIjpcblx0XHRcdFx0eDogLXZuY1dpZHRoXG5cdFx0XHRcdHk6IDBcblx0XHRcdFwiI3sgUFVTSC5DRU5URVIgfVwiOlxuXHRcdFx0XHR4OiAwXG5cdFx0XHRcdHk6IDBcblx0XHRcdFwiI3sgUFVTSC5SSUdIVCB9XCI6XG5cdFx0XHRcdHg6IHZuY1dpZHRoXG5cdFx0XHRcdHk6IDBcblx0XHRcdFwiI3sgUFVTSC5ET1dOIH1cIjpcblx0XHRcdFx0eDogMFxuXHRcdFx0XHR5OiB2bmNIZWlnaHRcblxuXHRcdHZpZXcuc3RhdGVzLmFuaW1hdGlvbk9wdGlvbnMgPSBAYW5pbWF0aW9uT3B0aW9uc1xuXG5cdFx0aWYgdmlldy5uYW1lIGlzIEBpbml0aWFsVmlld05hbWVcblx0XHRcdEBpbml0aWFsVmlldyA9IHZpZXdcblx0XHRcdEBjdXJyZW50VmlldyA9IHZpZXdcblx0XHRcdHZpZXcuc3RhdGVzLnN3aXRjaEluc3RhbnQgUFVTSC5DRU5URVJcblx0XHRcdEBoaXN0b3J5LnB1c2ggdmlld1xuXHRcdGVsc2Vcblx0XHRcdHZpZXcuc3RhdGVzLnN3aXRjaEluc3RhbnQgUFVTSC5SSUdIVFxuXG5cdFx0dW5sZXNzIHZpZXcuc3VwZXJMYXllciBpcyBAIG9yIHZpYUludGVybmFsQ2hhbmdlRXZlbnRcblx0XHRcdHZpZXcuc3VwZXJMYXllciA9IEBcblxuXHRcdEBfYXBwbHlCYWNrQnV0dG9uIHZpZXcgdW5sZXNzIHZpZXcubmFtZSBpcyBAaW5pdGlhbFZpZXdOYW1lXG5cblx0XHRAdmlld3MucHVzaCB2aWV3XG5cblx0dHJhbnNpdGlvbjogKHZpZXcsIGRpcmVjdGlvbiA9IERJUi5SSUdIVCwgc3dpdGNoSW5zdGFudCA9IGZhbHNlLCBwcmV2ZW50SGlzdG9yeSA9IGZhbHNlKSAtPlxuXG5cdFx0cmV0dXJuIGZhbHNlIGlmIHZpZXcgaXMgQGN1cnJlbnRWaWV3XG5cblx0XHQjIFNldHVwIFZpZXdzIGZvciB0aGUgdHJhbnNpdGlvblxuXHRcdGlmIGRpcmVjdGlvbiBpcyBESVIuUklHSFRcblx0XHRcdHZpZXcuc3RhdGVzLnN3aXRjaEluc3RhbnQgIFBVU0guUklHSFRcblx0XHRcdEBjdXJyZW50Vmlldy5zdGF0ZXMuc3dpdGNoIFBVU0guTEVGVFxuXHRcdGVsc2UgaWYgZGlyZWN0aW9uIGlzIERJUi5ET1dOXG5cdFx0XHR2aWV3LnN0YXRlcy5zd2l0Y2hJbnN0YW50ICBQVVNILkRPV05cblx0XHRcdEBjdXJyZW50Vmlldy5zdGF0ZXMuc3dpdGNoIFBVU0guVVBcblx0XHRlbHNlIGlmIGRpcmVjdGlvbiBpcyBESVIuTEVGVFxuXHRcdFx0dmlldy5zdGF0ZXMuc3dpdGNoSW5zdGFudCAgUFVTSC5MRUZUXG5cdFx0XHRAY3VycmVudFZpZXcuc3RhdGVzLnN3aXRjaCBQVVNILlJJR0hUXG5cdFx0ZWxzZSBpZiBkaXJlY3Rpb24gaXMgRElSLlVQXG5cdFx0XHR2aWV3LnN0YXRlcy5zd2l0Y2hJbnN0YW50ICBQVVNILlVQXG5cdFx0XHRAY3VycmVudFZpZXcuc3RhdGVzLnN3aXRjaCBQVVNILkRPV05cblx0XHRlbHNlXG5cdFx0XHQjIElmIHRoZXkgc3BlY2lmaWVkIHNvbWV0aGluZyBkaWZmZXJlbnQganVzdCBzd2l0Y2ggaW1tZWRpYXRlbHlcblx0XHRcdHZpZXcuc3RhdGVzLnN3aXRjaEluc3RhbnQgUFVTSC5DRU5URVJcblx0XHRcdEBjdXJyZW50Vmlldy5zdGF0ZXMuc3dpdGNoSW5zdGFudCBQVVNILkxFRlRcblxuXHRcdCMgUHVzaCB2aWV3IHRvIENlbnRlclxuXHRcdHZpZXcuc3RhdGVzLnN3aXRjaCBQVVNILkNFTlRFUlxuXHRcdCMgY3VycmVudFZpZXcgaXMgbm93IG91ciBwcmV2aW91c1ZpZXdcblx0XHRAcHJldmlvdXNWaWV3ID0gQGN1cnJlbnRWaWV3XG5cdFx0IyBTYXZlIHRyYW5zaXRpb24gZGlyZWN0aW9uIHRvIHRoZSBsYXllcidzIGN1c3RvbSBwcm9wZXJ0aWVzXG5cdFx0QHByZXZpb3VzVmlldy5jdXN0b20gPVxuXHRcdFx0bGFzdFRyYW5zaXRpb246IGRpcmVjdGlvblxuXHRcdCMgU2V0IG91ciBjdXJyZW50VmlldyB0byB0aGUgdmlldyB3ZSd2ZSBicm91Z2h0IGluXG5cdFx0QGN1cnJlbnRWaWV3ID0gdmlld1xuXG5cdFx0IyBTdG9yZSB0aGUgbGFzdCB2aWV3IGluIGhpc3Rvcnlcblx0XHRAaGlzdG9yeS5wdXNoIEBwcmV2aW91c1ZpZXcgaWYgcHJldmVudEhpc3RvcnkgaXMgZmFsc2Vcblx0XHRcblx0XHQjIEVtaXQgYW4gZXZlbnQgc28gdGhlIHByb3RvdHlwZSBjYW4gcmVhY3QgdG8gYSB2aWV3IGNoYW5nZVxuXHRcdEBlbWl0IFwiY2hhbmdlOnZpZXdcIlxuXG5cdHJlbW92ZUJhY2tCdXR0b246ICh2aWV3KSAtPlxuXHRcdFV0aWxzLmRlbGF5IDAsID0+XG5cdFx0XHR2aWV3LnN1YkxheWVyc0J5TmFtZShCQUNLQlVUVE9OX1ZJRVdfTkFNRSlbMF0udmlzaWJsZSA9IGZhbHNlXG5cblx0YmFjazogKCkgLT5cblx0XHRsYXN0VmlldyA9IEBfZ2V0TGFzdEhpc3RvcnlJdGVtKClcblx0XHRsYXN0VHJhbnNpdGlvbiA9IGxhc3RWaWV3LmN1c3RvbS5sYXN0VHJhbnNpdGlvblxuXHRcdG9wcG9zaXRlVHJhbnNpdGlvbiA9IEBfZ2V0T3Bwb3NpdGVEaXJlY3Rpb24obGFzdFRyYW5zaXRpb24pXG5cdFx0QHRyYW5zaXRpb24obGFzdFZpZXcsIGRpcmVjdGlvbiA9IG9wcG9zaXRlVHJhbnNpdGlvbiwgc3dpdGNoSW5zdGFudCA9IGZhbHNlLCBwcmV2ZW50SGlzdG9yeSA9IHRydWUpXG5cdFx0QGhpc3RvcnkucG9wKClcblxuXHRfZ2V0TGFzdEhpc3RvcnlJdGVtOiAoKSAtPlxuXHRcdHJldHVybiBAaGlzdG9yeVtAaGlzdG9yeS5sZW5ndGggLSAxXVxuXG5cdF9hcHBseUJhY2tCdXR0b246ICh2aWV3LCBmcmFtZSA9IEBiYWNrQnV0dG9uRnJhbWUpIC0+XG5cdFx0VXRpbHMuZGVsYXkgMCwgPT5cblx0XHRcdGlmIHZpZXcuYmFja0J1dHRvbiBpc250IGZhbHNlXG5cdFx0XHRcdGJhY2tCdXR0b24gPSBuZXcgTGF5ZXJcblx0XHRcdFx0XHRuYW1lOiBCQUNLQlVUVE9OX1ZJRVdfTkFNRVxuXHRcdFx0XHRcdHdpZHRoOiA4MFxuXHRcdFx0XHRcdGhlaWdodDogODBcblx0XHRcdFx0XHRzdXBlckxheWVyOiB2aWV3XG5cblx0XHRcdFx0aWYgQGRlYnVnTW9kZSBpcyBmYWxzZVxuXHRcdFx0XHRcdGJhY2tCdXR0b24uYmFja2dyb3VuZENvbG9yID0gXCJ0cmFuc3BhcmVudFwiXG5cblx0XHRcdFx0YmFja0J1dHRvbi5mcmFtZSA9IGZyYW1lXG5cblx0XHRcdFx0YmFja0J1dHRvbi5vbiBFdmVudHMuQ2xpY2ssID0+XG5cdFx0XHRcdFx0QGJhY2soKVxuXG5cdF9nZXRPcHBvc2l0ZURpcmVjdGlvbjogKGluaXRpYWxEaXJlY3Rpb24pIC0+XG5cdFx0aWYgaW5pdGlhbERpcmVjdGlvbiBpcyBESVIuVVBcblx0XHRcdHJldHVybiBESVIuRE9XTlxuXHRcdGVsc2UgaWYgaW5pdGlhbERpcmVjdGlvbiBpcyBESVIuRE9XTlxuXHRcdFx0cmV0dXJuIERJUi5VUFxuXHRcdGVsc2UgaWYgaW5pdGlhbERpcmVjdGlvbiBpcyBESVIuUklHSFRcblx0XHRcdHJldHVybiBESVIuTEVGVFxuXHRcdGVsc2UgaWYgaW5pdGlhbERpcmVjdGlvbiBpcyBESVIuTEVGVFxuXHRcdFx0cmV0dXJuIERJUi5SSUdIVFxuXHRcdGVsc2Vcblx0XHRcdHJldHVybiBESVIuTEVGVFxuXG4jIyNcblxuVVNBR0UgRVhBTVBMRSAxIC0gRGVmaW5lIEluaXRpYWxWaWV3TmFtZVxuXG5pbml0aWFsVmlld0tleSA9IFwidmlldzFcIlxuXG52bmMgPSBuZXcgVmlld05hdmlnYXRpb25Db250cm9sbGVyXG5cdGluaXRpYWxWaWV3TmFtZTogaW5pdGlhbFZpZXdLZXlcblxudmlldzEgPSBuZXcgTGF5ZXJcblx0bmFtZTogaW5pdGlhbFZpZXdLZXlcblx0d2lkdGg6ICBTY3JlZW4ud2lkdGhcblx0aGVpZ2h0OiBTY3JlZW4uaGVpZ2h0XG5cdGJhY2tncm91bmRDb2xvcjogXCJyZWRcIlxuXHRwYXJlbnQ6IHZuY1xuXG4jIyNcbiMjI1xuXG5VU0FHRSBFWEFNUExFIDIgLSBVc2UgZGVmYXVsdCBpbml0aWFsVmlld05hbWUgXCJpbml0aWFsVmlld1wiXG5cbnZuYyA9IG5ldyBWaWV3TmF2aWdhdGlvbkNvbnRyb2xsZXJcblxudmlldzEgPSBuZXcgTGF5ZXJcblx0bmFtZTogXCJpbml0aWFsVmlld1wiXG5cdHdpZHRoOiAgU2NyZWVuLndpZHRoXG5cdGhlaWdodDogU2NyZWVuLmhlaWdodFxuXHRiYWNrZ3JvdW5kQ29sb3I6IFwicmVkXCJcblx0cGFyZW50OiB2bmNcblxudmlldzIgPSBuZXcgTGF5ZXJcblx0d2lkdGg6ICBTY3JlZW4ud2lkdGhcblx0aGVpZ2h0OiBTY3JlZW4uaGVpZ2h0XG5cdGJhY2tncm91bmRDb2xvcjogXCJncmVlblwiXG5cdHBhcmVudDogdm5jXG5cbnZpZXcxLm9uQ2xpY2sgLT5cblx0dm5jLnRyYW5zaXRpb24gdmlldzJcblxudmlldzIub25DbGljayAtPlxuXHR2bmMuYmFjaygpXG5cbiMjIyIsIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJl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
