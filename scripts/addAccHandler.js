let API_URL
fetch('../variables.json')
.then(response => response.json())
.then(data => {API_URL = data.API_URL})
.catch(error => console.error('Error: ', error))
function siteVerifier(url) {
    const urlRegex = /^(http(s):\/\/.)[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)$/g
    return urlRegex.test(url)
}

document.addEventListener('DOMContentLoaded', function() {
    //Get the form object
    const form = document.getElementById("accForm")
    let token
    chrome.storage.local.get(["token"]).then((result) => {
        token = result.token
    })

    //When the submit button is pressed, do something.
    if(!form) {
        return
    }
    form.addEventListener("submit", (event) => {
        //Prevents the browser from attempting to submit on its own
        event.preventDefault()

        //Get the username & pasword objects then values
        let usernameTag = document.getElementById("username")
        let passwordTag = document.getElementById("password")
        let siteTag = document.getElementById("site")

        let username = usernameTag.value
        let password = passwordTag.value
        let site = siteTag.value

        if(!siteVerifier(site)) {
            document.getElementById('error').style.display = "initial"
            document.getElementById('error').textContent = "The site provided is not a valid URL"
            return false
        }

        //If they're both not empty, do something
        if(password !== '' && username !== '' && site !== '') {
            //Disable the inputs while processing
            usernameTag.setAttribute('disabled',true)
            passwordTag.setAttribute('disabled',true)
            siteTag.setAttribute('disabled',true)

            const formdata = new FormData();
            formdata.append("username", username);
            formdata.append("password", password);
            formdata.append("site", site);
            formdata.append("title", site);

            const myHeaders = new Headers();
            myHeaders.append("Authorization", `Token ${token}`);
            
            const requestOptions = {
              method: "POST",
              body: formdata,
              headers:myHeaders,
              redirect: "follow"
            };
            
            fetch(`${API_URL}/add_account`, requestOptions)
              .then((response) => {
                if(response.status !==200) {
                    document.getElementById('error').style.display = "initial"
                    document.getElementById('error').textContent = `An error occured, Code ${response.status}, please try again.`
                    usernameTag.removeAttribute('disabled')
                    passwordTag.removeAttribute('disabled')
                }
                return response.json()
                 })
              .then((result) => {
                if(result["account"]) {
                    window.location.href='popup_alt.html'
                }
                console.log(result)
            })
              .catch((error) => {
                document.getElementById('error').style.display = "initial"
                document.getElementById('error').textContent = `An error occured, please try again.`
                usernameTag.removeAttribute('disabled')
                passwordTag.removeAttribute('disabled')
                console.error(error)
            });

            //Save the authenication to cookies
            //Load a new popup

        } else {
            document.getElementById('error').style.display = "initial"
            document.getElementById('error').textContent = `Please enter all fields.`
        }
        //WARNING, console.log() does not work in this section. Consider using document.write() instead.
    })
})