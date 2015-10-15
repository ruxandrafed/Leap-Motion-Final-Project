var panorama;
// var leapMotion = require('./leap_motion');
var vancouver = {lat: 49.283324, lng: -123.119452};

var map;
var placesList;
var service;
var infowindow;
var markers = [];
var start;
var end;
var pins = 0;
var waypts = [];
var directionsDisplay;
var leftHandPrev;
var separationStart;
var MAX_ZOOM = 22;
var SEPARATION_SCALING = 1.25;
var LEFT_HAND = 0, RIGHT_HAND = 1;
var X = 0, Y = 1, Z = 2;
var ayMenu = false;

var pointsOfInterestOrigins = [];

var lookupClickedLastFrame = 0;

var streetViewFrameStart = 0;
var streetView = false;
function palmPosition(hand) {
    var position = hand.palmNormal;
    var orientation;
    if (position[1] > 0.75)
        orientation = "up";
    else
        orientation = "down";
    
    return orientation;
}

function move(frame) {

    // This is to catch a bug somewhere that causes the StreetView to not be visible
    // panorama = map.getStreetView();
    // if (panorama.getVisible() === false && streetView === true) {
    //     panorama.setVisible(true);
    //     console.log("Bug avoided");
    //     return;
    // }
       
                
    if(frame.valid && frame.gestures.length > 0){
        frame.gestures.forEach(function(gesture){
            filterGesture("swipe", streetViewSwipe)(frame, gesture);
        });
        return;
    }
  
}


var handMarkers = [];
var HEIGHT_OFFSET = 150;
var BASE_MARKER_SIZE_GRIPPED = 350000, BASE_MARKER_SIZE_UNGRIPPED = 500000;
// function markHands(frame) {
//     var scaling = (4.0 / Math.pow(2, map.getZoom()-1));
//       var bounds = map.getBounds();
//       // FIXME: Sometimes this gets run too early, just exit if its too early.
//       if(!bounds) { return; }
//       var origin = new google.maps.LatLng(bounds.getSouthWest().lat(), bounds.getCenter().lng());
//       var hands = frame.hands;
//       for(var i in hands) {
//           if(hands.hasOwnProperty(i)) {
//             // Limit this to 2 hands for now
//             if(i > RIGHT_HAND) {
//               return;
//             }
//             var hand = hands[i];
//             newCenter = new google.maps.LatLng(origin.lat() + ((hand.stabilizedPalmPosition[1] - HEIGHT_OFFSET) * scaling), origin.lng() + (hand.stabilizedPalmPosition[0] * scaling));
//             // console.log(center.lat() + "," + center.lng());
//             // console.log(newCenter.lat() + "," + newCenter.lng());
//             var gripped = isGripped(hand);
//             var baseRadius = gripped ? BASE_MARKER_SIZE_GRIPPED : BASE_MARKER_SIZE_UNGRIPPED;
//             var handColor = getHandColor(hand);
//             var handMarker = handMarkers[i];
//             if(!handMarker) {
//               handMarker = new google.maps.Circle();
//               handMarkers[i] = handMarker;
//             }
//             handMarker.setOptions({
//               strokeColor: handColor,
//               strokeOpacity: 0.8,
//               strokeWeight: 2,
//               fillColor: handColor,
//               fillOpacity: 0.35,
//               map: map,
//               center: newCenter,
//               radius: baseRadius * scaling
//             });
//           }
//       }
// }

// function menuOpen(frame){
 
//     if(frame.hands.length > 1){
//         var ppx = Math.abs(frame.hands[0].palmPosition[0]) + Math.abs(frame.hands[1].palmPosition[0]);
//         var ppy = Math.abs(frame.hands[0].palmPosition[1]) + Math.abs(frame.hands[1].palmPosition[1]);

//         if( ppx < 50 && (300 < ppy < 350)){
//             document.getElementById("opac").style.visibility = 'visible';
//             document.getElementById("popUpDiv").style.visibility = 'visible';
//             }
//         }

//     if(frame.hands.length > 0){
//       var tip = frame.hands[0].pointables[0].tipPosition[0];

//       console.log(tip);
//       if(isGripped(frame.hands[0]) && tip < -90){
//           document.getElementById("opac").style.visibility = 'hidden';ayMenu = false
//           document.getElementById("popUpDiv").style.visibility = 'hidden';
//         }
//       }
    
//   }
  

// function calcRoute() {
//   //alert(start);
//   //alert(end);
//   var request = {
//       origin:start,
//       destination:end,
//       waypoints:waypts,
//       optimizeWaypoints: true,
//       travelMode: google.maps.TravelMode.DRIVING
//   };
//   directionsService.route(request, function(response, status) {
//     if (status == google.maps.DirectionsStatus.OK) {
//       //alert("sd");
//       directionsDisplay.setDirections(response);
//     }
//   });
//   directionsDisplay.setMap(map);
// }


function streetViewSwipe(frame, swipeGesture) {
  //Classify swipe as either horizontal or vertical
  var isHorizontal = Math.abs(swipeGesture.direction[0]) > Math.abs(swipeGesture.direction[1]);
  //Classify as right-left or up-down
  var swipeDirection;
  if(isHorizontal){
      if(swipeGesture.direction[0] > 0){
          swipeDirection = "right";
      } else {
          swipeDirection = "left";
      }
  } else { //vertical
      if(swipeGesture.direction[1] > 0){
          swipeDirection = "up";
      } else {
          swipeDirection = "down";
      }                  
  }
  
  // var panorama = map.getStreetView(); 
  var pov = panorama.getPov();
  var panoNum;
  var pano0;
  var pano1;
  var links;
  var direction;
        
  if(swipeDirection=="right"){
    panorama.setPov({
      heading: pov.heading + 10,
      pitch:0}
    );
    console.log("right");
    console.log(pov.heading);
  }else if(swipeDirection=="left"){
    panorama.setPov({
        heading: pov.heading - 10,
        pitch:0}
    );
    console.log("left");
    console.log(pov.heading);
  }else if(swipeDirection=="up"){
    links = panorama.getLinks();
    if (links !== undefined) {
        if (links.length > 1) {
            pano0 = Math.abs(links[0]['heading'] - pov.heading);
            pano1 = Math.abs(links[1]['heading'] - pov.heading);
            if (pano0 < pano1) {
                panoNum = 0;
            }
            else {
                panoNum = 1;
            }
            panorama.setPano(links[panoNum]['pano']);
        }
        else {
            panorama.setpano(links[0]['pano']);
        }
        console.log('forward');
        console.log(links);
    }
  }else if(swipeDirection=="down"){
    links = panorama.getLinks();
    if (links !== undefined) {
        if (links.length > 1) {
            pano0 = Math.abs(links[0]['heading'] - pov.heading);
            pano1 = Math.abs(links[1]['heading'] - pov.heading);
            if (pano0 < pano1 ) {
                panoNum = 1;
            }
            else {
                panoNum = 0;
            }
            panorama.setPano(links[panoNum]['pano']);
        }
        else {
            panorama.setpano(links[0]['pano']);
        }
        console.log('back');
        console.log(links);
    }
  }
}

var zoomLevelAtCircleStart;
var INDEX_FINGER = 1;







  // ==== utility functions =====

  /** Returns the truth that a Leap Motion API Hand object is currently in a gripped or "grabbed" state.
  */
  function isGripped(hand) {
    return hand.grabStrength == 1.0;
  }

  function getHandColor(hand) {
      if(isGripped(hand)) {
          return "rgb(0,119,0)";
      } else {
          var tint = Math.round((1.0 - hand.grabStrength) * 119);
          tint = "rgb(119," + tint + "," + tint + ")";
          return tint;
      }
  }

  function filterGesture(gestureType, callback) {
      return function(frame, gesture) {
          if(gesture.type == gestureType) {
              callback(frame, gesture);
          }
      }
  }

  function isClockwise(frame, gesture) {
      var clockwise = false;
      var pointableID = gesture.pointableIds[0];
      var direction = frame.pointable(pointableID).direction;
      var dotProduct = Leap.vec3.dot(direction, gesture.normal);

      if (dotProduct  >  0) clockwise = true;

      return clockwise;
  }



function initialize() {

  // Basic Street View embed for homepage starts here

  // Set up the map
  var map = new google.maps.Map(document.getElementById('streetview'), {
    center: vancouver,
    zoom: 18,
    streetViewControl: false
  });

  // We get the map's default panorama and set up some defaults.\
  panorama = map.getStreetView();
  panorama.setPosition(vancouver);
  panorama.setPov(/** @type {google.maps.StreetViewPov} */({
    heading: 265,
    pitch: 0
  }));
  panorama.setOptions({
    'addressControlOptions': {
    'position': google.maps.ControlPosition.BOTTOM_CENTER
    }
  });

  panorama.setVisible(true);

  Leap.loop({enableGestures: true}, move);

};
