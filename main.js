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
        this.actions = [moveUp, moveRight, moveDown, moveLeft, moveRandom];
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
        let tempList = [];
        for(let j in list[i]) tempList.push(list[i][j])
        otherList.push(tempList);
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
    if(willCollide(organism, 0)) return;
    organism.y--;
}

function moveDown(organism) {
    if(willCollide(organism, 2)) return;
    organism.y++;
}

function moveLeft(organism) {
    if(willCollide(organism, 3)) return;
    organism.x--;
}

function moveRight(organism) {
    if(willCollide(organism, 1)) return;
    organism.x++;
}

function moveRandom(organism) {
    let directions = [moveUp, moveRight, moveDown, moveLeft];

    let index = Math.floor(Math.random() * 4);
    if(willCollide(organism, index)) return;

    directions[index](organism);
}

function willCollide(organism, direction) {
    switch(direction) {
        case 0:
            if(organism.y <= organism.size/2) return true;
            for(let i in organisms) {
                let o = organisms[i];

                if(o.x == organism.x && o.y == organism.y) continue;

                if(o.x + o.size/2 >= organism.x && o.x <= organism.x + organism.size/2) {
                    if(o.y + o.size/2 >= organism.y-1 && o.y <= organism.y-1 + organism.size/2) {
                        return true;
                    }
                }
            }
            return false;
        case 1:
            if(organism.x >= 800 - organism.size/2) return true;
            for(let i in organisms) {
                let o = organisms[i];

                if(o.x == organism.x && o.y == organism.y) continue;

                if(o.x + o.size/2 >= organism.x+1 && o.x <= organism.x+1 + organism.size/2) {
                    if(o.y + o.size/2 >= organism.y && o.y <= organism.y + organism.size/2) {
                        return true;
                    }
                }
            }
            return false;
        case 2:
            if(organism.y >= 450 - organism.size/2) return true;
            for(let i in organisms) {
                let o = organisms[i];

                if(o.x == organism.x && o.y == organism.y) continue;

                if(o.x + o.size/2 >= organism.x && o.x <= organism.x + organism.size/2) {
                    if(o.y + o.size/2 >= organism.y+1 && o.y <= organism.y+1 + organism.size/2) {
                        return true;
                    }
                }
            }
            return false;
        case 3:
            if(organism.x <= organism.size/2) return true;
            for(let i in organisms) {
                let o = organisms[i];

                if(o.x == organism.x && o.y == organism.y) continue;

                if(o.x + o.size/2 >= organism.x-1 && o.x <= organism.x-1 + organism.size/2) {
                    if(o.y + o.size/2 >= organism.y && o.y <= organism.y + organism.size/2) {
                        return true;
                    }
                }
            }
            return false;
    }

    return true;
}

function genRandomBrain() {
    let brain = [];

    brain = [[getDistanceToUpWall, getDistanceToRightWall, getDistanceToDownWall, getDistanceToLeftWall], [0, 0, 0, 0, 0]];

    // No starting brain will have a hidden layer with neurons

    // Last step, add connections
    // Max of three connections to start with
    let connections = [];

    for(let i = 0;i<Math.floor(Math.random() * 4);i++) {
        connections.push(new Connection(Math.floor(Math.random() * 4), Math.floor(Math.random() * 5 + 4), Math.random() * 2 - 1));
    }
    
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

function getRandomOrganism() {
    let brain = genRandomBrain();
    return new Organism(brain, Math.floor(Math.random() * 797) + 2, Math.floor(Math.random() * 447) + 2, 4);
}

function createMutatedOffspring(organism) {
    // Two main types of mutation: brain structure mutation and brain connection mutation
    let type = Math.floor(Math.random() * 100);
    if(type >= 50) return new Organism(organism.brain, Math.floor(Math.random() * 797) + organism.size/2, Math.floor(Math.random() * 447) + organism.size/2, organism.size);

    let organismBrain = [];

    // For a brain structure mutation:
    // Either a neuron is added, removed, or having its value teaked
    let layer = Math.floor(Math.random() * (organism.brain.length - 2) + 1);

    for(let i in organism.brain) {
        if(i == organism.brain.length - 1) continue;
        organismBrain.push([]);
        for(let j in organism.brain[i]) {
            organismBrain[i].push(organism.brain[i][j]);
        }
    }
    if(type == 0) {
        organismBrain[layer].push(Math.random() * 2 - 1);
    }

    organismBrain[0] = [getDistanceToUpWall, getDistanceToRightWall, getDistanceToDownWall, getDistanceToLeftWall];


    // For a brain connection mutation:
    // Either a brain connection is added, removed, or having its bias tweaked
    let index = Math.floor(Math.random() * organism.brain[layer].length);

    let connectionsList = [];

    for(let i in organism.brain[organism.brain.length - 1]) {
        connectionsList.push(organism.brain[organism.brain.length - 1][i]);
    }

    if(type <= 20) {
        let type2 = Math.floor(Math.random() * 2);
        if(type2 == 0 || connectionsList.length == 0) {
            connectionsList.push(new Connection(Math.floor(Math.random() * 4), Math.floor(Math.random() * 5 + 4), Math.random() * 2 - 1));
        } else {
            connectionsList[Math.floor(Math.random() * connectionsList.length)].bias -= Math.random() - 0.5;
        }
    }

    organismBrain.push(connectionsList);

    return new Organism(organismBrain, Math.floor(Math.random() * 797) + organism.size/2, Math.floor(Math.random() * 447) + organism.size/2, organism.size)
}

let organisms = [];

for(let i = 0;i<300;i++) {
    organisms.push(getRandomOrganism());
}

let plants = [new Plant(200, 100, 30)];
let tickCount = 0;
let generation = 1;

// Update the simulation values (move the organisms)
function tick() {
    if(tickCount == 1000) {
        tickCount = 0;

        let selectedOrganisms = [];
        for(let i in organisms) {
            if(organisms[i].x > 400) selectedOrganisms.push(organisms[i]);
        }

        for(let i in organisms) {
            let index = i % selectedOrganisms.length;
            if(selectedOrganisms.length == 0) organisms[i] = getRandomOrganism();
            organisms[i] = createMutatedOffspring(selectedOrganisms[index]);
        }

        generation++;
        let generationTag = document.getElementById("GenerationTag");
        generationTag.children[0].innerHTML = "Generation: " + generation;
    }

    for(let i in organisms) organisms[i].doAction();

    render();

    tickCount++;
    setTimeout(tick, 0);
}

// Draw/render the simulation
function render() {
    paint.clearRect(0, 0, 800, 450);

    for(let i in organisms) organisms[i].draw(paint);
    //for(let i in plants) plants[i].draw(paint);
}

tick();