if (localStorage.getItem('login') == 'true') {
if (new Date().getTime() > parseInt(localStorage.getItem('lastLogin'))+(60*60*24*30)) {
localStorage.setItem('login', 'false')
localStorage.setItem('lastLogin', Date.now())
}
}