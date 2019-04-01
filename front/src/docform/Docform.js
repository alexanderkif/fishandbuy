import { bind } from 'decko';

const MAX_IMG_SIZE = 1000000;
const MAX_IMAGES = 5;

export default class Docform {
    constructor({id,title,text,price,place,imgFileIds}){
        this.title = document.querySelector('.docform__title');
        this.text = document.querySelector('.docform__text');
        this.price = document.querySelector('.docform__price');
        this.place = document.querySelector('.docform__place');
        this.sbmt = document.querySelector('.docform__sbmt');
        this.images = document.querySelector('.docform__images');
        this.id = id;
        this.title.value = title;
        this.text.value = text;
        this.price.value = price;
        this.place.value = place;
        this.imgFileIds = imgFileIds;
        if (this.imgFileIds=="") this.imgFileIds = [];
        this.images.innerHTML = "";
        this.addPlus(this.images);
        this.drawImages(imgFileIds);
        this.images.addEventListener('click', this.clickImage);
        this.sbmt.addEventListener('click', this.clickSbmt);
        return this;
    }

    @bind
    setDocform({id,title,text,price,place,imgFileIds}) {
        this.id = id;
        this.title.value = title;
        this.text.value = text;
        this.price.value = price;
        this.place.value = place;
        this.imgFileIds = imgFileIds;
        if (this.imgFileIds=="") this.imgFileIds = [];
        this.images.innerHTML = "";
        this.addPlus(this.images);
        this.drawImages(imgFileIds);
    }

    getIdFromSrc(img) {
        let arr = img.src.split('/');
        return arr[arr.length-1];
    }

    @bind
    clickSbmt() {
        var imgs = this.images.querySelectorAll('.docform__image');

        var count = 0;

        //delete from minus
        if (this.images.idToDelete) {
            this.images.idToDelete.forEach(id => {
                this.deleteFile(id);
                this.imgFileIds.splice(this.imgFileIds.indexOf(id),1);
            });
            delete this.images.idToDelete;
            // count--;
        }

        for (let i = 0; i < imgs.length; i++) {
            //delete when replace
            if (imgs[i].idToDelete) {
                this.deleteFile(imgs[i].idToDelete);
                delete imgs[i].idToDelete;
            }

            //save new images files
            if (!this.imgFileIds.includes(this.getIdFromSrc(imgs[i]))) {
                var fn = function(text) {
                    if (text!="noimage") {
                        this.imgFileIds[i] = text;
                    }
                    count++;
                }.bind(this);
                count--;
                this.saveFile(imgs[i].file, fn);
            }
        }

        var timerId = setInterval( function(){
            if (count == 0) {
                clearInterval(timerId);
                this.sendForm(fn);
            }
        }.bind(this), 1000);
    }

    @bind
    sendForm() {
        var fn = function (text) {
            this.sbmt.dispatchEvent(new Event('goHome', {bubbles: true, cancelable: true}));
            alert(text);
        }.bind(this);
        
        var form = new FormData();
        form.append("id", this.id);
        form.append("title", this.title.value);
        form.append("text", this.text.value);
        form.append("price", this.price.value);
        form.append("place", this.place.value);
        form.append("imgFileIds", this.imgFileIds);
        
        fetch("doc", {
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
        if(plus && this.images.childElementCount > MAX_IMAGES) return;
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
                    if (!this.img.idToDelete) this.img.idToDelete = this.getIdFromSrc(this.img);
                    this.img.src = content;
                    this.img.file = file;
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
            if (response.status=="200")
                return  response.text();
            else return "noimage";
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
                // console.log(text);
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
        if (this.images.childElementCount > MAX_IMAGES) this.plus.style.display = "none";
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
    addPlus(div) {
        this.plus = document.createElement('img');
        this.plus.classList.add('docform__plus');
        this.plus.src = "img/plus.png";
        div.appendChild(this.plus);
    }

    @bind
    removeImg(e) {
        if (!this.images.idToDelete) this.images.idToDelete = [];
        if (e.target.parentElement.idToDelete) {
            this.images.idToDelete.push(this.getIdFromSrc(e.target.parentElement.idToDelete));
        }
        else {
            this.images.idToDelete.push(this.getIdFromSrc(e.target.parentElement.children[1]));
        }
        this.images.removeChild(e.target.parentElement);
        this.plus.style.display = "block";
    }
}