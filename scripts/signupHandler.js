function verifyEmail(email) {
    //This just verifies that the string follows the format anystring@anystring.anystring
    //This must also be checked in the backend by attempting to send an email to the address
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
}

function verifyPassword(password) {
    //This regex ensures a length of at least 8, at least one number, and at least one special character
    //It is being used temporarily, and may be changed later to instead use other rules
    const passRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/
    return passRegex.test(password)
}

export function verifyEmail(email) {
    //This just verifies that the string follows the format anystring@anystring.anystring
    //This must also be checked in the backend by attempting to send an email to the address
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
}

function passRuleBroken(password) {
    const lengthReg = /^.{8,}$/
    const invalidCharReg = /^[A-Za-z\d@$!%*#?&]+$/
    const digitReg = /.*(?=.*\d).*/
    const specialReg = /.*[@$!%*#?&].*/
    if(!lengthReg.test(password)) {
        return "Your password needs to be at least 8 characters long."
    } else if(!invalidCharReg.test(password)) {
        return "Your password can only contain letters, numbers, and special characters @ $ ! % * # ? &."
    } else if(!digitReg.test(password)) {
        return "Your password must contain at least one number"
    } else if(!specialReg.test(password)) {
        return "Your password must contain at least one special character from @ $ ! % * # ? &."
    }
    return "No Error"
}

//Event DOMContentLoaded runs when everything is fully loaded.
let API_URL
fetch('../variables.json')
.then(response => response.json())
.then(data => {API_URL = data.API_URL})
.catch(error => console.error('Error: ', error))
document.addEventListener('DOMContentLoaded', function() {

    const form = document.getElementById("signupForm")

    //When the submit button is pressed, do something.
    if(!form) {
        return
    }
    form.addEventListener("submit", (event) => {
        //Prevents the browser from attempting to submit on its own
        event.preventDefault()

        //username now collects emails instead, left as is to perserve functionality
        //Get the username & pasword objects then values
        let usernameTag = document.getElementById("username")
        let passwordTag = document.getElementById("password")

        let username = usernameTag.value
        let password = passwordTag.value
        //Check to see if the password matches restrictions. Once email is implemented add that check as well.
        if(!verifyPassword(password)) {
            let rule = passRuleBroken(password)
            document.getElementById('error').style.display = "initial"
            document.getElementById('error').textContent = rule
            return false
        }

        if(!verifyEmail(username)) {
            document.getElementById('error').style.display = "initial"
            document.getElementById('error').textContent = `${username} is not a valid email.`
            return false
        }

        //If they're both not empty, do something
        if(password !== '' && username !== '') {
            //Disable the inputs while processing
            usernameTag.setAttribute('disabled',true)
            passwordTag.setAttribute('disabled',true)

            const formdata = new FormData();
            formdata.append("email", username);
            formdata.append("password", password);
            
            const requestOptions = {
              method: "POST",
              body: formdata,
              redirect: "follow"
            };
            
            fetch(`${API_URL}/signup`, requestOptions)
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
                    chrome.storage.local.set({ "token": result["token"] }).then(() => {
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