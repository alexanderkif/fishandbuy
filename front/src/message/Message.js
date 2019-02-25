import { bind } from 'decko';

export default class Message {
    constructor({id,date,title,text,place,email,imageFileId}){
        this.element = document.createElement("div");
        this.element.className = "message";
        this.id = id;
        this.setTitle(title);
        this.setText(text);
        this.setDate(date);
        this.setPlace(place);
        this.setEmail(email);
        this.setImage(imageFileId);

        return this.element;
    }

    @bind
    setTitle(title) {
        var element = document.createElement("div");
        element.className = "message__title";
        element.textContent = title;
        this.element.appendChild(element);
    }

    @bind
    setText(text) {
        var element = document.createElement("div");
        element.className = "message__text";
        element.textContent = text;
        this.element.appendChild(element);
    }

    @bind
    setDate(date) {
        var element = document.createElement("div");
        element.className = "message__date";
        var d = new Date(date);
        var dateString = ("0" + d.getUTCDate()).slice(-2) +"."+ ("0" + (d.getUTCMonth()+1)).slice(-2) +"."+ d.getUTCFullYear();
        element.textContent = dateString;
        this.element.appendChild(element);
    }

    @bind
    setPlace(place) {
        var element = document.createElement("div");
        element.className = "message__place";
        element.textContent = place;
        this.element.appendChild(element);
    }

    @bind
    setEmail(email) {
        var element = document.createElement("div");
        element.className = "message__email";
        element.textContent = email;
        this.element.appendChild(element);
    }

    @bind
    setImage(imageFileId) {
        // this.imgWrapper = document.createElement("div");
        // this.imgWrapper.className = "message__image-wrapper";
        // this.element.appendChild(this.imgWrapper);

        this.getImg('doc/img/' + imageFileId, function(data){
            if (data != 'data:image/jpeg;base64,') {
                var image = document.createElement("img");
                image.className = "message__image";
                image.src = data;
                this.element.appendChild(image);
            }
            else {
                var image = document.createElement("div");
                image.className = "message__image";
                image.textContent = "no image";
                this.element.appendChild(image);
            }
        }.bind(this));
    }

    async getImg(url, fn) {
        await fetch(url)
        .then(response => {
            response.arrayBuffer().then((buffer) => {
                var base64Flag = 'data:image/jpeg;base64,';
                var imageStr = this.arrayBufferToBase64(buffer);
                fn(base64Flag + imageStr);
            });
        });
    }
    
    arrayBufferToBase64(buffer) {
        var binary = '';
        var bytes = [].slice.call(new Uint8Array(buffer));
        bytes.forEach((b) => binary += String.fromCharCode(b));
        return window.btoa(binary);
    };
}