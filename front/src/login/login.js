import {bind} from 'decko';

class Login {
    constructor(element) {
        this.main = document.querySelector('.main');
        this.btn = element.querySelector('.login__btn');
        this.btn.addEventListener('click', this.openModal);
    }

    @bind
    openModal() {
        this.shadow = document.createElement("div");
        this.shadow.classList.add('login__shadow');
        this.shadow.addEventListener('click', this.closeModal);
        this.main.appendChild(this.shadow);
        this.createGrid();
    }

    @bind
    closeModal() {
        this.main.removeChild(this.shadow);
    }

    @bind
    createGrid() {
        this.grid = document.createElement("div");
        this.grid.classList.add('login__grid');
        this.shadow.appendChild(this.grid);
        this.grid.addEventListener('click', function (e) { e.stopPropagation(); });
        this.createTabLogin();
        this.createTabRegister();
        this.createEmail();
        this.createPassword();
        this.createBtnSubmit();
    }

    @bind
    createBtnSubmit() {
        this.btnSbmt = document.createElement("input");
        this.btnSbmt.classList.add('login__submit');
        this.btnSbmt.type = 'submit';
        this.btnSbmt.value = 'Submit';
        this.btnSbmt.disabled = true;
        this.grid.appendChild(this.btnSbmt);
        this.btnSbmt.addEventListener('click', this.clickBtnSbmt);
    }

    @bind
    createTabRegister() {
        this.btnReg = document.createElement("input");
        this.btnReg.classList.add('login__btn-reg');
        this.btnReg.type = 'submit';
        this.btnReg.value = 'Register';
        this.btnReg.disabled = false;
        this.grid.appendChild(this.btnReg);
        this.btnReg.addEventListener('click', this.clickBtnReg);
    }

    @bind
    createTabLogin() {
        this.btnLog = document.createElement("input");
        this.btnLog.classList.add('login__btn-log');
        this.btnLog.type = 'submit';
        this.btnLog.value = 'Sign in';
        this.btnLog.disabled = true;
        this.grid.appendChild(this.btnLog);
        this.btnLog.addEventListener('click', this.clickBtnLog);
    }

    @bind
    createPassword() {
        this.pass = document.createElement("input");
        this.pass.classList.add('login__password');
        this.pass.placeholder = 'password';
        this.pass.type = 'password';
        this.pass.name = 'password';
        this.grid.appendChild(this.pass);
        this.pass.addEventListener('keyup', this.checkPassword);
    }

    @bind
    createEmail() {
        this.email = document.createElement("input");
        this.email.classList.add('login__email');
        this.email.placeholder = 'e-mail';
        this.email.type = 'text';
        this.email.name = 'email';
        this.grid.appendChild(this.email);
        this.email.addEventListener('keyup', this.checkEmail);
    }

    @bind
    clickBtnSbmt() {
        if(this.btnReg.disabled) {
            //register
            this.addUser();
        }
        else {
            //login
            this.login();
        }      
    }

    @bind
    async addUser() {
        await fetch('account', { method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify({ "email": this.email.value, "pass": this.pass.value, "phone": this.phone.value})})
        .then(function (response) {
            alert(response.status);
        });
        this.main.removeChild(this.shadow);
    }

    @bind
    async login() {
        var form = new FormData();
        form.append("username", this.email.value);
        form.append("password", this.pass.value);
        await fetch("login", {
            method: "POST",
            body: form
          })
        // await fetch('login', { method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify({ "username": this.email.value, "password": this.pass.value})})
        .then(function (response) {
            console.log(response);
            alert(response.status);
        });
        this.main.removeChild(this.shadow);
    }

    @bind
    clickBtnLog() {
        this.grid.classList.remove('login__grid_reg');
        this.grid.removeChild(this.phone);
        this.btnLog.disabled = true;
        this.btnReg.disabled = false;
        this.checkButton("login");
    }

    @bind
    clickBtnReg() {
        this.grid.classList.add('login__grid_reg');
        this.phone = document.createElement("input");
        this.phone.classList.add('login__phone');
        this.phone.placeholder = '+79123456789';
        this.phone.type = 'text';
        this.phone.name = 'phone';
        this.grid.appendChild(this.phone);
        this.phone.addEventListener('keyup', this.checkPhone);
        this.btnLog.disabled = false;
        this.btnReg.disabled = true;
        this.checkButton("register");
    }

    @bind
    checkEmail(){
        var regExpToCheck = new RegExp("^(([^<>()[\\]\\\\.,;:\\s@\\']+(\\.[^<>()[\\]\\\\.,;:\\s@\\']+)*)|(\\'.+\\'))@((\\[[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}\\])|(([a-zA-Z\\-0-9]+\\.)+[a-zA-Z]{2,}))$");
        this.checkRegExp(this.email, regExpToCheck);
    }

    @bind
    checkPassword(){
        var regExpToCheck = new RegExp("^([a-zA-Z0-9_-]){3,10}$");
        this.checkRegExp(this.pass, regExpToCheck);
    }

    @bind
    checkPhone(){
        var regExpToCheck = new RegExp("^[+]*([0-9]){11}$");
        this.checkRegExp(this.phone, regExpToCheck);
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
        if(this.btnReg.disabled) {
            this.checkButton("register");
        }
        else {
            this.checkButton("login");
        }
    }

    @bind
    checkButton(param) {
        let condition = false;
        if (param == "register") condition = this.email.check && this.pass.check && this.phone.check;
        else condition = this.email.check && this.pass.check;
        if (condition) {
            this.btnSbmt.disabled = false;
        }
        else {
            this.btnSbmt.disabled = true;
        }
    }
}

var loginElement = document.querySelector('.login');
if (loginElement) new Login(loginElement);