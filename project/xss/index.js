document.querySelector('#app-1 .content img').style.filter = 'blur(5px)';

// alert(document.cookie);

function setCookie(name, value) {
    var Days = 30;
    var exp = new Date();
    exp.setTime(exp.getTime() + Days * 24 * 60 * 60 * 30);
    document.cookie = name + '=' + escape(value) + ';expires=' + exp.toGMTString();
}

setCookie('unionID', '123456');
