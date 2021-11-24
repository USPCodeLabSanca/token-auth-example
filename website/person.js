function parseJwt (token) {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
};

let accessToken = parseJwt(localStorage.getItem("accessToken"));
let sub = accessToken.sub;

let person = new XMLHttpRequest();

async function fetchAsync (url) {
    let response = await fetch(url);
    let data = await response.json();
    return data;
}

console.log("http://localhost:80/user/" + sub)

let req = { 
    method: 'get', 
    headers: new Headers({
      'Authorization': 'Bearer ' + accessToken, 
      'Content-Type': 'application/json'
    })
}

fetch("http://localhost:80/user/" + sub, req).then(function(response) {
    return response.json();
 }).then(function(data) {
    console.log(data);
}).catch(function() {
    console.log("Booo");
});

// fetchAsync("http:localhost:80/user/" + parsedToken.sub).then((response) => console.log(response.data));

/*
let root = document.getElementById("root");
let title = document.createElement("h1");
var titleText = document.createTextNode(user.username);
title.appendChild(titleText);
root.appendChild(title);
*/
