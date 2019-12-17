//<!--댓글 수정 및 등록을 위한 스크립트-->
import honeycomboAPI from "../apis/honeycomboAPI.js";

async function fn(comment, title, state="dd"){
    if (comment.result === 1) {
        console.log(comment)
        // TODO : redirect to rendering new comment
        // eachComment.innerHTML = writeComment.userId + '\t' + writeComment.contents + '\t' + writeComment.rate;
        if(state=="delete"){
            console.log("dd???")
            alert(comment.successMsg);
        }
        window.location.href = '/recipe/detailRecipe/viewDetail/' + title + '/'
    } else {
        alert(comment.errMsg)
        window.location.href = '/recipe/detailRecipe/viewDetail/' + title + '/'
    }
}

document.querySelector('.commetList').addEventListener('click', async function (e) {
    let url, method, data;
    const target = e.target;
    const type = target.name;
    const title = document.querySelector(".recipeInfo").id;
    let result = undefined;

    // if (target.tagName !== "BUTTON") return;

    switch (type) {
        case "writeComment":
            // all elements select in form tag by name - maxPrice, minPrice
            let inputs = [].slice.call(document.querySelector("form").elements);
            data = inputs.reduce(function (pre, next) {
                console.log(next.checked)
                var name = next.name
                if((name === "usersRate" && next.checked) || name != "usersRate") {
                    pre[name] = next.value
                }
                return pre;
            }, {});
            console.log(data)
            // data.recipeTitle = title;

            result = await honeycomboAPI.postComment(data);
            await fn(result, title, "dd");
            break;
        case "deleteComment":
            result = await honeycomboAPI.deleteComment(title);
            await fn(result, title, "delete");
            break;
        case "modifyComment":
            let comment, rate;
            // comment, rate 받아오는 부분...
            result = await honeycomboAPI.putComment(title, comment, rate);
    }
});
