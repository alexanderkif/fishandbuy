import { bind } from 'decko';
import EventObserver from '../eventobserver/EventObserver';

export default class Message {
    constructor({id,date,title,text,place,price,imgFileIds,email}){
        this.element = document.createElement("div");
        this.main = document.querySelector('body');
        this.element.className = "message";
        this.email = email;
        this.imgFileIds = imgFileIds;
        this.setId(id);
        this.setTitle(title);
        this.setText(text);
        this.setDate(date);
        this.setPlace(place);
        this.setPrice(price);
        this.setImage(imgFileIds);
        this.setPhone();
        this.setEdit();
        return this.element;
    }

    @bind
    setEdit() {
        if (this.email == document.user) {
            this.edit = document.createElement("div");
            this.edit.className = "message__edit";
            this.edit.innerHTML = '<i class="material-icons">edit</i>';
            this.title.appendChild(this.edit);
            this.edit.addEventListener('click', this.editMessage);
            this.delete = document.createElement("div");
            this.delete.className = "message__delete";
            this.delete.innerHTML = '<i class="material-icons">delete</i>';
            this.title.appendChild(this.delete);
            this.delete.addEventListener('click', this.deleteMessage);
        }
    }

    @bind
    editMessage() {
        this.element.dispatchEvent(new Event("editMessage", {bubbles: true, cancelable: true}));
    }

    @bind
    deleteMessage() {
        if (confirm('Are you sure you want to delete this document?')) {
            for (let i = 0; i < this.imgFileIds.length; i++) {
                this.deleteFile(this.imgFileIds[i]);
            }
            fetch(`doc/${this.id.innerText}`, {
                method: "DELETE"
            })
            .then(function(response) {
                return response.text().then(function(text) {
                    console.log(text);
                });
            });
            this.element.dispatchEvent(new Event('goHome', {bubbles: true, cancelable: true}));
        } else {
            // console.log('no');
        }
    }

    @bind
    deleteFile(id) {
        fetch(`image/${id}`, {
            method: "DELETE"
        })
        .then(function(response) {
            return response.text().then(function(text) {
                console.log(text);
            });
        });
    }

    @bind
    setId(id) {
        this.id = document.createElement("div");
        this.id.className = "message__id";
        this.id.textContent = id;
        this.element.appendChild(this.id);
    }

    @bind
    setPhone() {
        this.phone = document.createElement("div");
        this.phone.className = "message__phone";
        this.phone.textContent = "Click here to get phone number";
        this.element.appendChild(this.phone);
        this.phone.addEventListener('click', this.getPhone);
    }

    @bind
    getPhone() {
        fetch(`account/${this.email.replace(".", "((at))")}`, { method: "GET" })
        .then(function(response) {
            if (response.status==404) {
                return {phone: "Only users can see the phone number."};
            }
            return response.json();
        })
        .then(data => {
            this.phone.textContent = data.phone;
        });
    }

    @bind
    setTitle(title) {
        this.title = document.createElement("div");
        this.title.className = "message__title";
        this.title.textContent = title;
        this.element.appendChild(this.title);
    }

    @bind
    setText(text) {
        var element = document.createElement("div");
        element.className = "message__text";
        element.innerText = text;
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

        this.activeImageWrapper = document.createElement("div");
        this.activeImageWrapper.className = "message__image-active-wrapper";
        this.image.appendChild(this.activeImageWrapper);
        // this.activeImage.addEventListener('click', this.openModalImage);

        this.activeImage = document.createElement("img");
        this.activeImage.className = "message__image-active";
        this.activeImageWrapper.appendChild(this.activeImage);
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
        this.smalls = this.imageRow.querySelectorAll(".message__image-small");

        this.bigimage = document.createElement("img");
        this.bigimage.classList.add('message__bigimage');
        this.bigimage.src = this.activeImage.src;
        this.shadow.appendChild(this.bigimage);
        this.bigimage.addEventListener('click', this.showNext);

        this.prev = document.createElement("div");
        this.prev.classList.add('message__prev');
        this.prev.innerHTML = '<i class="material-icons">skip_previous</i>';
        this.shadow.appendChild(this.prev);
        this.prev.addEventListener('click', this.showPrev);

        this.next = document.createElement("div");
        this.next.classList.add('message__next');
        this.next.innerHTML = '<i class="material-icons">skip_next</i>';
        this.shadow.appendChild(this.next);
        this.next.addEventListener('click', this.showNext);

        this.close = document.createElement("div");
        this.close.classList.add('message__close');
        this.close.innerHTML = '<i class="material-icons">close</i>';
        this.shadow.appendChild(this.close);
        this.close.addEventListener('click', this.closeModal);
    }

    @bind
    showPrev() {
        for (var i = 0; i < this.smalls.length; i++) {
            if (this.smalls[i].src == this.bigimage.src) {
                var smallTmp;
                if (i == 0) smallTmp = this.smalls[this.smalls.length-1];
                else smallTmp = this.smalls[i-1];
                this.bigimage.src = smallTmp.src;
                return;
            }
        }
    }

    @bind
    showNext() {
        for (var i = this.smalls.length-1; i > -1; i--) {
            if (this.smalls[i].src == this.bigimage.src) {
                var smallTmp;
                if (i == this.smalls.length-1) smallTmp = this.smalls[0];
                else smallTmp = this.smalls[i+1];
                this.bigimage.src = smallTmp.src;
                return;
            }
        }
    }
}