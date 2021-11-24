document.getElementById("submit").onclick = () => {
    let username = document.getElementById("username").value;
    let password = document.getElementById("password").value;
    
    let body = {
        username: username,
        password: password
    };

    let tokens = new XMLHttpRequest();
    tokens.open("POST", "http://localhost:4000/user/login", true);
    tokens.setRequestHeader('Content-Type', 'application/json');
    tokens.send(JSON.stringify(body));
    tokens.onload = function() {
        let data = JSON.parse(this.responseText);
        localStorage.setItem("accessToken", data.accessToken);
        localStorage.setItem("refreshToken", data.refreshToken);
        window.location.href = 'C:/Users/gabri/Documents/Web/Login%20Auth/website/person.html';
    }
}