let canvas = document.getElementById("display");
let paint = canvas.getContext("2d");

class Organism {
    constructor(brain, x, y, size) {
        this.brain = brain;
        this.x = x;
        this.y = y;

        this.size = size;
    }

    draw(paint) {
        paint.fillStyle = "white";
        paint.fillRect(this.x-this.size/2, this.y-this.size/2, this.size, this.size);
    }

    doAction() {
        let currentLayerValues = getInputValues(this);
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
    
}

function getDistanceToRightWall(organism) {

}

function getDistanceToDownWall(organism) {

}

function getDistanceToLeftWall(organism) {

}

function genRandomBrain() {
    let brain = [];

    brain = [[getDistanceToUpWall, getDistanceToRightWall, getDistanceToDownWall, getDistanceToLeftWall]]

    return brain;
}

function getInputValues(organism) {
    let inputVals = [];

    for(let i in organism.brain[0]) inputVals.push(organism.brain[0][i](organism));

    return inputVals;
}
let brain = genRandomBrain();

let organisms = [new Organism(brain, 300, 200, 4)];
let plants = [new Plant(200, 100, 30)];

// Update the simulation values (move the organisms)
for(let i in organisms) organisms[i].doAction();

// Draw/render the simulation
for(let i in organisms) organisms[i].draw(paint);
for(let i in plants) plants[i].draw(paint);