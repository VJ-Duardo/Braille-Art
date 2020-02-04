var text_input = document.getElementById("input");

var option_checkbox = document.getElementById("dotForBlank");

var file_input = document.getElementById("fileinput");

var height_input = document.getElementById("height");
var width_input = document.getElementById("width");

var brightness_input = document.getElementById("brightness");
brightness_input.oninput = generate_click;

var canvas = document.createElement('canvas');
var context = canvas.getContext('2d');

var default_size = 100;


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


function generate_click(){
    if (file_input.files.length === 0) {
        return;
    }
    let file = file_input.files[0];
    
    let reader = new FileReader();
    reader.readAsDataURL(file);
    
    reader.onload = readerEvent => {
        let image = new Image();
        image.src = readerEvent.target.result;
        
        image.onload = function(){
            canvas.width = isNum(width_input.value);
            canvas.height = isNum(height_input.value);
            context.drawImage(image, 0, 0, canvas.width, canvas.height);
            let pixel_data = context.getImageData(0, 0, canvas.width, canvas.height).data;
            text_input.value = iterate_over_pixels(pixel_data, canvas.width, option_checkbox.checked, brightness_input.value);
        };
    };
}

function isNum(val){
    if (isNaN(parseInt(val))){
        return default_size;
    } else {
        return val;
    }
}