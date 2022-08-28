export default class Paddle {
    constructor(x, y, width, height, canvasHeight){
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.canvasHeight = canvasHeight;
        this.dy = 0;
        this.maxSpeed = 1000;
    }
    
    update(dt){
        if (this.dy < 0){
            this.y = Math.max(0, this.y + this.dy * dt);
        }
        else {
            this.y = Math.min(this.canvasHeight - this.height, this.y + this.dy * dt);
        }
    }

    render(context){
        context.fillRect(this.x, this.y, this.width, this.height);
        context.fillStyle = `white`;
    }

    moveUp(){
        this.dy = -this.maxSpeed;
    }

    moveDown(){
        this.dy = this.maxSpeed;
    }

    stop(){
        this.dy = 0;
    }

}