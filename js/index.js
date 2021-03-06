var text_input = document.getElementById("input");

var input_select = document.getElementById("inputSelection");

var loading_animation = document.getElementById("loader");
var twitch_input_table = document.getElementById("twitchInput");
var channel_input = document.getElementById("channel");
var emote_input = document.getElementById("emote");
var status_line = document.getElementById("status");

var file_input = document.getElementById("fileinput");
var link_input = document.getElementById("linkinput");

var option_checkbox = document.getElementById("dotForBlank");
var transparency_checkbox = document.getElementById("transparency");
var dithering_checkbox = document.getElementById("dithering");
var dithering_select = document.getElementById("ditheringSelection");

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
            file_input.style.display = "block";
            twitch_input_table.style.display = "none";
            link_input.style.display = "none";
            gen_button.onclick = generate_click;
            break;
        case "twitch":
            twitch_input_table.style.display = "block";
            file_input.style.display = "none";
            link_input.style.display = "none";
            gen_button.onclick = generate_from_twitch_click;
            break;
        case "link":
            link_input.style.display = "block";
            file_input.style.display = "none";
            twitch_input_table.style.display = "none";
            gen_button.onclick = generate_from_link;
    }
});

option_checkbox.onchange = (function() {
    process_image(cached_url);
});

transparency_checkbox.onchange = (function(){
    process_image(cached_url);
});

dithering_checkbox.onchange = (function(){
    process_image(cached_url);
});

dithering_select.onchange = (function(){
    if (dithering_checkbox.checked){
        process_image(cached_url);
    }
});

emote_input.addEventListener("keyup", function(event) {
    if (event.keyCode === 13){
        generate_from_twitch_click();
    }
});

channel_input.addEventListener("keyup", function(event) {
    if (event.keyCode === 13){
        generate_from_twitch_click();
    }
});

link_input.addEventListener("keyup", function(event) {
    if (event.keyCode === 13){
        generate_from_link();
    }
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

function generate_from_link(){
    loading_animation.style.display = "block";
    if (is_url(link_input.value)){
        process_image(link_input.value);
    } else {
        set_error_state();
    }
}

function generate_from_twitch_click(){
    loading_animation.style.display = "block";
    search_all(channel_input.value.replace(/\s/g, '').toLowerCase(), emote_input.value.replace(/\s/g, ''))
            .then((url) => {
                if (typeof url === 'undefined'){
                    set_error_state();
                    return;
                }
                process_image(url);
    });
}


function slider_drag(){
    process_image(cached_url);
}


function process_image(src, second_try=false){
    if (typeof src === 'undefined'){
        return;
    }
    let image = new Image();
    image.crossOrigin = "Anonymous";
    image.src = src;
    cached_url = src;
    
    image.onload = function(){
        loading_animation.style.display = "none";
        status_line.style.display = "none";
        canvas.width = is_num(width_input.value);
        canvas.height = is_num(height_input.value);
        context.drawImage(image, 0, 0, canvas.width, canvas.height);
        let pixel_data = context.getImageData(0, 0, canvas.width, canvas.height).data;
        text_input.value = iterate_over_pixels(pixel_data, canvas.width, option_checkbox.checked, brightness_input.value, transparency_checkbox.checked, dithering_checkbox.checked, dithering_select.value);
        text_input.cols = Math.ceil(canvas.width/2)*1.5;
        text_input.rows = Math.ceil(canvas.height/4)*1.2;
    };
    
    image.onerror = function(){
        if (second_try){
            set_error_state();
        } else {
            process_image(corsproxy+cached_url, true);
        }
    };
}


function is_num(val){
    if (isNaN(parseInt(val))){
        return default_size;
    } else {
        return val;
    }
}


function set_error_state(){
    loading_animation.style.display = "none";
    status_line.style.display = "block";
}


function toggle_background(){
    if (background_white){
        text_input.style.background = 'rgb(40,40,40)';
        text_input.style.color = 'white';
        background_white = false;
    } else {
        text_input.style.background = 'rgba(230,230,230,0.5)';
        text_input.style.color = 'black';
        background_white = true;
    }
}