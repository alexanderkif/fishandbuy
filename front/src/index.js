import { bind } from 'decko';
import "@babel/polyfill";
import "./scss/main.scss";
import Content from './content/Content';
import Menu from './menu/Menu';
// import "./login/Login";
import "./img/logo.jpg";

class CV {
  constructor(){
    this.content = new Content();
    this.menu = new Menu();
  }
}

var cv = new CV();

