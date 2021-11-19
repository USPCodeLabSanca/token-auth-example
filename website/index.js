document.getElementById("submit").onclick = () => {
    let username = document.getElementById("username").value;
    let password = document.getElementById("password").value;
    
    let data = {
        username: username,
        password: password
    };

    fetch("http://localhost:4000/user/login", {
    method: "POST",
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(data)
    }).then(res => {
        console.log(res);
        // console.log("Request complete! response:", res);
    });
}