import { bind } from 'decko';
// import Message from '../message/Message'

export default class Menu {
    constructor(){
        // this.messages = document.querySelector('.content__messages');
        // this.pages = document.querySelector('.content__pages');        
        // this.getDocs(1);
        // this.pages.addEventListener('click', this.clickPage);
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