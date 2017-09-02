'use strict';

// NN library
(function (window) {

  'use strict';

  function define_nn() {
    var nn = {};
    function isObject(obj) {
      return obj === Object(obj);
    }
    function isString(str) {
      return typeof str === 'string';
    }
    nn.for = function ($options, callback) {
      for (var i = 0; i < $options.length; i++) {
        if (callback(i, $options[i]) === false) break;
      }
    };
    nn.create = function ($options, target) {
      if (isObject($options)) {
        var thisTag;
        if (isString($options.tag)) {
          thisTag = document.createElement($options.tag);
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
    };
    nn.shorten = function (str, maxLen, separator) {
      separator = ' ';
      if (typeof str !== 'string') return console.error(str + ' is not a string');
      if (str.length <= maxLen) {
        return str;
      }
      return str.substr(0, str.lastIndexOf(separator, maxLen)) + '...';
    };
    nn.cleanHTMLTags = function (str) {
      if (typeof str !== 'string') return console.error(str + ' is not a string');
      str = str.replace(/<(?:.|\n)*?>/gm, '');
      return str;
    };
    return nn;
  }
  //define globally if it doesn't already exist
  if (typeof nn === 'undefined') {
    window.nn = define_nn();
  } else {
    console.log("Library already defined.");
  }
})(window);

var Globals = {
  map: document.getElementById('map')
};

document.addEventListener('DOMContentLoaded', function (evt) {
  function buildPosts(data) {
    var counter = 0;
    var posts = data.posts.data;
    var postsContainer = document.getElementById('posts-container');
    // console.log(posts);
    nn.create({
      tag: 'div',
      id: 'posts-carousel',
      dataAttr: [{
        attr: 'data-ride',
        value: 'carousel'
      }],
      className: 'carousel slide'
    }, postsContainer);
    nn.create({
      tag: 'ol',
      className: 'carousel-indicators'
    }, postsContainer.querySelector('#posts-carousel'));
    nn.create({
      tag: 'div',
      className: 'carousel-inner'
    }, postsContainer.querySelector('#posts-carousel'));

    nn.for(posts, function (i, post) {
      // console.log(post);
      if (post.story || post.message) {
        nn.create({
          tag: 'li',
          dataAttr: [{
            attr: 'data-target',
            value: '#posts-carousel'
          }, {
            attr: 'data-slide-to',
            value: counter
          }],
          className: counter === 0 ? ' active ' : ''
        }, postsContainer.querySelector('.carousel-indicators'));
        nn.create({
          tag: 'div',
          className: 'carousel-item ' + (counter === 0 ? ' active' : ''),
          id: 'post-' + counter
        }, postsContainer.querySelector('.carousel-inner'));
        var thisPost = document.getElementById('post-' + counter);
        $.ajax({
          method: 'GET',
          cache: true,
          dataType: 'json',
          url: 'https://graph.facebook.com/' + post.id + '/attachments?access_token=503457173353795|d13bc5fd011232eeaa4b5da6b720a2e4',
          async: false,
          success: function success(data) {
            // console.log(data);
            nn.create({
              tag: 'div',
              id: 'row-' + counter,
              className: 'row'
            }, thisPost);
            var thisRow = postsContainer.querySelector('#row-' + counter);
            nn.create({
              tag: 'img',
              dataAttr: [{
                attr: 'src',
                value: data.data["0"].media.image.src
              }, {
                attr: 'alt',
                value: post.message ? post.message : post.story
              }],
              id: 'bg-div-' + counter,
              className: 'col-sm-6'
            }, thisRow);
            var thisPlace = void 0;
            $.ajaxSetup({ async: false });
            $.get('https://graph.facebook.com/' + post.id + '?access_token=503457173353795|d13bc5fd011232eeaa4b5da6b720a2e4&fields=place', function (place) {
              // console.log(place);
              thisPlace = place;
              // console.log(thisPlace);
            });
            nn.create({
              tag: 'div',
              className: 'carousel-caption col-sm-auto col-sm-5',
              inner: '<h5 class="left">' + (post.story ? post.story : post.message) + '</h5>\n                            <p class="white left">' + (post.message ? nn.shorten(post.message, 140, '&nbsp;...') : nn.shorten(post.story, 130, '&nbsp;...')) + '</p>\n                            <span class="date white center block">' + post.created_time.slice(0, 10) + '</span>\n                            <span class="date white center block">' + (thisPlace.place !== undefined ? thisPlace.place.name : '') + '</span>'
            }, thisRow);
            var thisImage = document.getElementById('bg-div-' + counter);
            // console.log(thisImage);
            // thisImage.style.backgroundImage = 'url(' + thisImage.getAttribute('data-src') + ')';
            thisImage.style.height = 'auto';
            thisImage.style.maxHeight = '250px';
            thisImage.style.width = '100%';
            // thisImage.style.backgroundPosition = 'center';
            // thisImage.style.backgroundSize = 'cover';
            // thisImage.style.position = 'relative';
            // thisImage.style.width = '90%';
            // thisImage.style.margin = '0 auto';
          }
        });
        counter++;
      }
      // const postsImages = document.querySelectorAll('div[data-src]');
      // nn.for(postsImages, function(i, post) {
      //     post.style.
      // });
    });
    nn.create({
      tag: 'a',
      className: 'carousel-control-prev',
      dataAttr: [{
        attr: 'href',
        value: '#posts-carousel'
      }, {
        attr: 'role',
        value: 'button'
      }, {
        attr: 'data-slide',
        value: 'prev'
      }],
      inner: '<span class="carousel-control-prev-icon" aria-hidden="true"></span>\n            <span class="sr-only">Prev</span>'
    }, postsContainer.querySelector('#posts-carousel'));
    nn.create({
      tag: 'a',
      className: 'carousel-control-next',
      dataAttr: [{
        attr: 'href',
        value: '#posts-carousel'
      }, {
        attr: 'role',
        value: 'button'
      }, {
        attr: 'data-slide',
        value: 'next'
      }],
      inner: '<span class="carousel-control-next-icon" aria-hidden="true"></span>\n            <span class="sr-only">Next</span>'
    }, postsContainer.querySelector('#posts-carousel'));
  }
  function createMap(ids) {
    var map = void 0;
    map = new google.maps.Map(Globals.map, {
      gestureHandling: 'none',
      zoom: 4,
      center: { lat: 51.996629, lng: -2.156587 },
      disableDefaultUI: true,
      styles: [{
        "elementType": "geometry",
        "stylers": [{
          "color": "#212121"
        }]
      }, {
        "elementType": "labels.icon",
        "stylers": [{
          "visibility": "off"
        }]
      }, {
        "elementType": "labels.text.fill",
        "stylers": [{
          "color": "#757575"
        }]
      }, {
        "elementType": "labels.text.stroke",
        "stylers": [{
          "color": "#212121"
        }]
      }, {
        "featureType": "administrative",
        "elementType": "geometry",
        "stylers": [{
          "color": "#757575"
        }]
      }, {
        "featureType": "administrative.country",
        "elementType": "labels.text.fill",
        "stylers": [{
          "color": "#9e9e9e"
        }]
      }, {
        "featureType": "administrative.land_parcel",
        "stylers": [{
          "visibility": "off"
        }]
      }, {
        "featureType": "administrative.locality",
        "elementType": "labels.text.fill",
        "stylers": [{
          "color": "#bdbdbd"
        }]
      }, {
        "featureType": "administrative.neighborhood",
        "stylers": [{
          "visibility": "off"
        }]
      }, {
        "featureType": "poi",
        "elementType": "labels.text.fill",
        "stylers": [{
          "color": "#757575"
        }]
      }, {
        "featureType": "poi.park",
        "elementType": "geometry",
        "stylers": [{
          "color": "#181818"
        }]
      }, {
        "featureType": "poi.park",
        "elementType": "labels.text.fill",
        "stylers": [{
          "color": "#616161"
        }]
      }, {
        "featureType": "poi.park",
        "elementType": "labels.text.stroke",
        "stylers": [{
          "color": "#1b1b1b"
        }]
      }, {
        "featureType": "road",
        "elementType": "geometry.fill",
        "stylers": [{
          "color": "#2c2c2c"
        }]
      }, {
        "featureType": "road",
        "elementType": "labels",
        "stylers": [{
          "visibility": "off"
        }]
      }, {
        "featureType": "road",
        "elementType": "labels.text.fill",
        "stylers": [{
          "color": "#8a8a8a"
        }]
      }, {
        "featureType": "road.arterial",
        "stylers": [{
          "visibility": "off"
        }]
      }, {
        "featureType": "road.arterial",
        "elementType": "geometry",
        "stylers": [{
          "color": "#373737"
        }]
      }, {
        "featureType": "road.highway",
        "elementType": "geometry",
        "stylers": [{
          "color": "#3c3c3c"
        }]
      }, {
        "featureType": "road.highway",
        "elementType": "labels",
        "stylers": [{
          "visibility": "off"
        }]
      }, {
        "featureType": "road.highway.controlled_access",
        "elementType": "geometry",
        "stylers": [{
          "color": "#4e4e4e"
        }]
      }, {
        "featureType": "road.local",
        "stylers": [{
          "visibility": "off"
        }]
      }, {
        "featureType": "road.local",
        "elementType": "labels.text.fill",
        "stylers": [{
          "color": "#616161"
        }]
      }, {
        "featureType": "transit",
        "elementType": "labels.text.fill",
        "stylers": [{
          "color": "#757575"
        }]
      }, {
        "featureType": "water",
        "elementType": "geometry",
        "stylers": [{
          "color": "#000000"
        }]
      }, {
        "featureType": "water",
        "elementType": "labels.text",
        "stylers": [{
          "visibility": "off"
        }]
      }, {
        "featureType": "water",
        "elementType": "labels.text.fill",
        "stylers": [{
          "color": "#3d3d3d"
        }]
      }]
    });
    var markerBounds = new google.maps.LatLngBounds();
    var mapPoint = void 0;
    nn.for(ids, function (i, id) {
      $.ajax({
        dataType: 'json',
        url: 'https://graph.facebook.com/' + id + '?access_token=503457173353795|d13bc5fd011232eeaa4b5da6b720a2e4&fields=place,name',
        success: function success(place) {
          console.log(place);
          if (place.place) {
            var marker = new google.maps.Marker({
              position: { lat: place.place.location.latitude, lng: place.place.location.longitude },
              map: map
            });
            mapPoint = new google.maps.LatLng(place.place.location.latitude, place.place.location.longitude);
            markerBounds.extend(mapPoint);
            map.fitBounds(markerBounds);
            var infowindow = new google.maps.InfoWindow({
              content: '<p>' + place.name + '</p>'
            });
            console.log(place.name);
            google.maps.event.addListener(marker, 'click', function () {
              infowindow.open(map, marker);
            });
          }
        }
      });
    });
    google.maps.event.addListenerOnce(map, 'bounds_changed', function (event) {
      if (this.getZoom()) {
        this.setZoom(10);
      }
    });
  }
  $.ajax({
    cache: true,
    dataType: 'json',
    url: 'https://graph.facebook.com/v2.3/devAppJavaScript/?access_token=503457173353795|d13bc5fd011232eeaa4b5da6b720a2e4&fields=posts',
    success: function success(data) {
      buildPosts(data);
      var postsIds = new Array();
      nn.for(data.posts.data, function (i, post) {
        postsIds.push(post.id);
      });
      createMap(postsIds);
    }
  });
});