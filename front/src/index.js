import { bind } from 'decko';
import "@babel/polyfill";
import "./scss/main.scss";
import Menu from './menu/Menu';
import "./img/logo.jpg";
import "./favicon.ico";
import "./img/plus.png";
import "./img/minus.png";

class CV {
  constructor(){
    this.menu = new Menu();
  }
}

var cv = new CV();

