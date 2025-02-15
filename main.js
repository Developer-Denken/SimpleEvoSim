let canvas = document.getElementById("display");
let paint = canvas.getContext("2d");

let consoleLogger = document.getElementById("logger");

class Connection {
    constructor(startId, endId, bias) {
        this.startId = startId;
        this.endId = endId;
        this.bias = bias;
    }
}

class Neuron {
    constructor(val, nextNeuron, bias) {
        this.val = val;
        this.next = nextNeuron;
        this.bias = bias;
    }
}

class Organism {
    constructor(brain, x, y, size) {
        this.brain = brain;
        this.x = x;
        this.y = y;
        this.size = size;
        this.actions = [moveUp, moveRight, moveDown, moveRight, moveRandom];
    }

    draw(paint) {
        paint.fillStyle = "white";
        paint.fillRect(this.x-this.size/2, this.y-this.size/2, this.size, this.size);
    }

    doAction() {
        let tempBrain = exclude(this.brain, this.brain.length-1);
        let connections = this.brain[this.brain.length-1];
        tempBrain[0] = getInputValues(this);
        for(let i in tempBrain[tempBrain.length-1]) {
            tempBrain[tempBrain.length-1][i] = 0;
        }

        for(let layer in tempBrain) {
            for(let i in connections) {
                let connection = connections[i];
                let val = connection.val;
                let startId = connection.startId;
                let maxStartId = getMaxStartId(tempBrain, layer);
                let minStartId = getMinStartId(tempBrain, layer);
                if(maxStartId < startId || startId < minStartId) continue;

                let endId = connection.endId;
                let bias = connection.bias;

                if(startId < layer.length) {
                    let newVal = tempBrain[layer][startId] * bias;
                    addValueToElementByIndex(endId, tempBrain, newVal);
                }
            }
        }

        let greatestVal = 0;

        for(let i in tempBrain[tempBrain.length-1]) {
            if(greatestVal > tempBrain[tempBrain.length-1][i]) continue;
            greatestVal = tempBrain[tempBrain.length-1][i];
        }

        for(let i in tempBrain[tempBrain.length-1]) {
            let random = Math.random() * greatestVal;
            if(random < tempBrain[tempBrain.length-1][i]) {
                this.actions[i](this);
            }
        }
    }
}

function getMaxStartId(arr, index) {
    let sum = 0;
    let currentIndex = 0;
    while(currentIndex <= index) {
        sum+=arr[currentIndex].length;
        currentIndex++;

    }
    return sum;
}

function getMinStartId(arr, index) {
    let sum = 0;
    let currentIndex = 0;
    while(currentIndex < index) {
        sum+=arr[currentIndex].length;
        currentIndex++;

    }
    return sum;
}

function exclude(list, index) {
    let otherList = [];

    for(let i in list) {
        if(i==index) continue;
        otherList.push(list[i]);
    }

    return otherList;
}

function getElementByIndex(index, list) {
    //Assuming the list is a 2d array or bigger

    for(let i in list) {
        if(index<list[i].length) return list[i][index];

        index -= list[i].length;
    }

    return null;
}

function addValueToElementByIndex(index, list, val) {
    //Assuming the list is a 2d array or bigger

    for(let i in list) {
        if(index<list[i].length) {
            list[i][index] += val;
            return;
        }

        index -= list[i].length;
    }
}

class Plant {
    constructor(x, y, size) {
        this.x = x;
        this.y = y;
        this.size = size;
    }

    draw(paint) {
        paint.fillStyle = "lightgreen";
        paint.fillRect(this.x - this.size/2, this.y - this.size/2, this.size, this.size);
    }
}

function getDistanceToUpWall(organism) {
    return organism.y - organism.size / 2;
}

function getDistanceToRightWall(organism) {
    return 800 - organism.x - organism.size / 2;
}

function getDistanceToDownWall(organism) {
    return 450 - organism.y - organism.size / 2;
}

function getDistanceToLeftWall(organism) {
    return organism.x - organism.size / 2;
}

function moveUp(organism) {
    organism.y--;
}

function moveDown(organism) {
    organism.y++;
}

function moveLeft(organism) {
    organism.x--;
}

function moveRight(organism) {
    organism.x++;
}

function moveRandom(organism) {
    let directions = [moveUp, moveRight, moveDown, moveLeft];

    let index = Math.floor(Math.random() * 4);

    directions[index](organism);
}

function genRandomBrain() {
    let brain = [];

    brain = [[getDistanceToUpWall, getDistanceToRightWall, getDistanceToDownWall, getDistanceToLeftWall], [0, 0, 0, 0, 0]];

    // Last step, add connections
    let connections = [new Connection(0, 4, .5)];
    
    brain.push(connections);

    return brain;
}

function getInputValues(organism) {
    let inputVals = [];

    for(let i = 0;i<4;i++) inputVals.push(organism.brain[0][i](organism));

    return inputVals;
}

function log(val) {
    consoleLogger.innerHTML += "<br>" + val;
}
let brain = genRandomBrain();

let organisms = [new Organism(brain, 300, 200, 4)];
let plants = [new Plant(200, 100, 30)];

// Update the simulation values (move the organisms)
function tick() {
    for(let i in organisms) organisms[i].doAction();

    render();

    setTimeout(tick, 20);
}

// Draw/render the simulation
function render() {
    paint.clearRect(0, 0, 800, 450);

    for(let i in organisms) organisms[i].draw(paint);
    for(let i in plants) plants[i].draw(paint);
}

tick();