import { bind } from 'decko';

export default class Message {
    constructor({id,date,title,text,place,price,imgFileIds}){
        this.element = document.createElement("div");
        this.main = document.querySelector('body');
        this.element.className = "message";
        this.id = id;
        this.setTitle(title);
        this.setText(text);
        this.setDate(date);
        this.setPlace(place);
        this.setPrice(price);
        this.setImage(imgFileIds);
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
    setPrice(price) {
        var element = document.createElement("div");
        element.className = "message__price";
        element.textContent = price;
        this.element.appendChild(element);
    }

    @bind
    setImage(imgFileIds) {
        if(!imgFileIds) return;

        this.image = document.createElement("div");
        this.image.className = "message__image";
        this.element.appendChild(this.image);

        this.activeImage = document.createElement("img");
        this.activeImage.className = "message__image-active";
        this.image.appendChild(this.activeImage);
        this.activeImage.addEventListener('click', this.openModalImage);

        this.imageRow = document.createElement("div");
        this.imageRow.className = "message__image-row";
        this.image.appendChild(this.imageRow);
        this.imageRow.addEventListener('click', this.setActiveImage);

        for (let i = 0; i < imgFileIds.length; i++) {
            if (imgFileIds[i]!="") {
                this.getImg('image/' + imgFileIds[i], function(data){
                    var image = document.createElement("img");
                    image.className = "message__image-small";
                    if (data != 'data:image/jpeg;base64,') {
                        image.src = data;
                    }
                    else {
                        image.textContent = "no image";
                    }
                    this.imageRow.appendChild(image);
                    if (!this.activeImage.src) this.activeImage.src = data;
                }.bind(this));
            }
        }      
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

    @bind
    setActiveImage(e) {
        if (e.target.classList.contains('message__image-small'))
            this.activeImage.src = e.target.src;
    }

    @bind
    openModalImage() {
        this.shadow = document.createElement("div");
        this.shadow.classList.add('message__shadow');
        this.main.appendChild(this.shadow);
        this.createBigImage();
    }

    @bind
    closeModal() {
        this.main.removeChild(this.shadow);
    }

    @bind
    createBigImage() {
        // this.grid = document.createElement("div");
        // this.grid.classList.add('message__grid');
        // this.shadow.appendChild(this.grid);
        // this.grid.addEventListener('click', function (e) { e.stopPropagation(); });

        this.bigimage = document.createElement("img");
        this.bigimage.classList.add('message__bigimage');
        this.bigimage.src = this.activeImage.src;
        this.shadow.appendChild(this.bigimage);

        this.prev = document.createElement("div");
        this.prev.classList.add('message__prev');
        this.prev.innerText = "<";
        this.shadow.appendChild(this.prev);

        this.next = document.createElement("div");
        this.next.classList.add('message__next');
        this.next.innerText = ">";
        this.shadow.appendChild(this.next);

        this.close = document.createElement("div");
        this.close.classList.add('message__close');
        this.close.innerText = "x";
        this.shadow.appendChild(this.close);
        this.close.addEventListener('click', this.closeModal);

    }
}