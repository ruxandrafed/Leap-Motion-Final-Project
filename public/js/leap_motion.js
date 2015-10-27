// function palmPosition(hand) {
//     var position = hand.palmNormal;
//     var orientation;
//     if (position[1] > 0.75)
//         orientation = "up";
//     else
//         orientation = "down";

//     return orientation;
// }
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

var helpOpen = false;

function move(frame) {



  // if(frame.valid && frame.gestures.length > 0){
  //   // console.log(frame.gestures);
  //   // debugger;
  //     frame.gestures.forEach(function(gesture){
  //       filterGesture("swipe", streetViewSwipe)(frame, gesture);
  //     });
  //     return;
  // }
  if (!frame.valid) { 
    leapOn = false;
  }

  if (frame.valid) {
    detectHands(frame)
  };

  if (frame.valid 
   && frame.hands.length == 1
   && frame.hands[0].type == 'left') {
    hand = frame.hands[0];
    openMenu(hand);
  }
  //   if (frame.gestures.length > 1) {
  //     frame.gestures.forEach(function(gesture){
  //       filterGesture("circle", streetViewCircle)(frame, gesture);
  //     });
  //   }
  // }
  // if(frame.valid && frame.gestures.length > 0){
  //   // console.log(frame.gestures);
  //   // debugger;
  //     frame.gestures.forEach(function(gesture){
  //       filterGesture("swipe", streetViewSwipe)(frame, gesture);
  //     });
  //     return;
  // }
  // Starting / Stopping Leap Motion. Use right hand to activate/deactivate
  if(frame.valid && frame.hands.length == 1 && frame.hands[0].type=='right') {
    var hand = frame.hands[0];
    // Close your first with your right hand to deactivate Leap Motion
    if (hand.grabStrength == 1
     && hand.type=='right'
     && hand.confidence > 0.4) {
      leapOn = false;
      $('#leap-icon').removeClass('leap-on');
      $('#leap-icon').addClass('leap-off');
    }
    // Place right palm opened up near the sensor to turn on
    if (hand.grabStrength < 1
        && hand.type=='right'
        && hand.palmPosition[0] > -15
        && hand.palmPosition[0] < 20
        && hand.palmPosition[2] > -10
        && hand.palmPosition[2] < 20) {
      leapOn = true;
      $('#leap-icon').addClass('leap-on');
      $('#leap-icon').removeClass('leap-off');
    }
  };
  // Motion commands
  if (frame.valid
   && frame.hands.length == 1
   && frame.hands[0].type=='right'
   && leapOn) {
    hand = frame.hands[0];
    if (!(hand.grabStrength > 0.85)) {
      if (previousFrame) {
        movement(hand);
      }
    };
  };

  if (frame.valid
   && frame.hands.length == 2) {
    hands = frame.hands;
    help(hands);
  }


  previousFrame = frame;

};

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
    };
    if (hands[0].type =='left') {
      $('#right-hand-icon').removeClass('detected');
      $('#left-hand-icon').addClass('detected');
    }
  };

  if (hands.length == 2){
    $('#right-hand-icon').addClass('detected');
    $('#left-hand-icon').addClass('detected');
  };

};

function movement (hand) {
  var panoNum = null;
  var axis = hand.rotationAxis(previousFrame);
  var palmY = hand.palmPosition[1];
  var palmZ = hand.palmPosition[2];
  // These allow me to use different finger arrangments for different commands.
  middleFingerExtended = hand.middleFinger.extended;
  indexFingerExtended = hand.indexFinger.extended;
  ringFingerExtended = hand.ringFinger.extended;
  pinkyExtended = hand.pinky.extended;
  thumbExtended = hand.thumb.extended;

  // if (middleFingerExtended && indexFingerExtended && ringFingerExtended && pinkyExtended) {
  //   allFingersExtended = true;
  // } else {
  //   allFingersExtended = false;
  // };
  // console.log("All finger are extended?" + allFingersExtended)

  // This controls the up down view of looking at a frame
  if (axis[0] < -0.6
   && hand.palmNormal[2] <= -0.2
   && hand.palmPosition[2] > -38
   && hand.palmPosition[1] < 150) {
    currentPitch = Math.min(90, currentPitch += 0.75);
  }
  if (axis[0] > 0.8
   && hand.palmNormal[2] >= 0
   && hand.palmPosition[2] > -38
   && hand.palmPosition[1] < 150) {
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

  var pov = panorama.getPov();
  // Forward motion achieved by putting palm forward towards laptop
  // Direct heading currently a bit buggy.
  if (hand.palmPosition[2] < -40
   && hand.confidence > 0.25
   && hand.palmPosition[1] < 120) {
      moveForward(hand, pov);
  }

  if (hand.palmPosition[0] > 50
   && hand.palmPosition[1] > 150
   && !(driveAround)
   // && hand.palmNormal[0] > -0.3
   // && hand.palmNormal[0] < 0.25
   && indexFingerExtended
   && !(middleFingerExtended)
   && !(ringFingerExtended)
   && !(thumbExtended)
   && !(pinkyExtended)
   && hand.confidence > 0.3) {
    openDriveView();
  }

  if (hand.palmPosition[0] > 50
   && hand.palmPosition[1] > 150
   && driveAround
   // && hand.palmNormal[0] > -0.3
   // && hand.palmNormal[0] < 0.25
   && indexFingerExtended
   && middleFingerExtended
   && !(thumbExtended)
   && !(ringFingerExtended)
   && !(pinkyExtended)
   && hand.confidence > 0.3) {
    closeDriveView();
  }


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

// var indexFinger = 1;

// function streetViewCircle(frame, gesture) {
//   console.log(gesture);
//   console.log(frame);
//   if (gesture.pointableIds.length == 1
//    && frame.fingers[1].extended
//    && !helpOpen) {
//       helpOpen = true;
//   }

//   if (gesture.pointableIds.length == 1
//    && frame.fingers[1].extended
//    && helpOpen) {
//     if (!(isClockwise(frame, gesture))) {
//       helpOpen = false; 
//     } 
//   }
//   if (helpOpen) {
//     $('.glyphicon-info-sign').trigger('click');
//   } else {
//     $('#myModalHelp').modal('toggle');
//   }
//   //     $('#myModalHelp').modal('toggle');
//   //     $('.glyphicon-info-sign').trigger('click');
//   // }

//   // if (gesture.pointableIds.length == 1
//   //  && frame.fingers[1].extended
//   //  && helpOpen) {
//   //   if (!(isClockwise(frame, gesture))) {
//   //     helpOpen = false;
//   //     // $('myModalHelp')
//   //     $('#myModalHelp').hide(); 
//   //   } 
//   // }

// };

function openMenu (hand) {
  // console.log(hand)
  // debugger;
  var palmX = hand.palmNormal[0];
  var handVelocX = hand.palmVelocity[0];
  var handTranX = hand._translation[0];

  middleFingerExtended = hand.middleFinger.extended;
  indexFingerExtended = hand.indexFinger.extended;
  ringFingerExtended = hand.ringFinger.extended;
  pinkyExtended = hand.pinky.extended;
  thumbExtended = hand.thumb.extended;


  // console.log(palmX);
  // console.log(handVelocX);

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
   && hand._translation[0] < -6
   && palmX <-0.8
   && hand.palmPosition[2] < -10) {
    $("#wrapper").toggleClass("toggled");
    $('#menu-toggle span').toggleClass("glyphicon-chevron-right").toggleClass("glyphicon-chevron-left");
  }
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


  // var scrollYMax = Math.min(380.9, window.scrollY += 10)
  // var scrollYMin = Math.max(window.scrollY -= 10, 0)
  //moves window down
  if (hand.pinchStrength > 0.7
   && hand._translation[1] > 1
   && $('#wrapper').hasClass('toggled')) {
    window.scroll(0, window.scrollY += 20);
  }

  //moves window up

  if (hand.pinchStrength > 0.7
   && hand._translation[1] < -1
   && $('#wrapper').hasClass('toggled')) {
    window.scroll(0, window.scrollY -= 20);
  }

  if (window.scrollY > 450) {
    window.scrollY = 450
  }

  if (window.scrollY < 0) {
    window.scrollY = 0
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


function openDriveView () {
  driveAround = true;
  $('#drive-around').trigger('click')
}

function closeDriveView () {
  driveAround = false;
  $('#drive-around').trigger('click')
}

function help (hands) {


  if (hands[0].type =='left') {
    left = hands[0];
    right = hands[1];
  } else {
    left = hands[1];
    right = hands[0];
  }
  // open up help menu
  if (left.palmNormal[0] >= 0.7
   && right.palmNormal[0] <= -0.7
   && !helpOpen) {
    helpOpen = true;
    $('#myModalHelp').modal('toggle');
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

