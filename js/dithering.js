
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