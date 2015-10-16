// function palmPosition(hand) {
//     var position = hand.palmNormal;
//     var orientation;
//     if (position[1] > 0.75)
//         orientation = "up";
//     else
//         orientation = "down";

//     return orientation;
// }

var lastMove;
var previousFrame;
var currentPitch=0;
var currentHeading=265;
var allFingersExtended=false;

function move(frame) {


  // if(frame.valid && frame.gestures.length > 0){
  //     frame.gestures.forEach(function(gesture){
  //         filterGesture("circle", streetViewCircle)(frame, gesture);
  //     });
  //     return;
  // }

  //Stopping Leap Motion
    if(frame.valid && frame.hands.length > 0) {
      for (var i = 0; i < frame.hands.length; i++) {
        var hand = frame.hands[i];
        // console.log(hand);
        if (hand.grabStrength >0.85) {
          break
        } else {
          if (previousFrame ) {
            movement(hand);
          }
        };
      };
    };


  previousFrame = frame;

};

function movement (hand) {
  var panoNum = null;
  var axis = hand.rotationAxis(previousFrame);
  var palmY = hand.palmPosition[1];
  var palmZ = hand.palmPosition[2];
  // These allow me to use different finger arrangments for different commands.
  var middleFingerExtended = hand.middleFinger.extended;
  var indexFingerExtended = hand.indexFinger.extended;
  var ringFingerExtended = hand.ringFinger.extended;
  var pinkyExtended = hand.pinky.extended;

  if (middleFingerExtended && indexFingerExtended && ringFingerExtended && pinkyExtended) {
    allFingersExtended = true;
  } else {
    allFingersExtended = false;
  };
  // console.log("All finger are extended?" + allFingersExtended)

  // This controls the up down view of looking at a frame
  if (axis[0] < -0.5 && allFingersExtended) {
    currentPitch = Math.min(90, currentPitch += 0.5);
  }
  if (axis[0] > 0.8 && allFingersExtended) {
    currentPitch = Math.max(currentPitch -= 0.5, -90);
  }
  // currentPitch= -90*axis[0]

  // This control the right left rotation of a street view

  if (axis[2] > 0.9) {
    panorama.setPov({
      heading: currentHeading += 1,
      pitch: currentPitch
    })
    // console.log(currentHeading);
  };
  if (axis[2] < -0.9) {
    panorama.setPov({
      heading: currentHeading -= 1,
      pitch: currentPitch
    })
    // console.log(currentHeading);
  };

  panorama.setPov({
    heading: currentHeading,
    pitch: currentPitch
  });

  var pov = panorama.getPov();
  console.log(middleFingerExtended
    && indexFingerExtended
    && !(ringFingerExtended)
    && !(pinkyExtended))
  console.log(palmY)

  if (palmZ < -20
    && palmY < 80
    && middleFingerExtended
    && indexFingerExtended
    && !(ringFingerExtended)
    && !(pinkyExtended)) {
      moveForward (hand, pov);
  }

  if (palmZ > 50
    && palmY > 110 
    && middleFingerExtended
    && indexFingerExtended
    && !(ringFingerExtended)
    && !(pinkyExtended)) {
    moveBackward (hand, pov);
  }

};

function moveForward (hand, pov) {
  links = panorama.getLinks();
  console.log(links);
  if (links !== undefined) {
    if (links.length > 1) {
      pano0 = Math.abs(links[0]['heading'] - pov.heading);
      pano1 = Math.abs(links[1]['heading'] - pov.heading);
      if (pano0 < pano1) {
         panoNum = 0;
      } else {
        panoNum = 1;
      };
      panorama.setPano(links[panoNum]['pano']);
      // lastMove = 'forward';
      console.log('forward');
    } else {
      panorama.setPano(links[0]['pano']);
    };

    console.log(links);
  };
};

function moveBackward(hand, pov) {
  links = panorama.getLinks();
  if (links !== undefined) {
    if (links.length > 1) {
      pano0 = Math.abs(links[0]['heading'] - pov.heading);
      pano1 = Math.abs(links[1]['heading'] - pov.heading);
      if (pano0 < pano1 ) {
        panoNum = 1;
      } else {
        panoNum = 0;
      };
        panorama.setPano(links[panoNum]['pano']);
    } else {
        panorama.setPano(links[0]['pano']);
    };
    console.log('back');
    console.log(links);
  };
};

function streetViewCircle(frame, gesture) {
  console.log(gesture);
};




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
