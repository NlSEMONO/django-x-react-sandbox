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
