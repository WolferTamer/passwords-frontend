let API_URL

chrome.storage.local.get(["token"]).then((result) => {

    //Get whether the user is logged in, and choose which popup to load based on that.
    fetch('../variables.json')
    .then(response => response.json())
    .then(data => {API_URL = data.API_URL
        if(!result.token) {
            return
        }
        const myHeaders = new Headers();
        myHeaders.append("Authorization", `Token ${result.token}`);
        const requestOptions = {
            method: "GET",
            headers: myHeaders,
            redirect: "follow"
        };
        
        fetch(`${API_URL}/test_token`, requestOptions)
        .then((response) => {
            if(response.status == 200) {
                window.location.href = 'popup_alt.html'
            }
            
        })
        .catch((error) => {
            document.getElementById('error').style.display = "initial"
            document.getElementById('error').textContent = `Couldn't authorize user.`
        });
    })
    .catch(error => console.error('Error: ', error))
});

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
            
            fetch(`${API_URL}/login`, requestOptions)
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
                if(result["token"]) {
                    chrome.storage.local.set({ "token": result.token }).then(() => {
                        console.log("Value is set");
                        window.location.href='popup_alt.html'
                    });
                    usernameTag.removeAttribute('disabled')
                    passwordTag.removeAttribute('disabled')
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