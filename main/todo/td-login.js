function signup() {
    window.location.href = "/todo/sign-up";
}

function checkLoggedIn() {
    // how to read cookies:
    let SS = getSS();
    console.log(SS);
    if (SS !== '') {
        // everything after this line is useless code, as we don't know who the user is before submitting the login
        window.location.href = '/todo';
    //     // verify this SS is the same as the one in the db
    //     fetch('login/check-SS', {
    //         method: 'POST', 
    //         body: JSON.stringify({
    //             'SS': SS
    //         }), 
    //         headers: {
    //             'content-type': 'application/json'
    //         }
    //     }).then(
    //         res => res.json()
    //     ).then(
    //         data => {
    //             // remove the cookie if it's expired
    //             if (data['msg'] === 'failure') {
    //                 setSS('');
    //             }

    //             // if session is still valid, redirect to main page
    //             else {
    //                 window.location.href = '/todo';
    //             }
    //         }
    //     )
    }
    return;
}

// NOT ENCRYPTED, DON'T DO THIS!
async function checkValid() {
    let form = document.forms['login'];
    let username = form['user'].value;
    let password = form['pw'].value;
    let bad = new Promise((resolve) => {
        fetch('login/verify-login', {
            method: 'POST', 
            body: JSON.stringify({
                'user': username, 
                'pw': password,
            }), 
            headers: {
                'content-type': 'application/json'
            }
        }).then(
            res => res.json()
        ).then(
            data => {
                console.log(data['SS']);
                if (data['SS'] === 'error') {
                    console.log("INVALID USER/PASS COMBO");
                    resolve(false);
                    return;
                }
                setSS(data['SS']);
                resolve(true);
            }
        )
    });
    let result = await bad;
    if (!result) return;
    form.submit();
}

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
    let bestSoFar = '';
    for (let i=0;i<allCookies.length; i++) {
        let c = allCookies[i];
        // remove whitespace
        if (c.charAt(0) === ' ') {
            c = c.substring(1);
        }
        // if cookie name matches the name we're looking for
        if (c.substring(0,name.length) === name) {
            let currentSS = c.substring(name.length, c.length);
            bestSoFar = currentSS.length > bestSoFar.length ? currentSS : bestSoFar;
        }
    }
    return bestSoFar;
}

var timeout = false;

function toggleSidebar(){
    if (timeout) return;
    let sidebar = document.getElementById("sidebar");
    console.log(sidebar.style.display);
    if (sidebar.style.display == "") {
        sidebar.style.display = "flex";
        toggleOpaque(true);
        console.log(sidebar.style.opacity);
        console.log('hi1');
    }
    else {
        sidebar.style.display = "";
        toggleOpaque(false);
        console.log('hi2');

    }
    timeout = true;
    setTimeout(() => {timeout = false}, 100)
}

function toggleOpaque(dim) {
    let main = document.getElementById("main");
    if (!dim) {
        main.style.opacity = "100%";
        // navbar.style.opacity = "100%";
    }
    else {
        main.style.opacity = "40%";
        // navbar.style.opacity = "40%";
    }
}
