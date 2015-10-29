var leapOn = true;
var previousFrame;
var currentPitch=0;
var currentHeading=265;
var allFingersExtended=false;

var hand;
var hands;
var left;
var right;
var middleFingerExtended;
var indexFingerExtended;
var ringFingerExtended;
var pinkyExtended;
var thumbExtended;

var twitterClicked = false;
var translinkClicked = false;
var placesClicked = false;
var instagramClicked = false;

var driveAround = false;
var directionsSearchOpen = false;

var helpOpen = false;
var burnsEgg = false;
var middleFingerEgg = false;
var spockEgg = false;

var minBurns = 45;


var minDistOneSpk = 35;
var minDistTwoSpk = 45;
var minDistThreeSpk = 23;
var minDistFourSpk = 90;


function leapStreetView(frame) {


  var leftHandOnly = leftOnly(frame)
  var rightHandOnly = rightOnly(frame)
  var bothHands = bothHandsDetected(frame)


  // Always detect if hands are present
  if (frame.valid) {
    detectHands(frame)
  };

  if (leftHandOnly) {
    hand = frame.hands[0];
    leftHandControls(hand)
  }

  if (rightHandOnly) {
    hand = frame.hands[0];
    righthandControls(hand)
  }

  if (bothHands) {
    hands = frame.hands
    bothHandControls(hands)
  }

  previousFrame = frame;

};

// True or false if only the left hand is in the frame
function leftOnly(frame) {
  if (frame.valid
   && frame.hands.length == 1
   && frame.hands[0].type == 'left'
   && previousFrame) {
    return true
  } else {
    return false
  }
}
// True or false if only the right hand is in the frame
function rightOnly(frame) {
  if (frame.valid
   && frame.hands.length == 1
   && frame.hands[0].type == 'right'
   && previousFrame) {
    return true
  } else {
    return false
  }
}

function bothHandsDetected(frame) {
  if (frame.valid
   && frame.hands.length == 2
   && previousFrame) {
    return true
  } else {
    return false
  }
}

// This tells us which hands are in the frame by
// lighting up the hands icon on the page
function detectHands (frame) {

  hands = frame.hands;

  if (hands.length == 0) {
    $('#right-hand-icon').removeClass('detected');
    $('#left-hand-icon').removeClass('detected');
  };

  if (hands.length == 1) {
    if (hands[0].type=='right') {
      $('#left-hand-icon').removeClass('detected');
      $('#right-hand-icon').addClass('detected');
    } else {
      $('#right-hand-icon').removeClass('detected');
      $('#left-hand-icon').addClass('detected');
    }
  };

  if (hands.length == 2) {
    $('#right-hand-icon').addClass('detected');
    $('#left-hand-icon').addClass('detected');
  };

};



// Left hand only functions go here

function leftHandControls (hand) {
  openMenu(hand);
  toggleMarkers(hand);
  scrollUpOrDown(hand);
}

function toggleMarkers (hand) { 

  var palmX = hand.palmNormal[0];
  var handVelocX = hand.palmVelocity[0];
  var handTranX = hand._translation[0];

  var middleFingerExtended = hand.middleFinger.extended;
  var indexFingerExtended = hand.indexFinger.extended;
  var ringFingerExtended = hand.ringFinger.extended;
  var pinkyExtended = hand.pinky.extended;
  var thumbExtended = hand.thumb.extended;
  // This toggles the twitter checkbox to true
  if (indexFingerExtended
   && !(ringFingerExtended)
   && !(thumbExtended)
   && !(middleFingerExtended)
   && !(pinkyExtended)
   && palmX < 0.3
   && palmX > -0.3
   && hand.confidence > 0.35
   && !($('#wrapper').hasClass('toggled'))
   && !(twitterClicked)
   && hand.pinchStrength < 0.85) {

    if (placesClicked) {
      placesClicked = false
      $('#add-places').trigger('click');
    };

    if (translinkClicked) {
      translinkClicked = false;
      $('#add-translink').trigger('click');
    };

    if (instagramClicked) {
      instagramClicked = false;
      $('#add-instagram').trigger('click');
    }

    twitterClicked = true;
    $('#add-tweets').trigger('click');

  }
  // This toggles the Google Places checkbox to true
  if (indexFingerExtended
   && middleFingerExtended
   && !thumbExtended
   && !ringFingerExtended
   && !pinkyExtended
   && palmX < 0.3
   && palmX > -0.3
   && hand.confidence > 0.35
   && !($('#wrapper').hasClass('toggled'))
   && !(placesClicked)
   && hand.pinchStrength < 0.55) {

    if (twitterClicked) {
      twitterClicked = false;
      $('#add-tweets').trigger('click');
    };

    if (translinkClicked) {
      translinkClicked = false;
      $('#add-translink').trigger('click');
    };

    if (instagramClicked) {
      instagramClicked = false;
      $('#add-instagram').trigger('click');
    }

    placesClicked = true;
    $('#add-places').trigger('click');
  }

  if (indexFingerExtended
   && thumbExtended
   && middleFingerExtended
   && !ringFingerExtended
   && !pinkyExtended
   && palmX < 0.3
   && palmX > -0.3
   && hand.confidence > 0.35
   && !($('#wrapper').hasClass('toggled'))
   && !(translinkClicked)
   && hand.pinchStrength < 0.1) {

    if (twitterClicked) {
      twitterClicked = false;
      $('#add-tweets').trigger('click');
    };

    if (placesClicked) {
      placesClicked = false;
      $('#add-places').trigger('click');
    };

    if (instagramClicked) {
      instagramClicked = false;
      $('#add-instagram').trigger('click');
    }

      translinkClicked = true;
    $('#add-translink').trigger('click');
  }

  if (indexFingerExtended
   && !thumbExtended
   && middleFingerExtended
   && ringFingerExtended
   && pinkyExtended
   && palmX < 0.3
   && palmX > -0.3
   && hand.confidence > 0.35
   && !($('#wrapper').hasClass('toggled'))
   && !(instagramClicked)
   && hand.pinchStrength < 0.1) {

    if (twitterClicked) {
      twitterClicked = false;
      $('#add-tweets').trigger('click');
    };

    if (placesClicked) {
      placesClicked = false;
      $('#add-places').trigger('click');
    };

    if (translinkClicked) {
      translinkClicked = false;
      $('#add-translink').trigger('click');
    }

      instagramClicked = true;
    $('#add-instagram').trigger('click');
  }

    // Removes all checkboxes

  if (hand.grabStrength == 1
   && !($('#wrapper').hasClass('toggled'))
   && !indexFingerExtended
   && !middleFingerExtended
   && !ringFingerExtended
   && !pinkyExtended) {

    if (twitterClicked) {
      $('#add-tweets').trigger('click');
    };

    if (placesClicked) {
      $('#add-places').trigger('click');
    };
    if (translinkClicked) {
      $('#add-translink').trigger('click');
    };

    if (instagramClicked) {
      $('#add-instagram').trigger('click');
    }


    instagramClicked = false;
    twitterClicked = false;
    translinkClicked = false;
    placesClicked = false;
  }
}

function scrollUpOrDown (hand) {
  // var scrollYMax = Math.min(380.9, window.scrollY += 10)
  // var scrollYMin = Math.max(window.scrollY -= 10, 0)
  //moves window down
  if (hand.pinchStrength > 0.7
   && hand._translation[1] > 1
   && $('#wrapper').hasClass('toggled')) {
    window.scroll(0, window.scrollY += 50);
  }

  //moves window up

  if (hand.pinchStrength > 0.7
   && hand._translation[1] < -1
   && $('#wrapper').hasClass('toggled')) {
    window.scroll(0, window.scrollY -= 100);
  }

  if (window.scrollY > 1106) {
    window.scrollY = 1106
  }

  if (window.scrollY < 0) {
    window.scrollY = 0
  }
}



// Right hand only functions go here

function righthandControls (hand) {

  var middleFingerExtended = hand.middleFinger.extended;
  var indexFingerExtended = hand.indexFinger.extended;
  var ringFingerExtended = hand.ringFinger.extended;
  var pinkyExtended = hand.pinky.extended;
  var thumbExtended = hand.thumb.extended;

  // Tests whether the hand is level so hand won't pitch up/down
  // changes the sunglasses to black when level
  // Should always check
  levelOrNot(hand);

  // Directions Api Controls
  directionsApiMenu(hand)


  // Starting / Stopping Leap Motion. Use right hand to activate/deactivate

  // Close your first with your right hand to deactivate Leap Motion
  if (hand.grabStrength == 1
   && hand.confidence > 0.4) {
    preventMotion()
  }

  // Place right palm opened up near the sensor to turn on
  if (hand.grabStrength < 1
   && hand.palmPosition[0] > -15
   && hand.palmPosition[0] < 20
   && hand.palmPosition[2] > -10
   && hand.palmPosition[2] < 20) {
    allowMotion()
  }

  // Pitch and heading commands
  if (leapOn
    && hand.palmPosition[2] > -25) {
    pitchAndHeading(hand);
  };

  var pov = panorama.getPov();
  // Forward motion achieved by putting palm forward towards laptop
  // Direct heading currently a bit buggy.
  if (hand.palmPosition[2] < -30
   && hand.confidence > 0.25
   && hand.palmPosition[1] < 120) {
    moveForward(hand, pov);
  }

  if (!middleFingerEgg
   && hand.palmNormal[1] >= 0.4
   && hand.palmNormal[2] >= 0.5) {
    middleFingerEgg = true;
    $('#myModalTheFinger').modal('toggle');
  }

  distanceOne = Leap.vec3.distance(hand.pinky.tipPosition, hand.ringFinger.tipPosition);  
  distanceTwo = Leap.vec3.distance(hand.ringFinger.tipPosition, hand.middleFinger.tipPosition);  
  distanceThree = Leap.vec3.distance(hand.middleFinger.tipPosition, hand.indexFinger.tipPosition);  
  distanceFour = Leap.vec3.distance(hand.indexFinger.tipPosition, hand.thumb.tipPosition); 

  if (!spockEgg
   && distanceOne < minDistOneSpk
   && distanceTwo > minDistTwoSpk
   && distanceThree < minDistThreeSpk
   && distanceFour > minDistFourSpk
   && hand.palmNormal[2] >= -0.5) {
    spockEgg = true;
    $('#myModalSpock').modal('toggle');
  }

}

function levelOrNot (hand) {
  if (hand.palmNormal[2] <= 0.1 && hand.palmNormal[2] >= -0.2) {
    $('#sunglasses-icon').removeClass('not-level');
  } else {
    $('#sunglasses-icon').addClass('not-level');
  }
}

function openDriveView () {
  driveAround = true;
  $('#drive-around').trigger('click')
}

function closeDriveView () {
  driveAround = false;
  $('#drive-around').trigger('click')
}

function openDirectionsSearchBar () {
  directionsSearchOpen = true;
  $('#get-directions-modal').trigger('click')
}

function preventMotion() {
  leapOn = false;
  $('#leap-icon').removeClass('leap-on');
  $('#leap-icon').addClass('leap-off');
}

function allowMotion() {
  leapOn = true;
  $('#leap-icon').addClass('leap-on');
  $('#leap-icon').removeClass('leap-off');
}

function pitchAndHeading (hand) {
  var panoNum = null;
  var axis = hand.rotationAxis(previousFrame);
  var palmYPosition = hand.palmPosition[1];
  var palmZPosition = hand.palmPosition[2];
  // These allow me to use different finger arrangments for different commands.
  middleFingerExtended = hand.middleFinger.extended;
  indexFingerExtended = hand.indexFinger.extended;
  ringFingerExtended = hand.ringFinger.extended;
  pinkyExtended = hand.pinky.extended;
  thumbExtended = hand.thumb.extended;

  // Note: All of these actions are in the same function because they control pitch / heading (view) 
  // This controls the up down view of looking at a frame
  if (axis[0] < -0.6
   && hand.palmNormal[2] < -0.2
   && hand.palmPosition[0] < 50
   && palmZPosition > -38) {
    currentPitch = Math.min(90, currentPitch += 0.75);
  }
  if (axis[0] > 0.8
   && hand.palmNormal[2] > 0.1
   && hand.palmPosition[0] < 50
   && palmZPosition > -38) {
    currentPitch = Math.max(currentPitch -= 0.75, -90);
  }
  // currentPitch= -90*axis[0]

  // This control the right left rotation of a street view

  if (axis[2] > 0.7
   && hand.palmNormal[0] < -0.3
   && hand.palmPosition[1] < 150) {
    if (currentHeading > 360) {
      currentHeading = 1;
    } else {
      currentHeading += 1;
    }
  };
  if (axis[2] < -0.7
   && hand.palmNormal[0] > 0.25
   && hand.palmPosition[1] < 150) {
    if (currentHeading <= 0) {
      currentHeading = 360;
    } else {
      currentHeading -= 1
    }
  };

  panorama.setPov({
    heading: currentHeading,
    pitch: currentPitch
  });

};

function moveForward (hand, pov) {
  links = panorama.getLinks();
  if (links) {
    var linksABS = links.map(function (a){
      return {
        'heading': (Math.abs(a['heading'] - pov.heading)),
        'description': a['description'],
        'pano': a['pano']
      }
    });
  linksABS.sort(function (a,b){ return a['heading'] - b['heading']});
  panorama.setPano(linksABS[0]['pano']);
  };
};


function openMenu (hand) {

  var palmX = hand.palmNormal[0];
  var handVelocX = hand.palmVelocity[0];
  var handTranX = hand._translation[0];

  var middleFingerExtended = hand.middleFinger.extended;
  var indexFingerExtended = hand.indexFinger.extended;
  var ringFingerExtended = hand.ringFinger.extended;
  var pinkyExtended = hand.pinky.extended;
  var thumbExtended = hand.thumb.extended;

  // These two gestures open and close the side-menu

  // Close menu
  if ($('#wrapper').hasClass('toggled')
   && hand._translation[0] > 6 
   && palmX > 0.8
   && hand.palmPosition[2] < -10) {
    $("#wrapper").toggleClass("toggled");
    $('#menu-toggle span').toggleClass("glyphicon-chevron-right").toggleClass("glyphicon-chevron-left");
  }
  // Open menu
  if (!($('#wrapper').hasClass('toggled'))
   && hand._translation[0] < -2.5
   && palmX <= -0.7
   && hand.palmPosition[2] < -10) {
    $("#wrapper").toggleClass("toggled");
    $('#menu-toggle span').toggleClass("glyphicon-chevron-right").toggleClass("glyphicon-chevron-left");
  }
}

function directionsApiMenu (hand) {

  if (hand.palmPosition[0] > 60
   && hand.palmPosition[1] > 125
   && !driveAround
   && indexFingerExtended
   && !middleFingerExtended
   && !ringFingerExtended
   && !thumbExtended
   && !pinkyExtended
   && hand.confidence > 0.25) {
    openDriveView();
  }

  if (hand.palmPosition[0] > 60
   && hand.palmPosition[1] > 125
   && driveAround
   && indexFingerExtended
   && middleFingerExtended
   && !thumbExtended
   && !ringFingerExtended
   && !pinkyExtended
   && hand.confidence > 0.25) {
    closeDriveView();
  }

  if (hand.palmPosition[0] > 60
   && hand.palmPosition[1] > 125
   && driveAround
   && indexFingerExtended
   && middleFingerExtended
   && thumbExtended
   && !ringFingerExtended
   && !pinkyExtended
   && hand.confidence > 0.25
   && $('#map').hasClass('half-left')
   && !directionsSearchOpen) {
    openDirectionsSearchBar();
  }
}

// Both hand controls and functions go below here

function bothHandControls(hands) {

  // Figuring which hand is which from our frame.
  if (hands[0].type == 'left') {
    left = hands[0]
    right = hands[1]
  } else {
    left = hands[1]
    right = hands[0]
  }


  distBurnsOne = Leap.vec3.distance(left.pinky.tipPosition, right.pinky.tipPosition);
  distBurnsTwo = Leap.vec3.distance(left.ringFinger.tipPosition, right.ringFinger.tipPosition);    
  distBurnsThree = Leap.vec3.distance(left.middleFinger.tipPosition, right.middleFinger.tipPosition);
  distBurnsFour = Leap.vec3.distance(left.indexFinger.tipPosition, right.indexFinger.tipPosition);    
  distBurnsFive = Leap.vec3.distance(left.thumb.tipPosition, right.thumb.tipPosition);

  if (!burnsEgg
   && distBurnsOne < minBurns
   && distBurnsTwo < minBurns
   && distBurnsThree < minBurns
   && distBurnsFour < minBurns
   && distBurnsFive < minBurns) {
    burnsEgg = true;
    $('#myModalMrBurns').modal('toggle');
  }

}


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

    if (dotProduct  >  0) {
      clockwise = true;
    }

    return clockwise;
}

// Gestures being worked on:

  // // Opens help meunu
  // if (frame.gestures.length > 0
  //   && previousFrame) {
  //   frame.gestures.forEach(function(gesture) {
  //     filterGesture('keyTap', streetViewKeyTap)(frame, gesture);
  //   });
  // }
  // if(frame.valid && frame.gestures.length > 0){
  //   // console.log(frame.gestures);
  //   // debugger;
  //     frame.gestures.forEach(function(gesture){
  //       filterGesture("swipe", streetViewSwipe)(frame, gesture);
  //     });
  //     return;
  // }


// Experiments with pinching

  // if (frame.valid
  //  && frame.hands.length == 1
  //  && frame.hands[0].type == 'left') {
  //   hand = frame.hands[0] 
  //   pinching(hand)
  // }

// function pinching (hand) {

//   if(hand.pinchStrength >= 0.85) {
//     var pinchingFinger = findPinchingFingerType(hand);
//     console.log(pinchingFinger.type);
//   }

//   function findPinchingFingerType(hand) {
//     var pincher;
//     var closest = 500;
//     for(var f = 1; f < 5; f++) {
//         current = hand.fingers[f];
//         distance = Leap.vec3.distance(hand.thumb.tipPosition, current.tipPosition);
//         if(current != hand.thumb && distance < closest)
//         {
//             closest = distance;
//             pincher = current; 
//         }
//     } 
//     return pincher;
//   }
// }

  // Filtures Gestures
  // if(frame.valid && frame.gestures.length > 0){
  //   // console.log(frame.gestures);
  //   // debugger;
  //     frame.gestures.forEach(function(gesture){
  //       console.log(gesture)
  //       filterGesture("key", streetViewSwipe)(frame, gesture);
  //     });
  //     return;
  // }
  // if (!frame.valid) { 
  //   leapOn = false;
  // }

// var indexFinger = 1;

// function streetViewKeyTap(frame, gesture) {
//   $('#myModalHelp').modal('toggle')
// };



