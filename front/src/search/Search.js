import {bind} from 'decko';

export default class Search {
    constructor(element){
        this.input = element.querySelector('.search__input');
        this.button = element.querySelector('.search__button');
        this.button.disabled = true;
        this.input.addEventListener('keyup', this.checkInput);
        this.input.addEventListener('keypress', function (e) {
            var key = e.which || e.keyCode;
            if (key === 13) this.clickBtnSearch();
        }.bind(this));
        // this.button.addEventListener('click', this.clickBtnSearch);
    }

    @bind
    checkInput(){
        var regExpToCheck = new RegExp("^([a-zA-Z0-9_-]){3,}$");
        if (regExpToCheck.test(this.input.value)) {
            this.input.classList.remove("error");
            this.button.disabled = false;
        }
        else {
            this.input.classList.add("error");
            this.button.disabled = true;
        }
    }

    // @bind
    // clickBtnSearch(){
    //     document.find = this.input.value;
    //     this.button.dispatchEvent(new Event("click", {bubbles: true, cancelable: true}));
    // }
}