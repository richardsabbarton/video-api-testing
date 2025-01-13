

class Room {
    constructor(config){
        this.lastUpdateTime = Date.now()
        this.config = config
        this.balls = new Array()
        this.canvas = document.createElement('canvas')
        this.offScreenCanvas = document.createElement('canvas')
        this.canvas.id = 'primary-display'
        this.canvas.classList.add('primary-display')
        document.body.appendChild(this.canvas)
        this.osctx = false
        this.ctx = false
        this.adjustCanvas()
    }

    adjustCanvas(){
        this.canvas.width = window.innerWidth
        this.canvas.height = window.innerHeight
        this.offScreenCanvas.width = this.canvas.width
        this.offScreenCanvas.height = this.canvas.height
        this.ctx = this.canvas.getContext('2d')
        this.osctx = this.offScreenCanvas.getContext('2d')
    }

    clearCanvas(context){
        context.clearRect(0,0,this.canvas.width, this.canvas.height)
    }

    addBall(otObject){
        let ball = new Ball(otObject)
        ball.motion.x = (Math.random() * (this.canvas.width - (ball.motion.currentRadius * 2))) + ball.motion.currentRadius
        console.log(ball.motion)
        this.balls.push(ball)
    }

    startRendering(){
        this.lastUpdateTime = Date.now()
        this.rendering = true
        this.render()
    }

    render(){
        if(this.rendering){
            let interval = Date.now() - this.lastUpdateTime
            this.lastUpdateTime = Date.now()
            this.updateBalls(interval)
            // console.log(interval) avg = 16/17ms in intial test.
            this.renderBalls()
            window.requestAnimationFrame(()=>{
                this.render()
            })
        }
    }

    stopRendering(){
        this.rendering = false
    }

    updateBalls(interval){
        this.balls.forEach(ball=>{
            ball.update(interval)
        })
    }

    renderBalls(){
        this.clearCanvas(this.osctx)
        this.balls.forEach(ball=>{
            ball.draw(this.osctx)
        })
        this.clearCanvas(this.ctx)
        this.ctx.drawImage(this.offScreenCanvas, 0, 0)
    }
}


class Ball {
    constructor(otObject){
        console.log("Creating new Ball", otObject.id)
        this.canvas = document.createElement('canvas')
        this.videoSource = otObject.element.querySelector('video')
        
        this.id = otObject.id
        this.motion = new Motion()
    }


    draw(osc){
        this.canvas.width = this.motion.currentRadius * 2
        this.canvas.height = this.motion.currentRadius * 2
        this.canvas.style.borderRadius = '100%'

        let ctx = this.canvas.getContext('2d')
        ctx.clearRect(0,0,this.canvas.width, this.canvas.height)

        // ctx.drawImage(this.videoSource, 0, 0, this.motion.currentRadius*2, this.motion.currentRadius*2)

        
        ctx.save();
        ctx.beginPath();
        ctx.arc(this.motion.currentRadius, this.motion.currentRadius, this.motion.currentRadius, 0, Math.PI * 2, true);
        ctx.closePath();
        ctx.clip();

        ctx.drawImage(this.videoSource, 
                      (this.videoSource.videoWidth/2) - (this.videoSource.videoHeight/2), 0, this.videoSource.videoHeight, this.videoSource.videoHeight, //img source (square so w = h)
                      0, 0, this.motion.currentRadius * 2, this.motion.currentRadius * 2) //img destination

        ctx.beginPath();
        ctx.arc(0, 0, this.motion.currentRadius, 0, Math.PI * 2, true);
        ctx.clip();
        ctx.closePath();
        ctx.restore();

        this.videoSource.style.width = `${this.motion.currentRadius*2}px`
        this.videoSource.style.height = `${this.motion.currentRadius*2}px`
        this.videoSource.style.borderRadius = '100%'
        
        osc.drawImage(this.canvas, this.motion.x, this.motion.y, this.motion.currentRadius*2, this.motion.currentRadius*2)
    }

    update(interval){

    }
}


class Motion {
    constructor(){
        this.x = 100.0
        this.y = 100.0
        this.targetRadius = 100.0
        this.targetSpeedX = 0.0
        this.targetSpeedY = 10.0
        this.currentRadius = 100.0
        this.currentSpeedX = 0.0
        this.currentSpeedY = 0.0
    }

    move(container, ballArray){
        
    }
}

export {Room}