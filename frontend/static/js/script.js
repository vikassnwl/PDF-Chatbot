// function to retrieve cookie
function getCookie(cname) {
    let name = cname + "=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(";");
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) == " ") {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
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

        // create form data to send it as request
        const formData = new FormData();
        formData.append('file', file);

        document.getElementById("chosen_filename").innerHTML = file.name;

        var filesize = file.size / 1000 / 1000  // filesize in MB
        filesize = filesize.toFixed(1)  // filesize till 1 decimal place
        document.getElementById("chosen_filesize").innerHTML = `${filesize}MB`;
        document.getElementById("chosen_fileinfo").style.visibility = "visible";

        // loading the spinner before calling API
        spinner = document.getElementById("spinner");
        spinner.style.display = "flex";

        // call fetch api to send file object to the backend
        url = "http://127.0.0.1:8000/upload/"
        fetch(url,
            {
                method: "POST", // *GET, POST, PUT, DELETE, etc.
                body: formData
            })
            .then(response => response.json())
            .then(data => {
                spinner.style.display = "none";
            });
    })

    // fire the click event
    input.click();
}



document.getElementById("query_box")
    .addEventListener("keyup", function(event) {
    event.preventDefault();
    if (event.keyCode === 13) {

        query = document.getElementById("query_box").value

        // create form data to send it as request
        const formData = new FormData();
        formData.append('query', query);

        // loading the spinner before calling API
        spinner = document.getElementById("spinner");
        spinner.style.display = "flex";

        // call api to ask query
        url = "http://127.0.0.1:8000/ask/"
        fetch(url,
            {
                method: "POST", // *GET, POST, PUT, DELETE, etc.
                body: formData
            })
            .then(response => response.json())
            .then(data => {
                spinner.style.display = "none";
                if(data["error"] != undefined){
                    alert(data["error"]);
                }
                else{
                    document.getElementById("response").innerHTML = data["response"];
                }
            })
            .catch(e => alert(e))
        }
});