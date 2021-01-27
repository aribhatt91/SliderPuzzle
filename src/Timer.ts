export default class Timer {
    sec: number;
    min: number;
    timer: any;
    el: HTMLElement;

    constructor(el: HTMLElement){
        this.el = el;
        this.reset();
    }

    start(){
        this.timer = setInterval(() => {
            if(this.sec < 59){
                this.sec += 1;
            }else {
                this.sec = 0;
                this.min += 1;
            }
            this.show();
        }, 1000)
    }

    stop(){
        clearInterval(this.timer);
    }

    reset(){
        this.min = 0;
        this.sec = 0;
        this.show();
    }

    show(){
        let str = ("00" + this.min).slice(-2) + ":" + ("00" + this.sec).slice(-2);
        
        if(this.el){
            this.el.innerHTML = str;
        }else {
            console.log(str);
        }
    }

    getTimeElapsed(){
        return {min: this.min, sec: this.sec};
    }
}