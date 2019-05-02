const classifier = knnClassifier.create();
const webcamElement = document.getElementById('webcam');

let net;
var mouseIsDown = -1;
let photoCount = [0, 0];

async function setupWebcam() {
  return new Promise((resolve, reject) => {
    const navigatorAny = navigator;
    navigator.getUserMedia = navigator.getUserMedia ||
        navigatorAny.webkitGetUserMedia || navigatorAny.mozGetUserMedia ||
        navigatorAny.msGetUserMedia;
    if (navigator.getUserMedia) {
      navigator.getUserMedia({video: true},
        stream => {
          webcamElement.srcObject = stream;
          webcamElement.addEventListener('loadeddata',  () => resolve(), false);
        },
        error => reject());
    } else {
      reject();
    }
  });
}

async function tfApp() {
  console.log('Loading mobilenet..');

  // Load the model.
  net = await mobilenet.load();
  console.log('Successfully loaded model');

  await setupWebcam();
  document.getElementsByClassName("preloader")[0].style.opacity = 0;

  // Reads an image from the webcam and associates it with a specific class
  // index.
  const addExample = classId => {
    // Get the intermediate activation of MobileNet 'conv_preds' and pass that
    // to the KNN classifier.
    const activation = net.infer(webcamElement, 'conv_preds');

    // Pass the intermediate activation to the classifier.
    classifier.addExample(activation, classId);
    photoCount[classId]++;
    if(classId == 0){
      if(photoCount[0]  < 20){
        document.getElementById("photoCount-a").style.width = ((photoCount[0] / 20) * 100) + "%";
        document.getElementById("photoCount-a").innerHTML = ("Photos: <b>&nbsp;" + photoCount[0] + " / 20</b>");
      }
      else{
        document.getElementById("photoCount-a").style.width = "100%";
        document.getElementById("photoCount-a").style.backgroundColor = "#4FC087";
        document.getElementById("photoCount-a").style.color = "#FFFFFF";


        document.getElementById("photoCount-a").innerHTML = ("Photos: <b>&nbsp;" + photoCount[0] + " / 20 </b><b><i class='material-icons'> done </i></b>");

      }

    }
    else{
      if(photoCount[1] < 20){
        document.getElementById("photoCount-b").style.width = ((photoCount[1] / 20) * 100) + "%";
        document.getElementById("photoCount-b").innerHTML = ("Photos: <b>&nbsp;" + photoCount[1] + " / 20</b>");
      }
      else{
        document.getElementById("photoCount-b").style.width = "100%";
        document.getElementById("photoCount-b").style.backgroundColor = "#4FC087";
        document.getElementById("photoCount-b").style.color = "#FFFFFF";


        document.getElementById("photoCount-b").innerHTML = ("Photos: <b>&nbsp;" + photoCount[1] + " / 20 </b><b><i class='material-icons'> done </i></b>");

      }

    }
  };

  //grab audio file from the dom
  const alertSound = document.getElementById("alertSound");

  // When clicking a button, add an example for that class.
  document.getElementById('class-a').addEventListener('mousedown', function(){
    if(mouseIsDown == -1) mouseIsDown = setInterval(() => addExample(0), 100);
      document.getElementById('class-a').innerHTML = "<span>Saving...</span>";
  });
  document.getElementById('class-a').addEventListener('mouseup', function(){
    if(mouseIsDown != -1 ) {
      clearInterval(mouseIsDown);
      mouseIsDown = -1;
    }
      document.getElementById('class-a').innerHTML = "<span>Save Pulling Position</span>";
  });
  document.getElementById('class-a').addEventListener('mouseleave', function(){
    if(mouseIsDown != -1 ) {
      clearInterval(mouseIsDown);
      mouseIsDown = -1;
    }
      document.getElementById('class-a').innerHTML = "<span>Save Pulling Position</span>";
  });

  document.getElementById('class-b').addEventListener('mousedown', function(){
    if(mouseIsDown == -1) mouseIsDown = setInterval(() => addExample(1), 100);
  });
  document.getElementById('class-b').addEventListener('mouseup', function(){
    if(mouseIsDown != -1 ) {
      clearInterval(mouseIsDown);
      mouseIsDown = -1;
    }
  });
  document.getElementById('class-b').addEventListener('mouseleave', function(){
    if(mouseIsDown != -1 ) {
      clearInterval(mouseIsDown);
      mouseIsDown = -1;
    }
  });




  while (true) {
    if (classifier.getNumClasses() > 0) {
      // Get the activation from mobilenet from the webcam.
      const activation = net.infer(webcamElement, 'conv_preds');
      // Get the most likely class and confidences from the classifier module.
      const result = await classifier.predictClass(activation);

      const classes = ['pulling', 'safe'];
      document.getElementById('console').innerText = `
        prediction: ${classes[result.classIndex]}\n
        probability: ${result.confidences[result.classIndex]}
      `;

      if(result.classIndex == 0 && result.confidences[result.classIndex] == 1 && alarmOn){
        alertSound.play();
      }
    }

    await tf.nextFrame();
  }
}

tfApp();
