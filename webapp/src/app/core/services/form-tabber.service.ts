import { Injectable } from "@angular/core";

@Injectable({
    providedIn: 'root'
})
export class FormTabberService {

    private keys: string[] = [];
    private currentIndex = -1;
    private onFocus: (key: string)=>void = (key:string)=>{};
    private ignoreSetTo = false;

    private keyDownFc = (e:any) => {
        var keyCode = e.keyCode;
            if((keyCode === 9 && e.shiftKey) || keyCode === 37 ) {
                this.ignoreSetTo = true;
                this.previouse();
                this.ignoreSetTo = false;
            } else if(keyCode === 9 || keyCode === 39) {
                this.ignoreSetTo = true;
                this.next();
                this.ignoreSetTo = false;
            }
    }

    public register(keys: string[], onFocus: (key: string)=>void) {
        this.currentIndex = -1;
        this.keys = keys;
        this.onFocus = onFocus;

        document.addEventListener("keydown", this.keyDownFc, false);
    }

    public unregister() {
        this.keys = [];
        this.currentIndex = -1;
        this.onFocus = (key:string)=>{};

        document.removeEventListener("keydown", this.keyDownFc);
    }

    public isActive() {
        return this.keys && this.keys.length > 0;
    }

    public setTo(i: number | string) {
        if(this.isActive() && !this.ignoreSetTo) {
            if(typeof i === 'number') {
                this.currentIndex = i;
            } else if(typeof i === 'string') {
                this.currentIndex = this.keys.indexOf(i);
            }
        }
    }

    public reset() {
        this.currentIndex = -1;
    }

    public next() {
        this.currentIndex ++;

        if(this.currentIndex >= this.keys.length) {
            this.currentIndex = 0;
        }

        if(this.onFocus) {   
            this.onFocus(this.keys[this.currentIndex]);
        }
    }

    public previouse() {
        this.currentIndex --;

        if(this.currentIndex < 0) {
            this.currentIndex = this.keys.length-1;
        }

        if(this.onFocus) {   
            this.onFocus(this.keys[this.currentIndex]);
        }
    }

}