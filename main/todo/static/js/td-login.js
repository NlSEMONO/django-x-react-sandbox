import {getSS, setSS} from '/static/js/ss.js' 

function signup() {
    window.location.href = "/todo/sign-up";
}

async function checkLoggedIn() {
    // how to read cookies:
    let SS = getSS();
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