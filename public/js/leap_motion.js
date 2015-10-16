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
        if (hand.grabStrength >0.85) {
          break
        } else {
          if (previousFrame) {
            movement(hand);
          }
        };
      };
    };


  previousFrame = frame;

};

function movement (hand) {
  var pov = panorama.getPov();
  var panoNum = null;
  var axis = hand.rotationAxis(previousFrame);
  var palm = hand.palmPosition[2];
  // if (axis[0] < -0.1){
  //   currentPitch = Math.min(90, currentPitch += 0.1);
  // }
  // if (axis[0] > 0.1){
  //   currentPitch = Math.max(currentPitch -= 0.1, -90);
  // }
  currentPitch= -90*axis[0]
  // These first two ifs deal with the rotation in a frame.
  if (axis[2] > 0.9) {
    panorama.setPov({
      heading: pov.heading + 1,
    pitch: currentPitch
    });
    console.log(pov.heading + 1)
  };
  if (axis[2] < -0.9) {
    panorama.setPov({
      heading: pov.heading - 1,
    pitch: currentPitch})
    console.log(pov.heading - 1)
  };

  // panorama.setPov({
  //   heading: currentHeading,
  //   pitch: currentPitch
  // })

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
