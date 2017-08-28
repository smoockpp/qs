// NN library
(function(window) {

    'use strict';
    function define_nn(){
        var nn = {};
        function isObject(obj) {
            return obj === Object(obj);
        }
        function isString(str) {
            return typeof str === 'string';
        }
        nn.for = function($options, callback) {
            for(var i = 0; i < $options.length; i++) {
                if ( callback(i, $options[i]) === false ) break;
            }
        }
        nn.create = function($options, target) {
            if (isObject($options)) {
                var thisTag;
                if (isString($options.tag)) {
                    thisTag = document.createElement($options.tag)
                    if ($options.className) {
                        thisTag.className = $options.className;
                    }
                    if ($options.id) {
                        thisTag.id = $options.id;
                    }
                    if ($options.inner) {
                        thisTag.innerHTML = $options.inner;
                    }
                    if ($options.dataAttr) {
                        for (var i = 0; i < $options.dataAttr.length; i++) {
                            thisTag.setAttribute($options.dataAttr[i].attr, $options.dataAttr[i].value);
                        }
                    }
                    if ($options.cssText) {
                        thisTag.style.cssText = $options.cssText;
                    }
                    target.appendChild(thisTag);
                } else {
                    console.error(new Error($options.tag + ' is not a String'));
                }
            } else {
                throw new Error($options + ' is not an Object');
            }
        }
        nn.shorten = function(str, maxLen, separator) {
            separator = ' ';
            if (typeof str !== 'string') return console.error(str + ' is not a string');
          if (str.length <= maxLen) {
              return str;
          }
          return str.substr(0, str.lastIndexOf(separator, maxLen)) + '...';
        }
        nn.cleanHTMLTags = function(str) {
            if (typeof str !== 'string') return console.error(str + ' is not a string');
            str = str.replace(/<(?:.|\n)*?>/gm, '');
            return str;
        }
        return nn;
    }
    //define globally if it doesn't already exist
    if(typeof(nn) === 'undefined'){
        window.nn = define_nn();
    }
    else{
        console.log("Library already defined.");
    }
})(window);
