import { bind } from 'decko';
import Message from '../message/Message'
import Docform from '../docform/docform';

export default class Content {
    constructor(){
        this.content = document.querySelector('.content');
        this.messages = document.querySelector('.content__messages');
        this.pages = document.querySelector('.content__pages');
        this.docform = document.querySelector('.content__docform');
        this.about = document.querySelector('.content__about');
        this.getDocs(1);
        this.pages.addEventListener('click', this.clickPage);
    }

    @bind
    changeContent(e) {
        var classes = e.currentTarget.classList;
        if (classes.contains('menu__item-home') || classes.contains('menu__item-lots')) {
            this.content.classList.add('content_hidden');
            this.messages.classList.remove('content__messages_hidden');
            this.pages.classList.remove('content__pages_hidden');
            this.docform.classList.add('content__docform_hidden');
            this.about.classList.add('content__about_hidden');
        }
        if (classes.contains('menu__item-add')) {
            this.content.classList.remove('content_hidden');
            this.messages.classList.add('content__messages_hidden');
            this.pages.classList.add('content__pages_hidden');
            this.docform.classList.remove('content__docform_hidden');
            this.about.classList.add('content__about_hidden');
            this.docForm = new Docform({title:"",text:"",price:"",place:"",imgFileIds:[]});
        }
        if (classes.contains('menu__item-about')) {
            this.content.classList.remove('content_hidden');
            this.messages.classList.add('content__messages_hidden');
            this.pages.classList.add('content__pages_hidden');
            this.docform.classList.add('content__docform_hidden');
            this.about.classList.remove('content__about_hidden');
        }
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

    @bind
    clickPage(e){
        if(e.target.classList.contains("content__page_current")) return;
        if(e.target.classList.contains("content__pages")) return;
        this.messages.innerHTML = '';
        this.pages.innerHTML = '';
        this.getDocs(e.target.firstChild.nodeValue);
    }

    @bind
    getDocs(page) {
        this.getJson('doc?page=' + page, function(data){
            data[0].forEach(message => {
                var element = document.createElement("div");
                element.className = "content__item";
                var mess = new Message(message);
                element.appendChild(mess);
                this.messages.appendChild(element);
            });
            for (let index = 0; index < data[2]; index++) {
                var element = document.createElement("div");
                element.className = "content__page";
                if (index+1 == +page)
                    element.className += " content__page_current";
                element.textContent = index+1;
                this.pages.appendChild(element);                
            }
        }.bind(this));
    }

    async getJson(url, fn) {
        await fetch(url)
        .then(response => 
            response.json().then(data => ({
                data: data,
                status: response.status
            })
            ).then(res => {
                fn(res.data);
                console.log(res.status, res.data);
            })
        );
    }
}