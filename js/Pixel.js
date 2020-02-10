class Pixel {
    constructor(red, green, blue, alpha){
        this.red = red;
        this.green = green;
        this.blue = blue;
        this.alpha = alpha;
    }
    
    set_rgb(r, g, b) {
        this.red = r;
        this.green = g;
        this.blue = b;
    }
    
    get_avg(){
        return (this.red + this.green + this.blue)/3;
    }
}