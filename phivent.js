/*
 * runstant
 */

var Phivent = function() {};

Phivent.prototype = {
  on: function(type, listener) {
    if ( this._listeners === undefined ) this._listeners = {};
    
    if (this._listeners[type] === undefined) {
      this._listeners[type] = [];
    }
    this._listeners[type].push(listener);
    return this;
  },
  
  off: function(type, listener) {
    var listeners = this._listeners[type];
    var index = listeners.indexOf(listener);
    if (index != -1) {
      listeners.splice(index,1);
    }
    return this;
  },
  
  fire: function(e) {
    e.target = this;
    var oldEventName = 'on' + e.type;
    if (this[oldEventName]) this[oldEventName](e);
    
    var listeners = this._listeners[e.type];
    if (listeners) {
      var temp = Array.prototype.slice.apply(listeners);;
      for (var i=0,len=temp.length; i<len; ++i) {
        temp[i].call(this, e);
      }
    }
    
    return this;
  },
  
  flare: function(type, options) {
    var e = {type:type};
    if (options) {
      for (var key in options) {
        e[key] = options[key];
      }
    }
    this.fire(e);

    return this;
  },
  
  one: function(type, listener) {
    var self = this;
    
    var newListener = function() {
      var result = listener.apply(self, arguments);
      self.off(type, newListener);
      return result;
    };
    
    this.on(type, newListener);
    
    return this;
  },

  has: function(type) {
    if (this._listeners[type] === undefined && !this["on" + type]) return false;
    return true;
  },
  
  clear: function(type) {
    var oldEventName = 'on' + type;
    if (this[oldEventName]) delete this[oldEventName];
    this._listeners[type] = [];
    return this;
  },

};

Phivent.apply = function(obj) {
  for (var key in Phivent.prototype) {
    obj[key] = Phivent.prototype[key];
  }
  return obj;
};
