import honeycomboAPI from "../apis/honeycomboAPI.js";

document.querySelector('.loginBtn').addEventListener('click', async function (e) {
    e.preventDefault();
    var ID = document.getElementsByName('ID')[0].value
    var PW = document.getElementsByName('PW')[0].value;
    let result = await honeycomboAPI.postLogin({'ID': ID, 'PW': PW});

    var resultDiv = document.querySelector(".logResult");
    if (result.ID) {
        //resultDiv.innerHTML = "welcome, " + result.email + "!!";
        window.location.href = "/product/main";
    } else {
        // alert(result);
        resultDiv.innerHTML = result;
    }
});