function setSS(newValue, expired=false) {
    let date = new Date();
    date.setTime(date.getTime() + (expired ? (7 * 24 * 60 * 60 * 1000 * -1) : (7 * 24 * 60 * 60 * 1000))); 
    document.cookie = `SS=${newValue};${date};path=/;SameSite=secure`;
    console.log(document.cookie);
}

function getSS() {
    let name = 'SS='; 
    console.log(document.cookie);
    let allCookies = document.cookie.split(';');
    for (let i=0;i<allCookies.length; i++) {
        let c = allCookies[i];
        // remove whitespace
        if (c.charAt(0) === ' ') {
            c = c.substring(1);
        }
        // if cookie name matches the name we're looking for
        if (c.substring(0,name.length) === name) return c.substring(name.length, c.length);
    }
    return '';
}