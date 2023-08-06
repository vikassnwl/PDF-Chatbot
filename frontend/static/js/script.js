// function to retrieve cookie
function getCookie(cname){
    let name = cname + "=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(";");
    for(let i=0; i<ca.length; i++){
        let c = ca[i];
        while (c.charAt(0) == " "){
            c = c.substring(1);
        }
        if(c.indexOf(name) == 0){
            return c.substring(name.length, c.length);
        }
    }
    return "";
};


function choose_file() {
    // create an input type file element
    var input = document.createElement('input');
    input.type = "file";

    // add event listener to the input type file element
    input.addEventListener("change", function (event) {
        // get the selected file
        var file = event.target.files[0];

        // do something with the selected file
        // alert(file.name);
        document.getElementById("chosen_filename").innerHTML = file.name;

        var filesize = file.size / 1000 / 1000  // filesize in MB
        filesize = filesize.toFixed(1)  // filesize till 1 decimal place
        document.getElementById("chosen_filesize").innerHTML = `${filesize}MB`;
        document.getElementById("chosen_fileinfo").style.visibility = "visible";

        // call fetch api to send file object to the backend
        url = "http://127.0.0.1:8000/upload/"
        var csrftoken = getCookie('csrftoken');
        // var headers = new Headers();
        // headers.append('X-CSRFToken', csrftoken);
        // headers.append("Content-Type", 'application/json')
        // headers.append("Accept", 'application/json')
        // headers.append("Content-Type", 'application/x-www-form-urlencoded')
        // 'Content-Type': 'application/x-www-form-urlencoded',

        fetch(url, 
        {
            method: "POST", // *GET, POST, PUT, DELETE, etc.
            mode: "no-cors",
            headers:{
                "Content-Type": "application/json"
            },
            body: JSON.stringify({name:"Vikas"})
        })
        .then(response => console.log(response))
        // .then(data => console.log(data));

    })

    // fire the click event
    input.click();
}