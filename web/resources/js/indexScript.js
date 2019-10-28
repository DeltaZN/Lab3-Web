window.onload = function () {
    updateClock();
};

function updateClock() {
    let now = new Date();
    let timeString = [now.getHours(), now.getMinutes(), now.getSeconds()].join(':');
    let dateString = [now.getDate(), now.getMonth() + 1, now.getFullYear()].join('.');
    document.getElementById('clock').innerHTML = [dateString, timeString].join(' | ');
    setTimeout(updateClock, 12000);
}
