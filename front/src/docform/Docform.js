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
    async clickSbmt() {
        var newImages = [];
        var imgs = this.images.querySelectorAll('.docform__image');
        [].forEach.call(imgs, img => { if(img.src.split('/')[0]=="img") newImages.push(img.src)});

        var form = new FormData();
        form.append("title", this.title.value);
        form.append("text", this.text.innerHTML);
        form.append("price", this.price.value);
        form.append("place", this.place.value);
        form.append("imgFileIds", this.imgFileIds);
        form.append("images", newImages);
        var fn = function(response) { 
            // this.checkUser(); 
            alert(response.status);
        }.bind(this);
        fetch("doc", {
            method: "POST",
            body: form
        })
            .then( (response) => fn(response) );


        // await fetch('doc', { method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify({ 
        //         "title": this.title.value, 
        //         "text": this.text.innerHTML, 
        //         "price": this.price.value,
        //         "place": this.place.value,
        //         "imgFileIds": this.imgFileIds,
        //         "images": newImages
        //     })
        // })
        // .then(function (response) {
        //     alert(response.status);
        // });
        // this.main.removeChild(this.shadow);
    }

    @bind
    drawImages() {
        this.imgFileIds.forEach(id => {
            this.createImg(`img/${id}`);
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
            var reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = readerEvent => {
                var content = readerEvent.target.result;
                if (file.size > MAX_IMG_SIZE) {
                    alert('File too big. Load file must be under 1MB.');
                    return;
                }
                if(replace) {
                    this.img.src = content;
                }
                else {
                    this.createImg(content);
                }
            }
        }
        input.click();
    }

    @bind
    createImg(content) {
        var div = document.createElement('div');
        div.classList.add('docform__image-wrapper');
        var img = document.createElement('img');
        img.classList.add('docform__image');
        img.src = content;
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