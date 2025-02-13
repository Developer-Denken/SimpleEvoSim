let canvas = document.getElementById("display");
let paint = canvas.getContext("2d");

class InputNeuron {
    constructor(trigger) {
        this.trigger = trigger;
    }
}

class OutputNeuron {
    constructor(outputKey) {
        this.outputKey = outputKey;
    }
}

class HiddenNeuron {
    constructor(bias) {
        this.bias = bias;
    }
}

class Organism {
    constructor(x, y, geneticInfo) {
        this.x = x;
        this.y = y;
        this.geneticInfo = geneticInfo;

        this.defineProperties();
    }

    //All cells have the same physical qualities, however, the 
    //cells do not posses the same brains.

    defineProperties() {
        //Takes the genetic info and translates it into a series of connections between neurons

        //genetic info should be able to translated into a brain, stored as a list of strings

        //Example encoding after translation (Turned into binary): 
        // 26835... <- 10 digit weight value (Assigned to neuron or connection) if the first value is less than 5, it is a negative number, last digit is for the digit position of the decimal point
        // 15 <- 2 digit layer value, 0 being the first hidden layer and 99 being the last hidden layer (For neuron only)
        // 25583... <- 10 digit start index (For connection only)
        // 69386... <- 10 digit end index (For connection only)

        // The genetic information will be stored as two lists, one for neurons and one for connections
        // All cells have the same input and output neurons and thus they won't be stored

        this.brain = [];

        let inputLayer = [];
        inputLayer.add(new InputNeuron("distanceUp"));
        inputLayer.add(new InputNeuron("distanceDown"));
        inputLayer.add(new InputNeuron("distanceLeft"));
        inputLayer.add(new InputNeuron("distanceRight"));
        inputLayer.add(new InputNeuron("distanceUpWall"));
        inputLayer.add(new InputNeuron("distanceDownWall"));
        inputLayer.add(new InputNeuron("distanceLeftWall"));
        inputLayer.add(new InputNeuron("distanceRightWall"));
        inputLayer.add(new InputNeuron("oscilate"));
        inputLayer.add(new InputNeuron("constant"));

        this.brain.push(inputLayer);

        // This is where the brain should be generated based off
        // Any genetic material found in the cell (The neurons)

        let neurons = geneticInfo[0];
        let layerVals = [];
        let layers = 0;

        for(let i = 0;i<neurons.length;i++) {
            layerVals.push({layer: neurons[i].layer, nueron: i});
        }

        layers = getLayers(layerVals);

        // Where the output neurons are added here

        let outputLayer = []
        outputLayer.push(new OutputNeuron("Up"));
        outputLayer.push(new OutputNeuron("Down"));
        outputLayer.push(new OutputNeuron("Left"));
        outputLayer.push(new OutputNeuron("Right"));
        outputLayer.push(new OutputNeuron("Random"));

        this.brain.push(outputLayer);

        // This is where the connections are defined from the genetic information
        // When defining a value based on the connections, take the remainder of the connection
        // id when it is divided by the amount of connection ids there are
    }
}

function getLayers(neuronList) {
    let sum = 0;

    for(let i = 0;i<neuronList.length;i++) { // [0, 1, 1, 2, 4, 2]
        let again = false;

        for(let j = i+1;j<neuronList.length;j++) {
            if(neuronList[i].layer != neuronList[j].layer) continue;

            again = true;
        }

        if(again) continue;
        sum++;
    }

    return sum;
}