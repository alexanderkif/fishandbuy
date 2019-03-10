import { bind } from 'decko';
import Login from '../login/Login';
import Content from '../content/Content';

export default class Menu {
    constructor(){
        this.home = document.querySelector('.menu__item-home');
        this.add = document.querySelector('.menu__item-add');
        this.lots = document.querySelector('.menu__item-lots');
        this.about = document.querySelector('.menu__item-about');
        var loginElement = document.querySelector('.login');
        if (loginElement) {
            this.login = new Login(loginElement);
            this.login.subscribe(function(data) {
                if (data.user == "nouser") {
                    this.add.classList.add('menu__item_hidden');
                    this.lots.classList.add('menu__item_hidden');
                }
                else {
                    this.add.classList.remove('menu__item_hidden');
                    this.lots.classList.remove('menu__item_hidden');
                }
            }.bind(this));
        };
        this.content = new Content();
        this.items = document.querySelectorAll('.menu__item');
        [].forEach.call(this.items, (item) => item.addEventListener('click', this.content.changeContent));
    }
    
    // @bind
    // cclick() {
    //     this.getJson('http://localhost:8080/doc/5aa38122941b260001cd3314', function(data){
    //     this.messages.textContent = JSON.stringify(data);
    //     }.bind(this));
    // }

    // var form = new FormData(document.getElementById('login-form'));
    // fetch("/login", {
    // method: "POST",
    // body: form
    // });

    // @bind
    // clickPage(e){
    //     if(e.target.classList.contains("content__page_current")) return;
    //     if(e.target.classList.contains("content__pages")) return;
    //     this.messages.innerHTML = '';
    //     this.pages.innerHTML = '';
    //     this.getDocs(e.target.firstChild.nodeValue);
    // }

    // @bind
    // getDocs(page) {
    //     this.getJson('doc?page=' + page, function(data){
    //         data[0].forEach(message => {
    //             var element = document.createElement("div");
    //             element.className = "content__item";
    //             var mess = new Message(message);
    //             element.appendChild(mess);
    //             this.messages.appendChild(element);
    //         });
    //         for (let index = 0; index < data[2]; index++) {
    //             var element = document.createElement("div");
    //             element.className = "content__page";
    //             if (index+1 == +page)
    //                 element.className += " content__page_current";
    //             element.textContent = index+1;
    //             this.pages.appendChild(element);                
    //         }
    //     }.bind(this));
    // }

    // async getJson(url, fn) {
    //     await fetch(url)
    //     .then(response => 
    //         response.json().then(data => ({
    //             data: data,
    //             status: response.status
    //         })
    //         ).then(res => {
    //             fn(res.data);
    //             console.log(res.status, res.data);
    //         })
    //     );
    // }
}