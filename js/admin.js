var gUsersList;
function adminInit() {
    if (
        sessionStorage.getItem('loggedIn') &&
        JSON.parse(sessionStorage.getItem('loggedIn')).type === 'admin'
    ) {
        console.log('opened admin section');
        renderUsers();
        document.querySelector('body').style.visibility = 'visible';
    } else {
        console.log('return to index.html');
        window.location.href = 'index.html';
    }

    console.log('adminInit done');
}

function checkUsers() {
    if (Array.isArray(getUsers())) {
        var gUsersList = getUsers();
        var users = gUsersList;
    } else {
        var users = createUsers();
        gUsersList = users;
        // create admin
        users.push(createUser('admin', 'admin'));
        users[gUsers.length - 1].type = 'admin';
        saveUsers();
    }
    return users;
}

function renderUsers(users) {
    var users = (users)? users : checkUsers();
    var strHtmls = users.map(function(user) {
        return `<tr class="userTr">
                    <td class="user-username">
                    ${user.username}
                    </td>
                    <td class="user-password">
                        ${user.password}
                    </td>
                    <td class="user-type">
                        ${user.type}
                    </td>
                    <td class="user-lastlogin">
                        ${getFormattedDate(user.lastLoginTime)}
                    </td>
                </tr>
                `;
    });
    document.querySelector('.users-table').innerHTML = strHtmls.join('');
    document.querySelector('.table-view').style.display = 'table';
    document.querySelector('.cards-view').style.display = 'none';
}

function sortUsersBy(sortby) {
    var users = (users)? users : checkUsers();
    users.sort(function(a, b) {
        return a[sortby] > b[sortby] ? 1 : b[sortby] > a[sortby] ? -1 : 0;
    });
    if (sortby === 'login') users.reverse();
    viewUsersBy(undefined, users);
}

function getFormattedDate(timestamp) {
    var d = new Date(timestamp);
    return (
        ('00' + (d.getMonth() + 1)).slice(-2) +
        '/' +
        ('00' + d.getDate()).slice(-2) +
        '/' +
        d.getFullYear() +
        ' ' +
        ('00' + d.getHours()).slice(-2) +
        ':' +
        ('00' + d.getMinutes()).slice(-2) +
        ':' +
        ('00' + d.getSeconds()).slice(-2)
    );
}

function viewUsersBy(view, users) {
    if (!view)
        var view = document.querySelector('.btns-change-view.pressed').value;
    switch (view) {
        case 'table':
            renderUsers(users);
            break;
        case 'cards':
            renderCards(users);
            break;
    }
}

function renderCards(users) {
    var users = (users)? users : checkUsers();
    var strHtmls = users.map(function(user) {
        return `<div class="users-cards">
                    <br/>
                    <div class="user-username">
                        Username: ${user.username}
                    </div>
                    <div class="user-password">
                        Password: ${user.password}
                    </div>
                    <div class="user-lastlogin">
                        Last Login: ${getFormattedDate(user.lastLoginTime)}
                    </div>
                    <hr/>
                    <div class="user-type">
                        Account Type: ${user.type}
                    </div>
                </div>
                `;
    });
    document.querySelector('.cards-view').innerHTML = strHtmls.join('');
    document.querySelector('.cards-view').style.display = 'unset';
    document.querySelector('.table-view').style.display = 'none';
}

function viewBtnsPressed(elBtn) {
    if (elBtn.classList.contains('pressed')) return;
    elBtn.classList.add('pressed');
    var elSecondOptionBtn = document.querySelector(
        `#btn-to-${elBtn.id === 'btn-to-cards-view' ? 'table' : 'cards'}-view`
    );
    if (elSecondOptionBtn.classList.contains('pressed'))
        elSecondOptionBtn.classList.remove('pressed');
}
