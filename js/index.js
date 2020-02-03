function click(task) {
    let input = document.getElementById("input").value;
    let dot_for_blank = document.getElementById("dotForBlank").checked;
    let output = task(input, dot_for_blank);
    document.getElementById("input").value = output;
}

function invert_click() {
    click(invert);
}

function rotate_click() {
    click(turn_90);
}

function mirror_click() {
    click(mirror);
}

var file_input;
file_input = document.getElementById("fileinput");

var canvas = document.createElement('canvas');
var context = canvas.getContext('2d');


file_input.onchange = e => {
    let file = e.target.files[0]
    
    let reader = new FileReader();
    reader.readAsDataURL(file);
    
    reader.onload = readerEvent => {
        let image = new Image();
        image.src = readerEvent.target.result;
        
        image.onload = function(){
            canvas.width = image.width;
            canvas.height = image.height;
            context.drawImage(image, 0, 0 );
            let pixel_data = context.getImageData(0, 0, image.width, image.height).data;
            console.log(pixel_data);
        }
    }
}