import honeycomboAPI from "../apis/honeycomboAPI.js";

document.querySelector('#myCarousel').addEventListener('click', async function (e){
    if(e.target.id == "add"){
        let itemId = "item" + e.target.name;
        let itemInfos = document.querySelectorAll("#" + itemId);
        let title = itemInfos[1].textContent;
        let imgUrl = itemInfos[2].src;

        let currentItemHTML = document.querySelector("#myItemList").innerHTML;
        document.querySelector("#myItemList").innerHTML = currentItemHTML +
            '<div class="card text-align align-self-center mx-2 my-2">\
                <div class="card-body text-center">\
                    <input type="button" name='+itemId+' class="row justify-content-start" style=" background: url(../images/static/delete-button.png) no-repeat; background-size: 78% 78%;" id="delete" onclick="delClick(name)" >\
                    <h6 class="card-title mb-1 mx-auto" id="rcp_product">' + title + '</h6>\
                    <img class="rounded mx-auto d-block" width=110 height=110 src=' + imgUrl + '>\
                </div>\
            </div>';
    }
});

document.querySelector('#write_submit').addEventListener('click', async function (e) {

    var data = {};
    data.title = document.querySelector('#rcp_title').value;
    var tagcontentsAll = document.querySelectorAll('#rcp_product'); //#xxx#xxx;
    data.tagcontents = '';
    for(var i=0;i<tagcontentsAll.length;i++){
        data.tagcontents += '#'+tagcontentsAll[i].textContent;
    }

    try{
        data.difficulty = document.querySelector(".diff.active").id;
        data.imgUrl = document.querySelector('#preview').src;
        data.totaltime = document.querySelector('#rcp_time').value;
        data.videoUrl = document.querySelector('#youtube_url').value;
        data.content1 = document.querySelector('#step1').value;
        data.content2 = document.querySelector('#step2').value;
        data.content3 = document.querySelector('#step3').value;
        data.content4 = document.querySelector('#step4').value;
        data.content5 = document.querySelector('#step5').value;

        if(data.totaltime=="" || data.videoUrl=="" || data.content1=="" || data.title==""){
            alert("빈칸을 채워주세요!")
        }else{
            console.log(data);
            await honeycomboAPI.postUserRecipe(data);
        }
    }catch(e){
        alert("빈칸을 채워주세요!");
    }
});

async function fn(showResult, productList) {
    if (productList.result === 1) {
        var items = productList.items;
        var result = '<div id="myCarousel" class="carousel slide" data-ride="carousel" data-interval="false">\
                        <div class="carousel-inner" role="listbox">\
                            <div class="carousel-item pb-3 active">\
                                <div class="row justify-content-around">';

        var itemsLen = items.length;
        var showNum = 4;
        var iter = Math.ceil(items.length / showNum) - 1;
        var current = 0;
        var end = 0;

        if(showNum>itemsLen){
            end = itemsLen;
        }else{
            end = showNum;
        }

        for(let i=current; i<end; i++, current++){
            var tempId = "item" + String(current);
            var imgSrc = items[i].IMGFILENAME;
            result += 
            '<div class="col-xs '+ i +' mx-2" id='+tempId+'>\
                <div class="card align-self-center">\
                    <div class="card-body text-center">\
                        <h6 id="'+tempId+'" class="card-title">'+items[i].ITEMNAME+'</h6>\
                        <img id="'+tempId+'" class="rounded mx-auto d-block" width=100 height=100 src="'+imgSrc+'">\
                        <input type="button" id="add" class="btn btn-primary mx-auto d-block mt-1" name="'+current+'" value="재료 추가">\
                    </div>\
                </div>\
            </div>';
        }
        result += '</div></div>';

        for(let j=0;j<iter;j++){
            result +=
            '<div class="carousel-item pb-3">\
            <div class="row justify-content-around">';

            if(itemsLen-current >= showNum){
                end = current+showNum;
            }else{
                end=itemsLen;
            }

            for(let i=current; i<end; i++, current++){
                var tempId = "item" + String(current);
                var imgSrc = items[i].IMGFILENAME;
                result +=
                '<div class="col-xs '+ i +' mx-4" id='+tempId+'>\
                    <div class="card">\
                        <div class="card-body text-center">\
                            <h6 id="'+tempId+'" class="card-title">'+items[i].ITEMNAME+'</h6>\
                            <img id="'+tempId+'" class="rounded mx-auto d-block" width=100 height=100 src="'+imgSrc+'">\
                            <input type="button" id="add" class="btn btn-primary mx-auto d-block mt-1" name="'+current+'" value="재료 추가">\
                        </div>\
                    </div>\
                </div>';
            }
            result += '</div></div>';
        }
        result += 
        '<a class="carousel-control-prev" href="#myCarousel" role="button" data-slide="prev">\
            <span class="carousel-control-prev-icon" aria-hidden="true"></span>\
            <span class="sr-only">Previous</span>\
        </a>\
        <a class="carousel-control-next" href="#myCarousel" role="button" data-slide="next">\
            <span class="carousel-control-next-icon" aria-hidden="true"></span>\
            <span class="sr-only">Next</span>\
        </a>'
        
        showResult.innerHTML = result;
    } else {
        alert("상품검색 결과가 없습니다.");
    }
}

document.querySelector('#search').addEventListener('click', async function (e) {
    let url;
    const showResult = document.querySelector("#myCarousel");
    let productList = undefined;

    url = "/recipe/writeRecipe/search/" + document.getElementById("prod_search").value;
    console.log(url);
    productList = await honeycomboAPI.getProduct(url);
    console.log(productList);
    await fn(showResult, productList);
});