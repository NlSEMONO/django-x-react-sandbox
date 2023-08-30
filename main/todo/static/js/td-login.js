function signup() {
    window.location.href = "/todo/sign-up";
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
                date = new Date();
                date.setTime(date.getTime() + (7 * 24 * 60 * 60 * 1000));
                document.cookie = `SS=${data['SS']};${date};path=/;SameSite=secure`;
                console.log(document.cookie);
                resolve(true);
            }
        )
    });
    let result = await bad;
    if (!result) return;
    form.submit();
}