// the start/stop triggers must be in the file that instanciate
// the method .computeFPS() must be called in the main loop (inside the if of() deltaTime >= frameRate)
class Benchmark {
    constructor(frameRate, idealFPSValueLimit){
        this.currentFPSValue = 0
        this.frames = 0
        this.missingFrames = 0
        this.frameRate = frameRate
        this.idealFPSValueLimit = idealFPSValueLimit
        this.startTime = 0
    }

    computeFPS(){
        const t = performance.now();
        const dt = t - this.startTime;
    
        if( dt > this.frameRate ){
            this.currentFPSValue = this.frames * 1000 / dt;
    
            this.frames = 0;
            this.startTime = t;
        }

        this.frames++;
    
        if( this.currentFPSValue < this.idealFPSValueLimit ){
            this.missingFrames++
        }
    }
}


export { Benchmark }