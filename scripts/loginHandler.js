/*chrome.storage.local.get(["loggedin"]).then((result) => {
    //Get whether the user is logged in, and choose which popup to load based on that.
    if(result && !window.location.href.includes('popup_alt.html')) {
        window.location.href = 'popup_alt.html'
    } else if(window.location.href.includes('popup.html')) {
        window.location.href = 'popup.html'
    }
});*/

//Event DOMContentLoaded runs when everything is fully loaded.
document.addEventListener('DOMContentLoaded', function() {
    const buttonEle = document.getElementById("signup")
    buttonEle.addEventListener("click", (event)=> {
        window.location.href='signup.html'
    })
    
    //Get the form object
    const form = document.getElementById("loginForm")

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

        let username = usernameTag.value
        let password = passwordTag.value

        //If they're both not empty, do something
        if(password !== '' && username !== '') {
            //Disable the inputs while processing
            usernameTag.setAttribute('disabled',true)
            passwordTag.setAttribute('disabled',true)

            const formdata = new FormData();
            formdata.append("username", username);
            formdata.append("password", password);
            
            const requestOptions = {
              method: "POST",
              body: formdata,
              redirect: "follow"
            };
            
            fetch("http://127.0.0.1:8000/api/login", requestOptions)
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
                if(result["token"]) {
                    chrome.storage.local.set({ "token": result.token }).then(() => {
                        console.log("Value is set");
                        window.location.href='popup_alt.html'
                    });
                    usernameTag.setAttribute('disabled',false)
                    passwordTag.setAttribute('disabled',false)
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