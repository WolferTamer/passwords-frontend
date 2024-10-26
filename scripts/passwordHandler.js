document.addEventListener('DOMContentLoaded', function() {
    const buttonEle = document.getElementById("addacc")

    buttonEle.addEventListener("click", (event)=> {
        window.location.href='add_password.html'
    })

    let token
    chrome.storage.local.get(["token"]).then((result) => {
        token = result.token
    })

    //Get the form object
    const form = document.getElementById("passwordform")

    //When the submit button is pressed, do something.
    if(!form) {
        return
    }
    form.addEventListener("submit", (event) => {
        event.preventDefault()
        
        let websiteTag = document.getElementById("website")
        let website = websiteTag.value
        if(website !== '') {
            websiteTag.setAttribute('disabled',true)

            const myHeaders = new Headers();
            myHeaders.append("Authorization", `Token ${token}`);
            
            const requestOptions = {
              method: "GET",
              headers:myHeaders,
              redirect: "follow"
            };
            
            fetch(`http://127.0.0.1:8000/api/account?site=${website}`, requestOptions)
              .then((response) => {
                if(response.status !==200) {
                    document.getElementById('outputdisplay').style.display = "initial"
                    document.getElementById('outputdisplay').textContent = `Code ${response.status}`
                    websiteTag.setAttribute('disabled',false)
                }
                return response.json()
                 })
              .then((result) => {
                if(result["account"]) {
                    document.getElementById('outputdisplay').style.display = "initial"
                    document.getElementById('outputdisplay').textContent = `${result.account.username,result.account.password}`
                    websiteTag.setAttribute('disabled',false)
                }
                console.log(result)
            })
              .catch((error) => {
                document.getElementById('outputdisplay').style.display = "initial"
                websiteTag.setAttribute('disabled',false)
                console.error(error)
            });
        }
    })
})