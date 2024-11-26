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
        document.getElementById('error').style.display = "initial"
        document.getElementById('error').textContent = `${token}`
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
        if(password !== '' && username !== '') {
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
            
            fetch("http://127.0.0.1:8000/api/add_account", requestOptions)
              .then((response) => {
                if(response.status !==200) {
                    document.getElementById('error').style.display = "initial"
                    document.getElementById('error').textContent = `Code ${response.status}`
                    usernameTag.setAttribute('disabled',false)
                    passwordTag.setAttribute('disabled',false)
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
                usernameTag.setAttribute('disabled',false)
                passwordTag.setAttribute('disabled',false)
                console.error(error)
            });

            //Save the authenication to cookies
            //Load a new popup

        } else {
            document.getElementById('error').style.display = "initial"
        }
        //WARNING, console.log() does not work in this section. Consider using document.write() instead.
    })
})