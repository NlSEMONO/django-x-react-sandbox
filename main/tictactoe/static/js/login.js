function checkLoggedIn() {
    if (!(localStorage.getItem('username') === '')) fetch('');
}

function playGuest() {
    let submit = document.forms['loginForm']['submit'];
    document.forms['loginForm']['username'].value = 'Guest';
    submit.click();
}

function login() {
    let username = document.forms['loginForm']['username'].value;
    if (username === '') return;
    else {
        localStorage.setItem('username', username);
        console.log(window.location);
    }
}