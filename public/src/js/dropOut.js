import honeycomboAPI from "../apis/honeycomboAPI.js";

async function fn(checkResult){
    if (checkResult.result === 0) {
        console.log(checkResult)
        alert(checkResult.errMsg)
        document.location.href = "/auth/dropout"
    } else {
        alert(checkResult.successMsg)
        document.location.href = "/";
    }
}

document.querySelector('.dropoutBtn').addEventListener('click', async function (e) {
    let inputs = [].slice.call(document.querySelector("form").elements);
    let data = inputs.reduce(function (pre, next) {
        pre[next.name] = next.value;
        return pre;
    }, {});
    console.log("data = " + data)

    let result = await honeycomboAPI.dropoutUser(data);
    await fn(result);
});