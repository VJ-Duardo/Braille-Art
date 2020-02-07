var text_input = document.getElementById("input");

var input_select = document.getElementById("inputSelection");

var twitch_input_table = document.getElementById("twitchInput");
var channel_input = document.getElementById("channel");
var emote_input = document.getElementById("emote");
var status_line = document.getElementById("status");
var text = document.createTextNode("");
status_line.appendChild(text);

var file_input = document.getElementById("fileinput");

var option_checkbox = document.getElementById("dotForBlank");
var transparency_checkbox = document.getElementById("transparency");

var brightness_input = document.getElementById("brightness");
var height_input = document.getElementById("height");
var width_input = document.getElementById("width");
var gen_button = document.getElementById("genButton");

var canvas = document.createElement('canvas');
var context = canvas.getContext('2d');

var default_size = 60;
var cached_url;
var background_white = false;


gen_button.onclick = generate_from_twitch_click;
input_select.onchange = (function(){
    switch(input_select.value){
        case "upload":
            twitch_input_table.style.display = "none";
            file_input.style.display = "block";
            gen_button.onclick = generate_click;
            break;
        case "twitch":
            file_input.style.display = "none";
            twitch_input_table.style.display = "block";
            gen_button.onclick = generate_from_twitch_click;
            break;
    }
});

option_checkbox.onchange = (function() {
    process_image(cached_url);
});

transparency_checkbox.onchange = (function(){
    process_image(cached_url);
});


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
        process_image(readerEvent.target.result);
    };
}

function generate_from_twitch_click(){
    search_all(channel_input.value.replace(/\s/g, '').toLowerCase(), emote_input.value.replace(/\s/g, ''))
            .then((url) => {
                if (typeof url === 'undefined'){
                    text.nodeValue = "Could not be found.";
                    return;
                }
                text.nodeValue = "";
                process_image(url);
    });
}


function slider_drag(){
    process_image(cached_url);
}


function process_image(src){
    if (typeof src === 'undefined'){
        return;
    }
    let image = new Image();
    image.crossOrigin = "Anonymous";
    image.src = src;
    cached_url = src;
    
    image.onload = function(){
        canvas.width = is_num(width_input.value);
        canvas.height = is_num(height_input.value);
        context.drawImage(image, 0, 0, canvas.width, canvas.height);
        let pixel_data = context.getImageData(0, 0, canvas.width, canvas.height).data;
        text_input.value = iterate_over_pixels(pixel_data, canvas.width, option_checkbox.checked, brightness_input.value, transparency_checkbox.checked);
        text_input.cols = Math.ceil(canvas.width/2)*1.5;
        text_input.rows = Math.ceil(canvas.height/4)*1.2;
    };
}


function is_num(val){
    if (isNaN(parseInt(val))){
        return default_size;
    } else {
        return val;
    }
}


function toggle_background(){
    if (background_white){
        text_input.style.background = 'rgba(20,20,20,0.5)';
        text_input.style.color = 'white';
        background_white = false;
    } else {
        text_input.style.background = 'rgba(230,230,230,0.5)';
        text_input.style.color = 'black';
        background_white = true;
    }
}