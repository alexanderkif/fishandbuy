import { bind } from 'decko';
import Message from '../message/Message'
import Docform from '../docform/Docform';

export default class Content {
    constructor(){
        this.content = document.querySelector('.content');
        this.messages = document.querySelector('.content__messages');
        this.pages = document.querySelector('.content__pages');
        this.docform = document.querySelector('.content__docform');
        this.about = document.querySelector('.content__about');
        this.find = "";
        this.place = "";
        this.mylots = "";
        this.pages.addEventListener('click', this.clickPage);
        this.content.addEventListener('editMessage', this.editMessage);
    }

    @bind
    editMessage(e) {
        let msg = e.target;
        this.content.classList.remove('content_hidden');
        this.messages.classList.add('content__messages_hidden');
        this.pages.classList.add('content__pages_hidden');
        this.docform.classList.remove('content__docform_hidden');
        this.about.classList.add('content__about_hidden');
        var fn = function(data){
            var id = data.id;
            var title = data.title;
            var text = data.text;
            var price = data.price;
            var place = data.place;
            var imgFileIds = data.imgFileIds;
            if (this.inDocForm) this.inDocForm.setDocform({id:id,title:title,text:text,price:price,place:place,imgFileIds:imgFileIds});
            else this.inDocForm = new Docform({id:id,title:title,text:text,price:price,place:place,imgFileIds:imgFileIds});
        }.bind(this);
        this.getJson(`doc/${msg.children[0].innerText}`, fn);        
    }

    @bind
    changeContent(e) {
        var classes = e.currentTarget.classList;
        if (e.target.classList.contains('search__button')) {
            this.mylots = "";
            this.find = document.find;
            if (document.find=="") this.find = "clear";
            this.getPage(1);
            this.content.classList.add('content_hidden');
            this.messages.classList.remove('content__messages_hidden');
            this.pages.classList.remove('content__pages_hidden');
            this.docform.classList.add('content__docform_hidden');
            this.about.classList.add('content__about_hidden');
        }
        if (classes.contains('menu__item-home')) {
            this.mylots = "";
            this.find = "clear";
            this.getPage(1);
            this.content.classList.add('content_hidden');
            this.messages.classList.remove('content__messages_hidden');
            this.pages.classList.remove('content__pages_hidden');
            this.docform.classList.add('content__docform_hidden');
            this.about.classList.add('content__about_hidden');
        }
        if (classes.contains('menu__item-lots')) {
            this.mylots = "true";
            this.getPage(1);
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
            if (this.inDocForm) this.inDocForm.setDocform({id:"",title:"",text:"",price:"",place:"",imgFileIds:""});
            else this.inDocForm = new Docform({id:"",title:"",text:"",price:"",place:"",imgFileIds:""});
        }
        if (classes.contains('menu__item-about')) {
            this.content.classList.remove('content_hidden');
            this.messages.classList.add('content__messages_hidden');
            this.pages.classList.add('content__pages_hidden');
            this.docform.classList.add('content__docform_hidden');
            this.about.classList.remove('content__about_hidden');
        }
    }

    @bind
    clickPage(e){
        if(e.target.classList.contains("content__page_current")) return;
        if(e.target.classList.contains("content__pages")) return;
        this.getPage(e.target.firstChild.nodeValue);
    }

    @bind
    getPage(number) {
        this.messages.innerHTML = '';
        this.pages.innerHTML = '';
        this.getDocs(number, this.find, this.place, this.mylots);
    }

    @bind
    getDocs(page,find,place,mylots) {
        this.getJson('doc?page='+page+"&find="+find+"&place="+place+"&mylots="+mylots, function(data){
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
                // console.log(res.status, res.data);
            })
        );
    }
}