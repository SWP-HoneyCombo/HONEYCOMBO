import honeycomboAPI from "../apis/honeycomboAPI.js";

async function fn(showResult, productList, result) {
    if (productList.result === 1) {
        console.log(productList.items)
        // TODO : show result in default section
        var article = '';
        for (var i = 0; i < productList.items.length; i++) {
            var imgSrc = productList.items[i].IMGFILENAME;
            article += '<article id="item" class="mx-4 my-5"><img src='+imgSrc+'><li id="itemCompany">'+productList.items[i].COMPANY+'</li><li id="itemName">'+productList.items[i].ITEMNAME+'</li><li id="itemPrice">'+productList.items[i].ITEMPRICE +'원</li><br></article>';
        }
        showResult.innerHTML = '<ul>'+article+'</ul>';
    } else {
        showResult.innerHTML = '<article id="item">해당 상품이 없습니다.</article>';
    }
}

document.querySelector('.showWrap').addEventListener('click', async function (e) {
    let url;
    const target = e.target;
    const showResult = document.querySelector(".defaultResult");
    let productList = undefined;

    const type = target.name;

    switch (type) {
        case "searchButton":
            url = "/product/main/search/" + document.getElementById("itemSearchName").value;
            console.log(url);
            productList = await honeycomboAPI.getProduct(url);
            console.log(productList);
            await fn(showResult, productList, "일치하는 상품 이름 없음");
            break;

        case "GS":
        case "CU":
            var companyName = type
            url = "/product/main/classify/" + companyName
            productList = await honeycomboAPI.getProduct(url);
            console.log(productList);
            await fn(showResult, productList, "회사별 상품 결과 없음");
            break;
        
        case "high":
        case "low":
            var price = type;
            url = "/product/main/sort/" + price;
            productList = await honeycomboAPI.getProduct(url);
            console.log(productList);
            await fn(showResult, productList, "회사별 상품 결과 없음");
            break;
    }
})