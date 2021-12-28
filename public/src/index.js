document.addEventListener('DOMContentLoaded', function() {
var req = new XMLHttpRequest();
const position = document.getElementById("page");
const spinner = document.getElementById("spinner");

function loading(value){
    if(value == true){
        spinner.classList.remove("hidden");
    }else{
        spinner.classList.add("hidden");
    }
}

function getPage(page){ // fetches a page
    loading(true);
    return new Promise((resolve, reject)=>{
        req.open('GET', page, false);
    req.send(null);

    if(req.status == 200) {
        loading(false);
        let state = { 'page_id': 1, 'user_id': 5 }
        let title = page;
        let url = "registration.html#"+page;
        history.pushState(state, title, url);
    resolve(req.responseText);
    } else{
        reject("401");
        loading(false);
    }
    })
    
}
function displayPage(data, position){ // display page content at told position
    position.innerHTML = data;
}

function getForm(link){
    getPage(link).then((data)=>{
        displayPage(data, page);
        let hash = this.location.hash;
        let splits = hash.split("#");
        if(splits[2] == "error"){
            document.getElementById("email-help").classList.remove("hidden");
            
            document.getElementById("email").setAttribute('value', localStorage.getItem("email"));
            console.log("email error");
        }
        let it = document.getElementsByClassName('registration');
        let item = it[0].id;
        let thing = document.getElementById(item);
        thing.classList.remove('hidden');
        thing.classList.add("animate__slideInRight");
        let input_target = thing.getAttribute('input_name');
        let next_page = thing.getAttribute('next_form');
        thing.addEventListener('submit', function(event){
            thing.classList.add("hidden");
            loading(true);
            event.preventDefault();
            let value = document.getElementById(input_target).value;
            saveData(input_target, value);
            
            if(next_page == "done"){
                firebase.firestore().collection("campus-users").doc(localStorage.getItem('email')).set({
                    email: localStorage.getItem('email'),
                    student_id: localStorage.getItem('student-number'),
                    first_name: localStorage.getItem('first_name'),
                    last_name: localStorage.getItem('last_name'),
                    phone_number: localStorage.getItem('phone_number'),
                }).then(() => {
                    firebase.auth().createUserWithEmailAndPassword(localStorage.getItem('email'), localStorage.getItem('password'))
                        .then((userCredential) => {
                            // Signed in 
                            var user = userCredential.user;
                            console.log('signed in');
                            getPage("registration/success.html").then((data)=>{
                                displayPage(data, page);
                                loading(false);
                            // ...
                        }).catch((error)=>{
                            console.log(error);
                            loading(false);
                        });
                }).catch((error) => {
                    loading(false);
                    var errorCode = error.code;
                    var errorMessage = error.message;
                    console.log(errorMessage);
                    if(errorCode === "auth/email-already-in-use"){
                        getForm("registration/form1.html#error");
                    }

                    // ..
                });
                
            }).catch((error)=>{
                loading(false);
                var errorCode = error.code;
                    var errorMessage = error.message;
                    console.log(errorMessage);
                    console.log(errorCode);
            });
        }else if(input_target == "password"){
            let password_help = document.getElementById("password-help");
            // Validate length
            if(value.length >= 8) {
                password_help.classList.remove("hidden");
            } else {
                password_help.classList.add("hidden");
                return false;
            }
            let lowerCaseLetters = /[a-z]/g;
            if(value.match(lowerCaseLetters)){
                password_help.classList.remove("hidden");
            } else {
                password_help.classList.add("hidden");
                return false;
            }
             // Validate capital letters
        var upperCaseLetters = /[A-Z]/g;
        if(value.match(upperCaseLetters)) {
            password_help.classList.remove("hidden");
        } else {
            password_help.classList.add("hidden");
            return false;
        }
        // Validate numbers
        var numbers = /[0-9]/g;
        if(value.match(numbers)) {
            password_help.classList.remove("hidden");
        } else {
            password_help.classList.add("hidden");
            return false;
        }
        getForm(next_page);
        } else{
                getForm(next_page);

            }
          })
    })
}

function hijackRequests(){
    window.addEventListener('hashchange', function (e) {
            let hash = this.location.hash;
            let link = hash.substring(1);
            let splits = hash.split("#");
            if (link ==="" || link == "registration/options.html") {
                getPage("registration/options.html").then((data)=>{
                    displayPage(data, position);
                    let options = document.getElementById('options');
                    options.classList.remove('hidden');
                    options.classList.add('animate__slideInUp');
                    document.getElementById("email").setAttribute('value', localStorage.getItem("email"));

                }).catch((error)=>{
                    console.log("getting "+link);
                })
                
            } else if(splits[2] == "error"){
                document.getElementById("email-help").classList.remove("hidden");
                document.getElementById("email").setAttribute('value', localStorage.getItem("email"));
                console.log("email error");
            } else {
                getForm(link);
                console.log("getting form link");
            }
            
    });
       
}
hijackRequests();

 //   get options page
 let hash = this.location.hash;
let link = hash.substring(1);
let splits = hash.split("#");
    if (link ==="" || link == "registration/options.html") {
        getPage("registration/options.html").then((data)=>{
            displayPage(data, position);
            let options = document.getElementById('options');
            options.classList.remove('hidden');
            options.classList.add('animate__slideInUp');
            
        }).catch((error)=>{
            console.log(error);
        });
    } else{
        getForm(link);
        console.log("getting form link");
    }

var myStorage = window.localStorage;
function saveData(field, value){
  localStorage.setItem(field, value);
  console.log(field + ' saved');
  
}

window.addEventListener("click", function(e){
    if(e.nodeName === "A"){
        e.preventDefault();
        console.log("Blocked");
    }
    
    
})

window.togglePassword = function togglepassword(){
    let password = document.getElementById('password');
    if(state === "hidden"){
        button.innerHTML="visibility";
        password.setAttribute('type', "text");
        button.setAttribute("state", "visible");
    }else{
        button.innerHTML="visibility_off";
        password.setAttribute('type', "password");
        button.setAttribute("state", "hidden");
    }

}
});