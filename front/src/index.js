import { bind } from 'decko';
import "@babel/polyfill";
import "./scss/main.scss";

class CV {
  constructor(){
    this.s1 = document.querySelector('.sss1');
    this.s1.addEventListener('click', this.cclick);
    this.s2 = document.querySelector('.sss2');
    this.s2.addEventListener('click', this.ccclick);
  }

  @bind
  cclick() {
    this.getJson('http://localhost:8080/doc/5aa38122941b260001cd3314', function(data){
      this.s1.textContent = JSON.stringify(data);
    }.bind(this));
  }

  @bind
  ccclick() {
    this.getJson('http://localhost:8080/doc', function(data){
      this.s2.textContent = JSON.stringify(data);
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

var cv = new CV();

