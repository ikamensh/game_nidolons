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


export {createCanvas, getMousePos, createAudio}