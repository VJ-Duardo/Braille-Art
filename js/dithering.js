
function ordered_dithering(pixel_array, width, brightness){
    let change_factor = brightness/128;
    let matrix = [[64*change_factor, 128*change_factor], [192*change_factor, 0]];
    for (i=0; i<pixel_array.length; i++){
        let x = i % width;
        let y = Math.floor(i/width);
        if (pixel_array[i].get_avg() > matrix[(y % matrix.length)][x % matrix.length]){
            pixel_array[i].set_rgb(255, 255, 255);
        } else {
            pixel_array[i].set_rgb(0, 0, 0);
        }
    }
    return pixel_array;
}



function clip(color){
    if (color > 255){
        color = 255;
    } else if (color < 0){
        color = 0;
    }
    return color;
}


function floyd_steinberg(pixel_array, width, brightness){
   for (i=0; i<pixel_array.length; i++){
        
        quant_error = [pixel_array[i].red, pixel_array[i].green, pixel_array[i].blue];
        let slider_perc = brightness/255;
        let red_poly = Math.pow(1-slider_perc, 2);
        let green_poly = 2*(1-slider_perc)*slider_perc;
        let blue_poly = Math.pow(slider_perc, 2);
        
        if ((red_poly*pixel_array[i].red + green_poly*pixel_array[i].green + blue_poly*pixel_array[i].blue) > 128){
           quant_error.forEach((elem, index, array) => array[index] -= 255);
           pixel_array[i].set_rgb(255, 255, 255);
        } else {
           pixel_array[i].set_rgb(0, 0, 0);
        }
       
        let neighbours = [[1,0,7], [-1,1,3], [0,1,5], [1,1,1]];
        for (const n of neighbours){
            if ((i+(n[1]*width))+n[0] < pixel_array.length && (i % width)+n[0] >= 0 && (i % width)+n[0] < width){
                let pixel_index = i+(n[1]*width)+n[0];
                let new_colors = new Array(3);
                quant_error.forEach((elem, index) => new_colors[index] = Object.values(pixel_array[pixel_index])[index] + elem * n[2] /16);
                pixel_array[pixel_index].set_rgb(new_colors[0], new_colors[1], new_colors[2]);
            }
        }
   }
   return pixel_array;
}