$(document).ready(function () {
    
    var allPictures = $('img') 
    var head = $('.head');
    var info = $('.info');
    var saznajVise = $('.saznajVise');
    var  sBtn = $('#search_btn')
    var input = $('input')
    var searchView = $('#searchView')

    // Klikom na dugme "SEARCH" slanje trazenog podatka u server.js preko AJAX-a
    //  i prikazivanje vracenih podataka na stranici

    function search() {
        
        sBtn.on('click',() => {
            var inputVal = input.val()
            let xml = new XMLHttpRequest()
            xml.open('post','/search')
            xml.onreadystatechange = () => {
                if(xml.readyState == 4 && xml.status == 200){
                    displaySearch(xml.responseText)
                    
                    
                }
            }
            xml.setRequestHeader('Content-Type',"application/json")
            xml.send(JSON.stringify({search : inputVal}))
            
        })
    
        function displaySearch(data) {
            searchView.html('')
            var podatak = JSON.parse(data)
            if (podatak.length != 0) {
                $('.homeView').css({"display":"none"})
                
            }else{
                $('.alert').css({"display":"block"})
            }
            
            text = "";
            for(i=0; i<podatak.length; i++){
            text += 
            `<div class="col-4 mb-2 text-center">
                    <img img-id="${ podatak[i].id}" src=" ${podatak[i].img_roman}" alt=""><br>
                    <button type="button" btn_id="${podatak[i].id}" class="btn btn-danger btn-sm saznajVise"
                        data-toggle="modal" data-target="#myModal">Saznaj
                        Vise</button>
                </div>`
             } 
            searchView.append(text);
    
            let sveSlike = $('img');
            let sviDugmici = $('.saznajVise');
            
             animate(sveSlike)
             modal(sviDugmici)              
        }
    }
    search()

    
    // MODAL = klikom da dugme "Saznaj Vise" slanje atributa dugmeta u server.js
    // i prikazivanje vracenih podataka na stranici
    

    function modal(sviDugmici) {
        if (sviDugmici) {
            saznajVise = sviDugmici
        }

        saznajVise.on('click',function () {
            $('.modal-body').html('')
            let data = new Promise((resolve,reject)=>{
                const xml = new XMLHttpRequest()
                xml.open('post','/modal')
                xml.onreadystatechange = () => {
                if (xml.readyState == 4 && xml.status == 200) {
                    resolve(xml.responseText)
                    
                }
            }
            xml.setRequestHeader("Content-Type","application/json")
            xml.send(JSON.stringify({id : this.getAttribute('btn_id')}))
    
            })
            data.then((data) => {
                var podatak = JSON.parse(data)
                $('.modal-content').html('')
    
                $('.modal-content').append(`
                <div class="modal-header">
                <h2 class="modal-title">${podatak.naslov}</h2>
            </div>
            <div class="modal-body">
                <div class="row">
                    <div class="col-6 text-center">
                        <img class="modal-img" src="${podatak.img_roman}" alt="">
                    </div>
                    <div class="col-6 text-center">
                        <img class="modal-img" src="${podatak.img_pisac}" alt="">
                    </div>
                </div>
                <div class="row text-center">
                <div class="col-10 offset-1 text-center">
                    <h3>Podaci o piscu </h3>
                    </div>
                    
                </div>
                <div class="row">
                    <p class="modal-text">${podatak.opisac}</p>
                </div>
                <div class="row">
                                        <div class="col-10 offset-1 text-center">
                                            <h3>O Romanu</h3>
                                        </div>  
                                    </div>
                                    <div class="row">
                                        <p class="modal-text">${podatak.oroman}</p>
                                    </div>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
            </div>
                `)   
            })
           
        })
        
    }
    modal()
 
// Animacija slike klikom na nju

function animate(sveSlike) {

    if(sveSlike){
        allPictures = sveSlike   
    }
 
    allPictures.on('click',function () {
       
        info.html('')
        var copy = $(this).clone();
        
        copy.css({
            position : "absolute",
            width : $(this).width(),
            height : $(this).height(),
            top : $(this).offset().top,
            left : $(this).offset().left
        })
        
        copy.animate({
            top : head.offset().top,
            left : head.offset().left,
            width : head.width(),
            height : head.height()


        },2000)
        info.append(copy);

         // Slanje ID slike u server.js putem AJAX-a

        let data = new Promise((resolve,reject)=>{
            
            const xml = new XMLHttpRequest()
            xml.open('post','/get_id')
            xml.onreadystatechange = () => {
            if (xml.readyState == 4 && xml.status == 200) {
                resolve(JSON.parse(xml.responseText))
                
            }
        }
        xml.setRequestHeader("Content-Type","application/json")
        xml.send(JSON.stringify({id : this.getAttribute('img-id')}))

        })
        
        data.then((data) => {
            info.append(`<h3>${data[0].naslov}</h3>`)
            info.append(data[0].oroman)
        }
        )
        
    })
    
}

 animate();



    

    
});