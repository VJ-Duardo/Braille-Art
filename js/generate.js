var color_treshold = 150;
var fill_transparency = false;


function iterate_over_pixels(data_array, width, dot_for_blank, brightness, fill_tran){
    fill_transparency = fill_tran;
    color_treshold = 255 - brightness;
    let result_array = new Array();
    let pixel_array = new Array();
    for(i=0; i<data_array.length; i+=4){
        pixel_array.push(new Pixel(data_array[i], data_array[i+1], data_array[i+2], data_array[i+3]));
    }
    
    for(i=0; i<pixel_array.length; i+=(width*4)){
        let line = "";
        for(j=0; j<width; j+=2){
            line += braille_descr_dic[get_braille_code(pixel_array, i+j, width)];
        }
        result_array.push(line);
    }
    
    if (dot_for_blank){
        return result_array.join('\n').replace(/[⠀]/g, '⠄');
    } else {
        return result_array.join('\n');
    }
}


function get_braille_code(pixel_array, pos, width){
    let braille_code = "";
    let pixel_pos_to_braille_pos = {
        '00': '1',
        '01': '2',
        '02': '3',
        '03': '7',
        '10': '4',
        '11': '5',
        '12': '6',
        '13': '8'
    };
    for(k=0; k<2; k++){
        for(l=0; l<4; l++){
            if ((pos + k + (width*l)) < pixel_array.length){
                if (evaluate_pixel(pixel_array[(pos + k + (width*l))])){
                    braille_code += pixel_pos_to_braille_pos[(k.toString() + l.toString())];
                }
            }
        }
    }
    return braille_code.split("").map(Number).sort((a, b) => (a - b)).join('');
}


function evaluate_pixel(pixel){
    if (fill_transparency === true && pixel.alpha === 0){
        return true;
    }
    if (pixel.red > color_treshold || pixel.green > color_treshold || pixel.blue > color_treshold){
        return true;
    } else {
        return false;
    }
}