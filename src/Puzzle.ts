import Timer from './Timer';
export default class Puzzle {


    tiles: Tile[];
    emptyPos: number;
    id: string;
    el: HTMLElement;
    timer: Timer;

    constructor(id: string){
        this.el = document.getElementById(id);
        this.id = id;
        this.tiles = [];
        this.el.setAttribute('data-empty-pos', 15 + "");
        this.timer = new Timer(document.getElementById('timer'));
        this.init();
    }
    shuffleArray(){
        var array = [];
        for(let i=0; i< 16; i++){
            array.push(i);
        }
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    };
    init(){
        var arr = this.shuffleArray();

        for(let i=0; i<4; i++){
            for(let j=0; j<4; j++){
                var index = i*4 + j + 1;
                if(index !== 16){
                    var t = new Tile(index, index - 1);
                    this.el.appendChild(t.getEl());
                    this.tiles.push(t);
                }
            }   
        }
        //this.el.setAttribute('data-empty-pos', arr.pop() + "");
        this.el.addEventListener('click', this.checkSuccess.bind(this));
        document.querySelector('#success-dialog button.cta').addEventListener('click', this.reset.bind(this));
        document.querySelector('#reset').addEventListener('click', this.reset.bind(this));
        //this.timer.start();
        setTimeout(() => {
            this.reset();
        }, 1000);
        
    }

    reset(){
        this.hideSuccessDialog();
        var arr = this.shuffleArray();
        this.tiles.forEach( (t, i) => {
            t.setPos(arr.pop())
        })
        this.el.setAttribute('data-empty-pos', arr.pop() + "");
        this.timer.reset();
        this.timer.start();
    }

    showSuccessDialog(){
        var time_elapsed = this.timer.getTimeElapsed();
        document.getElementById('success-dialog').style.display = 'flex';
        document.querySelector('#success-dialog .time').innerHTML = '' + time_elapsed.min + 'mins ' + time_elapsed.sec + 'seconds'
        setTimeout(() => {
            document.getElementById('success-dialog').setAttribute('show', 'true');
        }, 300);
    }
    hideSuccessDialog(){
        document.getElementById('success-dialog').removeAttribute('show');

        setTimeout(() => {
            document.getElementById('success-dialog').style.display = 'flex';
        }, 300);
    }

    checkSuccess(){
        var success = true;
        this.tiles.forEach( (t, i) => {
            if(t.index -1 !== t.position){
                success = false;
            }else {
                console.log('Tile in order', t);
            }
        })
        console.log('Tiles in order', success);
        if(success){
            this.timer.stop();
        }
        return success;
    }
}

class Tile {
    index: number;
    position: number;
    el: HTMLElement
    constructor(index: number, position: number) {
        this.index = index;
        this.position = position;
        this.init();
    }
    init(){
        this.el = document.createElement('div');
        this.el.className = 'tile';
        this.el.innerHTML = "<span class='index'>" + this.index + "</span>";
        this.el.setAttribute('data-index', this.index + "");
        this.align();
        this.el.addEventListener('click', this.move.bind(this))
    }
    checkValid(currPos:number, emptyPos:number){
        if(emptyPos >= 0 && emptyPos < 16){
            if(currPos%4 === 0){
                if(emptyPos === currPos + 4 || emptyPos === currPos - 4 || emptyPos === currPos + 1){
                    return true
                }
            }else if(currPos%4 === 3){
                if(emptyPos === currPos + 4 || emptyPos === currPos - 4 || emptyPos === currPos - 1){
                    return true
                }
            }else if(currPos%4 === 1 || currPos%4 === 2){
                if(emptyPos === currPos + 4 || emptyPos === currPos - 4 || emptyPos === currPos - 1 || emptyPos === currPos + 1){
                    return true
                }
            }
        }
        return false
    }
    setPos(position: number){
        this.position = position;
        this.align();
    }
    align(){
        if(this.position > -1 && this.position < 16){
            let y = Math.floor(this.position/4),
            x = this.position%4;
            this.el.style.top = (125 * y) + 'px';
            this.el.style.left = (125 * x) + 'px';
            this.el.setAttribute('data-pos', this.position + "");
        }
    }
    move(){

        let empty_pos = Number(this.el.parentElement.getAttribute('data-empty-pos') || "");
        if(empty_pos !== -1 && this.checkValid(this.position, empty_pos)){
            let old = this.position;
            this.setPos(empty_pos);
            this.el.parentElement.setAttribute('data-empty-pos', old + "");

        }
    }
    getEl(){
        return this.el;
    }
}