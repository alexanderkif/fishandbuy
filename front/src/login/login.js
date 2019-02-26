import {bind} from 'decko';

class Login {
    constructor(element) {
        this.email = element.querySelector('.login__email');
        this.pass = element.querySelector('.login__password');
        this.button = element.querySelector('.login__button');
        this.email.addEventListener('keyup', this.checkEmail);
        this.pass.addEventListener('keyup', this.checkPassword);
        this.button.addEventListener('click', this.clickButton);
    }

    @bind
    clickButton() {
        
    }

    @bind
    checkEmail(){
        var regExpToCheck = new RegExp("^(([^<>()[\\]\\\\.,;:\\s@\\']+(\\.[^<>()[\\]\\\\.,;:\\s@\\']+)*)|(\\'.+\\'))@((\\[[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}\\])|(([a-zA-Z\\-0-9]+\\.)+[a-zA-Z]{2,}))$");
        this.checkRegExp(this.email, regExpToCheck);
    }

    @bind
    checkPassword(){
        var regExpToCheck = new RegExp("^([a-zA-Z_-]){3,10}$");
        this.checkRegExp(this.pass, regExpToCheck);
    }

    checkRegExp(element, regExpToCheck) {
        if (regExpToCheck.test(element.value)) {
            element.classList.remove("error");
            element.check = true;
        }
        else {
            element.classList.add("error");
            element.check = false;
        }
        this.checkButton();
    }

    @bind
    checkButton() {
        if (this.email.check && this.pass.check) {
            this.button.disabled = false;
        }
        else {
            this.button.disabled = true;
        }
    }
}

var loginElement = document.querySelector('.login');
if (loginElement) new Login(loginElement);