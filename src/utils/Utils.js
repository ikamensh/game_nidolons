function createCanvas(width, height) {
    let canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    return canvas;
}


function getMousePos(canvas, evt) {
    let rect = canvas.getBoundingClientRect();
    return {
        x: evt.clientX - rect.left,
        y: evt.clientY - rect.top
    };
}

function createAudio(/*String*/ filepath){
    let audio = document.createElement('audio');
    audio.src = filepath;
    return audio;
}

function createImage(/*Require*/ source){
    let image = document.createElement('img');
    image.src = source;
    //todo has no effect - oversize pics are not scaled! possible solution in Unit.redraw
    image.classList.add('avaPic');
    image.style.height=128;
    image.style.width=128;
    image.up
    return image;
}


const createSoundDict = function (attack, move, pain, death) {

    return {
        attack: createAudio(attack),
        move: createAudio(move),
        pain: createAudio(pain),
        death: createAudio(death)
    };

};

export {createCanvas, getMousePos, createAudio, createImage}
export {createSoundDict};