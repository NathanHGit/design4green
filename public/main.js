window.onload = () => app();

function app() {
    const sidebar = document.querySelector('sidebar').querySelectorAll('li');
    sidebar.forEach(element => {
        element.onclick = function () {

        }
    });
}
