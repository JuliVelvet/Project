class imageTransformations {
    

    constructor() {
        this.images = null; 
       

    }


    distortGradient() {
        let src = cv.imread(img);
    }




    
   videoToImage(video) {
    var height = video.height; 
    var width = video.width; 

    console.log(height , width); 

    var canvasFrame = document.getElementById('canvasFrame');
    let context = canvasFrame.getContext("2d"); 
    let src = new cv.Mat(height, width, cv.CV_8UC4);
    let dst = new cv.Mat(height, width, cv.CV_8UC1);
    context.drawImage(video, 0, 0, width, height);
    // var url = canvasFrame.toDataURL();
    // console.log(url);
    // return url; 



    var imgData =  context.getImageData(0, 0, height, width);

    return imgData;


}



    // Helper function to translate the image 
    getImage(arr) {        
        // let imageSize = 224 * 244 * 3; 
        // let pixels = arr.slice(0, imageSize)
        // //Normalising pixel data 
        // return pixels.map(cur => cur/255)
        console.log("length is" + arr.length); 
        var input = []; 
        for(var i = 0; i < arr.length; i+=4) {

        input.push(arr[i + 2 ] / 255); 
        }

        console.log(arr);
        return input; 



    }
    

//Takes HTMLVIDEO Element and the rotation angle 
rotateImage(video, angle) {


var height = video.height; 
var width = video.width; 

let src = cv.imread('canvasFrame');
let dst = new cv.Mat();
let dsize = new cv.Size(src.rows, src.cols);
let center = new cv.Point(src.cols / 2, src.rows / 2);
// Rotation angle 
let M = cv.getRotationMatrix2D(center, angle, 1);
cv.warpAffine(src, dst, M, dsize, cv.INTER_LINEAR, cv.BORDER_CONSTANT, new cv.Scalar());
cv.imshow('canvasFrame', dst);
console.log("test");

var canvasFrame = document.getElementById('canvasFrame');
let context = canvasFrame.getContext("2d"); 

var imgData =  context.getImageData(0, 0, height, width);
src.delete(); dst.delete(); M.delete();
return imgData;

}

// handDetector(video) {
//     var height = video.height; 
//     var width = video.width; 
    
//     //Reading image from canvas frame
//     let src = cv.imread('canvasFrame');
//     let hsv = new cv.Mat();
//     cv.cvtColor(src, hsv, cv.CV_BGR2HSV);

//     var canvasFrame = document.getElementById('canvasFrame');
//     let context = canvasFrame.getContext("2d"); 

//     var imgData =  context.getImageData(0, 0, height, width);

//     let mask1 = new cv.Mat();
//     let mask2 = new cv.Mat(); 

//     cv.inRange(dst, cv.Scalar(0, 120, 70), cv.Scalar(10, 255, 255), mask1);

//     cv.inRange(dst, cv.Scalar(170, 120, 70), cv.Scalar(180, 255, 255), mask2);

//     return imgData;
// }


handDetector(video) {

var height = video.height; 
var width = video.width; 
var canvasFrame = document.getElementById('canvasFrame');
let context = canvasFrame.getContext("2d"); 
context.drawImage(video, 0, 0, width, height);

let src = cv.imread('canvasFrame');
let dst = new cv.Mat();
let rangeMask = new cv.Mat();

let low = new cv.Mat(src.rows, src.cols, src.type(), [60, 40, 40, 90]);
let high = new cv.Mat(src.rows, src.cols, src.type(), [115, 435, 435, 255]);

// You can try more different parameters
cv.cvtColor(src, dst, cv.COLOR_BGR2HLS, 0);
 
cv.inRange(src, low, high, rangeMask);
cv.imshow('canvasoutput', rangeMask); 
}


// backgroundDetector(video){
  
    
// var height = video.height; 
// var width = video.width; 
// var canvasFrame = document.getElementById('canvasFrame');
// let context = canvasFrame.getContext("2d"); 
// context.drawImage(video, 0, 0, width, height);


// let src = cv.imread('canvasFrame');


//     let extractor = new cv.BackgroundSubtractorMOG2(500, 16, true );
//     let a =  extractor.getBackgroundImage(src);
// }


// createMask(image, background){
//     var fgbg = new cv.BackgroundSubtractorMOG2(500, 16, true);
//     console.log(background); 
//     var fgmask = cv.(background); 
//     let a = fgbg.apply(image, fgmask, -1);
//     cv.imshow('canvasoutput', a)

}






