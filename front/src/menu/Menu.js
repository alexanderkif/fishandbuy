import { bind } from 'decko';
import Login from '../login/Login';
import Content from '../content/Content';
import Search from '../search/Search';

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
                    document.user = "nouser";
                }
                else {
                    this.add.classList.remove('menu__item_hidden');
                    this.lots.classList.remove('menu__item_hidden');
                    document.user = data.user;
                }
                this.goHome();
            }.bind(this));
        };
        var searchElement = document.querySelector('.search');
        if (searchElement) {
            this.search = new Search(searchElement);
        }
        this.content = new Content();
        this.items = document.querySelectorAll('.menu__item, .menu__wrapper');
        [].forEach.call(this.items, (item) => item.addEventListener('click', this.content.changeContent));
        document.addEventListener('goHome', this.goHome);
    }

    @bind
    goHome() {
        this.home.click();
    }
}