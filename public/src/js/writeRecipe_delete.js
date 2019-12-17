function delClick(name){
    let delButton = document.querySelector('input[name='+name+']');
    let allPath = delButton.parentNode.parentNode;
    allPath.remove();
}