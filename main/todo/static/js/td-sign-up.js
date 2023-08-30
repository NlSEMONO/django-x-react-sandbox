// NOT ENCRYPTED, DON'T DO THIS!
async function checkValid() {
    let form = document.forms['signup'];
    let username = form['user'].value;
    let password = form['pw'].value;
    let bad = new Promise((resolve) => {
        fetch('login/verify-signup', {
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
                    console.log("USERNAME IS TAKEN");
                    resolve(false);
                }
                document.cookie += `;SS: ${data['SS']};`;
                console.log(document.cookie);
                resolve(true);
            }
        )
    });
    let result = await bad;
    if (!result) return;
    form.submit();
}