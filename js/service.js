var gUsers;

function isLoggedIn() {
    return sessionStorage.loggedIn;
}

function createUsers() {
    gUsers = [
        createUser('user1', 'pass1'),
        createUser('user2', 'pass2'),
        createUser('user3', 'pass3')
    ];
    return gUsers;
}

function createUser(username, password) {
    return {
        username: username,
        password: password,
        type: 'standard',
        lastLoginTime: Date.now()
    };
}

function addUser(username, password) {
    gUsers.push(createUser(username, password));
    saveUsers();
}

function isAdmin(user) {
    return user.type === 'admin';
}

function registerUser(username, password) {
    if (
        confirm(
            `User doesn't excists,\nDo you wanna register with those username & password?`
        )
    ) {
        addUser(username, password);
        return gUsers[gUsers.length - 1];
    } else {
        console.log(`User didn't created.`);
        return;
    }
}

function saveUsers() {
    localStorage.setItem('users', JSON.stringify(gUsers));
}

function saveLoggedUser(user) {
    sessionStorage.setItem('loggedIn', JSON.stringify(user));
}

function getLoggedUser() {
    if (sessionStorage.getItem('loggedIn')) {
        return JSON.parse(sessionStorage.getItem('loggedIn'));
    } else return;
}

function getUsers() {
    if (localStorage.getItem('users')) return JSON.parse(localStorage.users);
    else return;
}

function checkForUsers() {
    if (Array.isArray(getUsers())) gUsers = getUsers();
    else {
        createUsers();
        // create admin
        gUsers.push(createUser('admin', 'admin'));
        gUsers[gUsers.length - 1].type = 'admin';
        saveUsers();
    }
}
