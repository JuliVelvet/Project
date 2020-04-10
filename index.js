
window.addEventListener('load', async function() { 


//Label 1
const video = document.querySelector('#video'),
txtLabel1 = document.querySelector('#txtLabel1'),
addLabel1 = document.querySelector('#addLabel1'),
numLabel1 = document.querySelector('#numLabel1'),
//Label 2 
txtLabel2 = document.querySelector('#txtLabel2'),
addLabel2 = document.querySelector('#addLabel2'),
numLabel2 = document.querySelector('#numLabel2'),
//Label 3 
txtLabel3 = document.querySelector('#txtLabel3'),
addLabel3 = document.querySelector('#addLabel3'),
numLabel3 = document.querySelector('#numLabel3'),
//Label 4
txtLabel4 = document.querySelector('#txtLabel4'),
addLabel4 = document.querySelector('#addLabel4'),
numLabel4 = document.querySelector('#numLabel4'),
//Label 5
txtLabel5 = document.querySelector('#txtLabel5'),
addLabel5 = document.querySelector('#addLabel5'),
numLabel5 = document.querySelector('#numLabel5'),
//Labwl 6
txtLabel6 = document.querySelector('#txtLabel6'),
addLabel6 = document.querySelector('#addLabel6'),
numLabel6 = document.querySelector('#numLabel6'),
//Label 7
txtLabel7 = document.querySelector('#txtLabel7'),
addLabel7 = document.querySelector('#addLabel7'),
numLabel7 = document.querySelector('#numLabel7'),

//Predictions
btnPredict = document.querySelector('#btnPredict'),
lPrediction = document.querySelector('#lPrediction'),

//Status for feed
statusModel = document.querySelector('#statusModel'),
statusVideo = document.querySelector('#statusVideo');

checkModel = document.querySelector('#CheckModel');
backgroundImage = document.querySelector('#backgroundImage');


let num1 = 0, num2 = 0, num3 = 0, num4 = 0, num5 = 0, num6 = 0, num7 = 0, flagPredicting = false; 

let isPredicting = false; 




const specs = {video: {width: 224, height: 224, facingMode: 'user'}};
navigator.mediaDevices.getUserMedia(specs)
.then(function(mediaStream) {
    video.srcObject = mediaStream;
    video.onloadedmetadata = function(e) {
        statusVideo.textContent = 'ready';
        video.play();
    };
})
.catch(function(err) { 
    statusVideo.textContent = 'error';
    console.log(err.name + ": " + err.message); 
});


const classifier = new imageClassifier(7);

classifier.initalise().then(function () {
    statusModel.textContent = 'Model Loaded';
});



var ImageTransform = new imageTransformations(); 




checkModel.addEventListener('click', function() {
    classifier.checkModel(); 
});




addLabel1.addEventListener('click', function() {
    if(num1 == 0) {
        txtLabel1.disabled = true; 
    }
    let label = txtLabel1.value.trim();  
    classifier.addLabel(video, label);
    numLabel1.textContent = ++num1; 

 


});



addLabel2.addEventListener('click', function() {
    if(num2 == 0) {
        txtLabel2.disabled = true; 
    }
    let label = txtLabel2.value.trim();  
    classifier.addLabel(video, label);
    numLabel2.textContent = ++num2; 
    
});


addLabel3.addEventListener('click', function() {
    if(num3 == 0) {
        txtLabel3.disabled = true; 
    }
    let label = txtLabel3.value.trim();  
    classifier.addLabel(video, label);
    numLabel3.textContent = ++num3; 
    
 
});


addLabel4.addEventListener('click', function() {
    if(num4 == 0) {
        txtLabel4.disabled = true; 
    }
    let label = txtLabel4.value.trim();  
    classifier.addLabel(video, label);
    numLabel4.textContent = ++num4; 
    
 
});

addLabel5.addEventListener('click', function() {
    if(num5 == 0) {
        txtLabel5.disabled = true; 
    }
    let label = txtLabel5.value.trim();  
    classifier.addLabel(video, label);
    numLabel5.textContent = ++num5; 
});

addLabel6.addEventListener('click', function() {
    if(num6 == 0) {
        txtLabel6.disabled = true; 
    }
    let label = txtLabel6.value.trim();  
    classifier.addLabel(video,label);
    numLabel6.textContent = ++num6; 
    
 
});

addLabel7.addEventListener('click', function() {
    if(num7 == 0) {
        txtLabel7.disabled = true; 
    }
    let label = txtLabel7.value.trim();  
    classifier.addLabel(video, label);
    numLabel7.textContent = ++num7; 
    
 
});


btnTrain.addEventListener('click', async function() {
    classifier.trainModel(function(loss) {
        if(loss) {
            console.log('Loss' + loss); 
        } else {
            console.log('yeet')
        }
    })
}); 


btnPredict.addEventListener('click', async function() {
    isPredicting = !isPredicting; 
    if(isPredicting) {
        console.log("If statement working ");
        this.textContent = 'Stop Predicting';
        classifier.predict(video).then(updatePrediction);
    } else {
        this.textContent = 'start predicting'; 
    }

})


//Recursively allows for predictions to occur 
function updatePrediction(label) {
    lPrediction.textContent = label; 
    console.log('Label is  ' + label); 
    if(isPredicting) {
        classifier.predict(video).then(updatePrediction);
        }
    }




/// Not used anymore, mask is lagging webpage
function createMask(image) {

    const upperSkinTone = hue => new cv.Vec(hue, 0.8 * 255, 0.6 * 255); 
    const lowerSkinTone = hue => new cv.Vec(hue, 0.1 * 255, 0.5 * 255); 

    // const imgHLS = img.cvtColor(cv.COLOR_BGR2HLS); 
    let dst = new cv.Mat(); 
    cv.cvtColor(img, img, cv.COLOR_BGR2HLS, 0 )

    const rangeMask = dst.inRange(lowerSkinTone(0), upperSkinTone(15));

    //remove noise
    const blurred = rangeMask.blur(new cv.Size(10, 10)); 
    const thresholded = blurred.threshold(
        200,
        255,
        cv.threshold
    );
    return thresholded;
    }; 



});




let frame; 
let fgmask; 
let fgbg;

let cap = new cv.VideoCapture(video);

cv['onRuntimeInitialized']=()=>{
 fgbg = new cv.BackgroundSubtractorMOG2(200, 60, true);
 frame = new cv.Mat(video.height, video.width, cv.CV_8UC4);
 fgmask = new cv.Mat(video.height, video.width, cv.CV_8UC1);
// schedule the first one.
setTimeout(processVideo, 0);

 const FPS = 30;
function processVideo() {
streaming = true; 
try {
    if (!streaming) {
        // clean and stop.
        frame.delete(); fgmask.delete(); fgbg.delete();
        return;
    }
    let begin = Date.now();
    // start processing.
    cap.read(frame);
    fgbg.apply(frame, fgmask);
    cv.imshow('canvasoutput', fgmask);
    // schedule the next one.
    let delay = 1000/FPS - (Date.now() - begin);
    setTimeout(processVideo, delay);
} catch (err) {
    console.log(err); 
}
};
  };










  function getData() {
    var height = video.height; 
    var width = video.width; 


    var canvasFrame = document.getElementById('canvasoutput');
    let context = canvasFrame.getContext("2d"); 
    var imgData =  context.getImageData(0, 0, height, width);
    console.log(imgData); 
    console.log(typeof imgData); 
}


//Gets background image and seperates it so that theres a foreground and background
//Uses backgroundsubstractor to extract hand gestures
function getData2() {
    

}






// let net;
// const webcamElement = document.getElementById('webcam');
// const classifier = knnClassifier.create();


// // async function app() {
// //     console.log('Loading mobilenet..');
  
// //     // Load the model.
// //     net = await mobilenet.load();
// //     console.log('Successfully loaded model');
  
// //     // Create an object from Tensorflow.js data API which could capture image 
// //     // from the web camera as Tensor.
// //     const webcam = await tf.data.webcam(webcamElement);
  
// //     // Reads an image from the webcam and associates it with a specific class
// //     // index.
// //     const addExample = async classId => {
// //       // Capture an image from the web camera.
// //       const img = await webcam.capture();
  
// //       // Get the intermediate activation of MobileNet 'conv_preds' and pass that
// //       // to the KNN classifier.
// //       const activation = net.infer(img, 'conv_preds');
  
// //       // Pass the intermediate activation to the classifier.
// //       classifier.addExample(activation, classId);
  
// //       // Dispose the tensor to release the memory.
// //       img.dispose();
// //     };
  
// //     // When clicking a button, add an example for that class.
// //     document.getElementById('class-a').addEventListener('click', () => addExample(0));
// //     document.getElementById('class-b').addEventListener('click', () => addExample(1));
// //     document.getElementById('class-c').addEventListener('click', () => addExample(2));
  
// //     while (true) {
// //       if (classifier.getNumClasses() > 0) {
// //         const img = await webcam.capture();
  
// //         // Get the activation from mobilenet from the webcam.
// //         const activation = net.infer(img, 'conv_preds');
// //         // Get the most likely class and confidences from the classifier module.
// //         const result = await classifier.predictClass(activation);
  
// //         const classes = ['A', 'B', 'C'];
// //         document.getElementById('console').innerText = `
// //           prediction: ${classes[result.label]}\n
// //           probability: ${result.confidences[result.label]}
// //         `;
  
// //         // Dispose the tensor to release the memory.
// //         img.dispose();
// //       }
  
// //       await tf.nextFrame();
// //     }
// //   }

// // app();

// //Constructor class 
// // Contains the number of classes needed to be predicted
// // declares the variables to hold the mobilenet model and custom model 

// class Classifier {

// constructor(numClasses) {
//     // Storing the number of classes
//     this.numClasses = numClasses;

//     this.modelPath = 'https://storage.googleapis.com/tfjs-models/tfjs/mobilenet_v1_0.25_224/model.json';
//     this.layerName = '';
//     this.imageSize = 224;

//    this.tag = [];
//    this.samples = {
//        xs: null,
//        ys: null
//    };
// }

// async init () {

//     // Loading original mobilenet model
//     const mobilenet = await tf.loadModel(this.modelPath);

//     //Warming up the model 
//     mobilenet.predict(tf.zeros([1,this.imageSize, this.imageSize, 3])).dispose();

//     //top-slice mobilenet model to use this as a feature extractor
//     const layer = mobilenet.getLayer('conv_pw_13_relu');

//     // return instance to allow for concatenation
//     return this; 
//     }

//     addSample(img, label) {

//         let classID; 

//         if(this.tag.includes(label)) {
//             classID = tags.indexOf(label);
//         } else {
//             classID = this.tags.push(label) -1;   
//         }

//         //Feature extraction
//         const imgTensor  = this.imgToTensor(img);
//         const features = this.mobilenet.predict(img_tensor);

//         // Represents the probability distribution 
//         // let classNo = classID.toint; 
//         const y = tf.tidy(() => tf.oneHot(tf.tensor1d([classID]).toInt(), this.numClasses)); 
//         // add training data and keeping the data using TF.keep 
//         if(this.samples.xs == null) {
//             this.samples.xs = tf.keep(features);
//             this.samples.ys = tf.keep(y);
//         } else {
//             const xs = this.samples.xs;
//             const ys = this.samples.ys;
//             //Concatanating image features and one hot 
//             this.samples.xs = this.keep(xs.concat(img_features, 0));
//             this.samples.ys = tf.keep(ys.concat(y,0));
//             xs.dispose();
//             ys.dispose();
//             y.dispose();
//         }
       
//     }

//     async train(callback, hidedenUnits, learningRate, trainingEpochs) {
//          model = tf.sequential(); 

//          let input = tf.layers.flatten({
//             inputShape: [7,7,256]
//          });
//         let hidden = tf.layers.dense({
//             units: hidedenUnits,
//             activation: 'relu',
//             kernelInitializer: 'varianceScaling',
//             useBias: true,
//         });

//         let outputs  = tf.layers.dense({
//             units: this.numClasses,
//             activation: 'softmax',
//             kernelInitializer: 'varianceScalig',
//             useBias: false,
//         });
//         model.add(input);
//         model.add(hidden);
//         model.add(outputs);

//     }

//     async createModel()
//     {

//     }

// }
