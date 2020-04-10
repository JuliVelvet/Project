

class imageClassifier {

    
    constructor(numClasses) {

        //Webcam 
        this.webcam = null; 

        //Variables to hold models 
        this.mobilenet = null; 
        this.model = null; 
        //Number of classes 
        this.numClasses = numClasses;
        this.layerSize =  224;
        //Variables to store data and labels for predictions
        this.label = []; 
        this.dataset = null; 
        this.img = null; 
    }

    async initalise() {
        //Dataset object which will store the activations 
        this.dataset = new dataset(this.numClasses); 

        //Load Model
        const net = await tf.loadLayersModel('https://storage.googleapis.com/tfjs-models/tfjs/mobilenet_v1_0.25_224/model.json');

        //Warming up the model
        net.predict(tf.zeros([1, 224, 224, 3])).dispose(); 

        //Layer we will be using as a feature extractor 
        const layer = net.getLayer('conv_pw_13_relu');
        //Creating model based on inputs
        this.mobilenet = tf.model({inputs: net.input, outputs: layer.output});
        //Instantiating the classifier 
        const classifier = await knnClassifier.create();
        console.log("Model Has Been Loaded ")

        return this;         
    }


    async addLabel(img, label) {
        this.img = await this.getTensor(img);
        this.dataset.addSample(this.mobilenet.predict(this.img), label); 

        this.label = this.dataset.getLabel(); 
    }

    




        // async createWebcam() {

        //      const webcamElement =  await document.getElementById('webcam');
        //      this.webcam = await tf.data.webcam(webcamElement);

        //     console.log('Webcam Loaded')
        //     //To capture an image 
        // }



        /**
         * Provides predictions for a singular image. 
         * Method conducts a sanity check to see if the model is trained 
         * 
         */
        async predict (img) {
            if(!this.mobilenet) {
                console.log('MobileNet not loaded');
            } else if (this.mobilenet == null) {
                console.log('Model not trained')
            }

                this.img = await this.getTensor(img);                 
        
                await tf.nextFrame(); 

                //Determining the predictions for each image 

                const classPredictions = tf.tidy(() => {
                const imgTensor = this.img; 
                const imageFeatures = this.mobilenet.predict(imgTensor);
                const predictions = this.model.predict(imageFeatures);
                return predictions.as1D().argMax(); 

            });

            

            const classId = (await classPredictions.data())[0]; 
            //Returning class label 
            console.log("Label " + this.label[classId]); 

            return this.label[classId]; 
            
        }



        /**
         * takes a frame from webcam and normalises it 
         * Add batch element onto tensor
         * 
         */
         async getTensor(img) {
            const tImg =  tf.browser.fromPixels(img); 

            let tensor = tf.image.resizeBilinear(tImg, [224, 224]); 
           
            const processedImage = tf.tidy(() => tensor.expandDims(0).toFloat().div(tf.scalar(127)).sub(tf.scalar(1)));
            tensor.dispose();

            return processedImage;  
        }



        async trainModel(callback, hiddenUnits, learningRate, trainingEpochs) {

            if(hiddenUnits == null && learningRate == null && trainingEpochs == null )
            {
            hiddenUnits = 200; 
            learningRate = 0.0001;
            trainingEpochs = 40;             
            }

            let labelSize = this.dataset.getLabelLength();

            if(!this.mobilenet) {
                throw new Error ("MobileNet not loaded")
            } else if (this.labelSize < this.numClasses) {
                throw new Error ("Insufficient training data")
            }

            //Optimiser to assist with training 
            const optimiser = tf.train.adam(learningRate);


            //Building a model which takes feature tensors as input and then predicts classes as outputs
            // Last


            this.model = tf.sequential({
                
                layers: [
            //Flatterns the input tensor so it can be used for the dense layer. No training
            //Occurs here and instead we focus on preforming a reshape
                    tf.layers.flatten(
                        {inputShape: this.mobilenet.outputs[0].shape.slice(1)}),
            //Layer 1
                    tf.layers.dense({
                        units: hiddenUnits,
                        activation: 'relu',
                        kernelInitializer: 'varianceScaling',
                        useBias: true
                    }),
                    tf.layers.dense({
                        units: this.numClasses,
                        kernelInitializer: 'varianceScaling',
                        useBias: false,
                        activation: 'softmax'
                    })
                ]
            });
             
            //Compilign model with optimizer 
            this.model.compile({
                optimizer: optimiser, 
                loss: 'categoricalCrossentropy' 
             });

             //
             const xs = this.dataset.getXS(); 
             console.log(xs); 
            const batchSize = Math.floor(xs.shape[0] * 0.4);
               if(!(batchSize > 0)) {
                   console.log('Batch size incorrect')
                   return null; 
               }
               

            this.model.fit(
                //Tensor of image features
                this.dataset.getXS(),
                //One-hot encoded labels 
                this.dataset.getYS(),
                 {
                //Option config for batch size, epochs and callback functions. 
                // tf.nextFrame to give browser time to update user interface after each batch 
                    batchSize,
                    epochs: trainingEpochs,
                    callbacks:  {
                        onBatchEnd: async (batch, logs) => {
                            callback(logs.loss.toFixed(5));
                            await tf.nextFrame();
                        },
                        onTrainEnd: function() {
                            callback(null);
                        }

                    },
                }
            );


        }
                                                             

        checkModel() {
           return this.model.summary(); 

        }


        



        // imgToFeature(tensor) {
        //     return tf.tidy(() => {

        //         if(tensor.shape[0] != 224 || tensor.shape[1] != 224 ) {
        //             tensor = tf.image.resizeBilinear(tensor, [224,224])
        //         }
        //         //Batch dimension
        //         tensor = tensor.expandDims(0);
        //         alert(mobilenet); 
        //         return tensor.toFloat().div(tf.scalar(127)).sub(tf.scalar(1));
                
        //     });
        // }



        // async train(callback, hiddenUnits, learningRate, trainingEpochs) {

        //     if(mobilenet = !)


        // }

        


    }

        


    

       






    // async addClassification(classID) {

    //     const webcam = await tf.data.webcam(webcamElement);
    //     const img =  webcam.capture(); 
    //     const activation = net.infer(img, layer); 

    //     knnClassifier.addExample(activation, classID);

    // }


    




    

    


 
    