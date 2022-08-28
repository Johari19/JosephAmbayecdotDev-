export default class Agent{
    /**
     * 
     * @param {Paddle} paddle
     * The Paddle that the Agent controls
     */
    constructor(paddle){
        this.paddle = paddle;
    }

    /**
     * 
     * @param {Ball} ball 
     * The Ball the Agent tries to follow
     */
    // Tries to track the ball with respect to the middle of the paddle
    trackBall(ball) {
        if ((this.paddle.y + this.paddle.height / 2) < ball.y)
            this.paddle.moveDown();
        else if ((this.paddle.y + this.paddle.height / 2) > ball.y)
            this.paddle.moveUp();
        else
            this.paddle.stop();
    }

    /**
     * Stops the agent from moving
     */
    stop(){
        this.paddle.stop();
    }
}