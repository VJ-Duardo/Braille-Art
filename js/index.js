var text_input = document.getElementById("input");

var option_checkbox = document.getElementById("dotForBlank");

var file_input = document.getElementById("fileinput");

var canvas = document.createElement('canvas');
var context = canvas.getContext('2d');


function click(task) {
    let input = text_input.value;
    let dot_for_blank = option_checkbox.checked;
    let output = task(input, dot_for_blank);
    text_input.value = output;
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


file_input.onchange = e => {
    let file = e.target.files[0];
    
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
            text_input.value = iterate_over_pixels(pixel_data, image.width, option_checkbox.checked);
        }
    }
}