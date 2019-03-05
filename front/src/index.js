import { bind } from 'decko';
import "@babel/polyfill";
import "./scss/main.scss";
// import "./content/content";
import Content from './content/Content';
import "./login/login";
import "./img/logo.jpg";

class CV {
  constructor(){
    this.content = new Content();
  }
}

var cv = new CV();

