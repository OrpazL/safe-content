function init() {
    checkForUsers();

    if (isLoggedIn()) {
        var loggedUser = getLoggedUser();
        doLogin(loggedUser, loggedUser.password);
    }
}

function invalidUserOrPass(username, password) {
    if (username.trim() === '') {
        var elUsername = document.querySelector('input#username');
        elUsername.classList.add('invalid');
    }
    if (password.trim() === '') {
        var elPassword = document.querySelector('input#password');
        elPassword.classList.add('invalid');
    }
}

function clearInvalid(id) {
    var element = document.querySelector(`.login-sidebar #${id}`);
    if (element.classList.contains('invalid'))
        element.classList.remove('invalid');
    else return;
}

function enterLoginSidebar() {
    var elLoginSidebar = document.querySelector('.login-sidebar');
    elLoginSidebar.classList.toggle('open');
}

function showPasswordToggle(isActive) {
    var elPasswordInput = document.querySelector('#password');
    if (isActive) {
        elPasswordInput.type = 'text';
    } else {
        elPasswordInput.type = 'password';
    }
}

function submitLogin() {
    var elUsername = document.querySelector('input#username');
    var elPassword = document.querySelector('input#password');
    var username = elUsername.value;
    var password = elPassword.value;
    // console.log('user:',elUsername,'pass:',elPassword);

    var user = getUsers().find(function(user) {
        return user.username == username;
    });
    doLogin(user, password);
}

function doLogin(user, password) {
    var elUsername = document.querySelector('input#username');
    var elPassword = document.querySelector('input#password');
    if (user) {
        if (user.password === password) {
            console.log('logged in successfully!');
            elUsername.value = '';
            elPassword.value = '';
            saveLoggedUser(user);
            user.lastLoginTime = Date.now();
            loggedIn(user);
            if (isAdmin(user)) {
                // document.querySelector('.admin-link').style.display = 'unset';
                openAdminFrame();
            } else {
                // document.querySelector('.admin-link').style.display = 'none';
                closeAdminFrame();
            }
        } else console.log('Wrong Username or Password!');
    } else {
        console.log("User doesn't excists!");
        if (elUsername.value.trim() === '' || elPassword.value.trim() === '') {
            invalidUserOrPass(elUsername.value, elPassword.value);
            return;
        } else {
            doLogin(
                registerUser(elUsername.value, elPassword.value),
                elPassword.value
            );
        }
        elUsername.value = '';
        elPassword.value = '';
    }
}

function openAdminFrame() {
    var elAdminDiv = document.querySelector('.admin-frame');
    elAdminDiv.innerHTML = `<iframe src="admin.html" class="admin-link"></iframe>`;
}

function closeAdminFrame() {
    var elAdminDiv = document.querySelector('.admin-frame');
    elAdminDiv.innerHTML = '';
}

function loggedIn(user) {
    var elHeader = document.querySelector('header');
    elHeader.querySelector('span').innerHTML += `Hello, ${user.username}`;

    var elLoginSidebarBtn = document.querySelector('.btn-login');
    elLoginSidebarBtn.style.visibility = 'hidden';

    var elLogoutSidebarBtn = document.querySelector('.btn-logout');
    elLogoutSidebarBtn.style.display = 'unset';

    if (document.querySelector('.login-sidebar').classList.contains('open')) {
        enterLoginSidebar();
    }
}

function doLogout() {
    // clear session storage
    sessionStorage.removeItem('loggedIn');

    // hide logout btn
    var elLogoutSidebarBtn = document.querySelector('.btn-logout');
    elLogoutSidebarBtn.style.display = 'none';

    // clear header span
    var elHeader = document.querySelector('header');
    elHeader.querySelector('span').innerHTML = '';
    // elHeader.querySelector('span').style.display = 'none';

    //view login btn
    var elLoginSidebarBtn = document.querySelector('.btn-login');
    elLoginSidebarBtn.style.visibility = 'visible';

    // hide admin-link
    // document.querySelector('.admin-link').style.display = 'none';
    closeAdminFrame();
}
