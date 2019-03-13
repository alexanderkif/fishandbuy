import { bind } from 'decko';

const MAX_IMG_SIZE = 1000000;

export default class Docform {
    constructor({title,text,price,place,imgFileIds}){
        this.title = document.querySelector('.docform__title');
        this.text = document.querySelector('.docform__text');
        this.price = document.querySelector('.docform__price');
        this.place = document.querySelector('.docform__place');
        this.plus = document.querySelector('.docform__plus');
        this.sbmt = document.querySelector('.docform__sbmt');
        this.images = document.querySelector('.docform__images');
        this.title.value = title;
        this.text.innerHTML = text;
        this.price.value = price;
        this.place.value = place;
        this.imgFileIds = imgFileIds;
        this.drawImages(imgFileIds);
        this.images.addEventListener('click', this.clickImage);
        this.sbmt.addEventListener('click', this.clickSbmt);
    }    

    @bind
    clickSbmt() {
        var imgs = this.images.querySelectorAll('.docform__image');

        var count = 0;

        for (let i = 0; i < imgs.length; i++) {
            if (imgs[i].src.split('/')[0]!="image") {
                if (this.imgFileIds[i]) this.deleteFile(this.imgFileIds[i].src.split('/')[1]);
                var fn = function(id) {
                    this.imgFileIds[i] = id;
                    count++;
                }.bind(this);
                this.saveFile(imgs[i].file, fn);
            }
        }

        var timerId = setInterval( function(){
            if (count == imgs.length) {
                this.sendForm(fn);
                clearInterval(timerId);
            }
        }.bind(this), 1000);
    }

    sendForm(fn) {
        var form = new FormData();
        form.append("title", this.title.value);
        form.append("text", this.text.value);
        form.append("price", this.price.value);
        form.append("place", this.place.value);
        form.append("imgFileIds", this.imgFileIds);
        var fn = function (response) {
            alert(response.status);
        }.bind(this);
        fetch("doc", {
            method: "POST",
            body: form
        })
            .then((response) => fn(response));
    }

    @bind
    drawImages() {
        this.imgFileIds.forEach(id => {
            this.drawImg(`image/${id}`, null);
        });
    }

    @bind
    clickImage(e) {
        const replace = e.target.classList.contains('docform__image');
        const plus = e.target.classList.contains('docform__plus');
        if (replace) this.img = e.target;
        if(!replace && !plus) return;
        if(plus && this.images.childElementCount > 5) return;
        var input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';
        input.onchange = e => {
            var file = e.target.files[0];
            if (file.size > MAX_IMG_SIZE) {
                alert('File too big. Load file must be under 1MB.');
                return;
            }

            var reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = readerEvent => {
                var content = readerEvent.target.result;
                if(replace) {
                    this.img.src = content;
                }
                else {
                    this.drawImg(content, file);
                }
            }
        }
        input.click();
    }

    @bind
    saveFile(file, fn) {
        var form = new FormData();
        form.append("file", file);
        fetch("image", {
            method: "POST",
            body: form
        })
        .then(function(response) {
            return response.text()
        })
        .then(function(text) {
            fn(text);
        });
    }

    @bind
    deleteFile(id) {
        fetch(`image/${id}`, {
            method: "DELETE"
        })
        .then(function(response) {
            return response.text().then(function(text) {
                alert(text);
            });
        });
    }

    @bind
    drawImg(content, file) {
        var div = document.createElement('div');
        div.classList.add('docform__image-wrapper');
        var img = document.createElement('img');
        img.classList.add('docform__image');
        img.src = content;
        img.file = file;
        this.addMinus(div);
        div.appendChild(img);
        this.images.insertBefore(div, this.plus);
    }

    @bind
    addMinus(div) {
        var minus = document.createElement('img');
        minus.classList.add('docform__minus');
        minus.src = "img/minus.png";
        div.appendChild(minus);
        minus.addEventListener('click', this.removeImg);
    }

    @bind
    removeImg(e) {
        this.images.removeChild(e.target.parentElement);
    }
}