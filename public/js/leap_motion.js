// function palmPosition(hand) {
//     var position = hand.palmNormal;
//     var orientation;
//     if (position[1] > 0.75)
//         orientation = "up";
//     else
//         orientation = "down";

//     return orientation;
// }

function move(frame) {


    // if(frame.valid && frame.gestures.length > 0){
    //     frame.gestures.forEach(function(gesture){
    //         filterGesture("swipe", streetViewSwipe)(frame, gesture);
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

}

function movement (hand) {
  var pov = panorama.getPov();
  var panoNum = null;
  var axis = hand.rotationAxis(previousFrame);
  var palm = hand.palmPosition[2];
  if (axis[2] > 0.90) {
    panorama.setPov({
    heading: pov.heading + 1,
    pitch:0});
  };
  if (axis[2] < -0.90) {
    panorama.setPov({
      heading: pov.heading - 1,
    pitch:0})
  };
  if (palm < -50) {
    moveForward(hand, pov);
  };
  if (palm > 50) {
    moveBackward(hand, pov);
  }

};

function moveForward (hand, pov) {
  links = panorama.getLinks();
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
    } else {
      panorama.setpano(links[0]['pano']);
    };
  console.log('forward');
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
