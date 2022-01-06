document.addEventListener('DOMContentLoaded', function() {
var req = new XMLHttpRequest();
const position = document.getElementById("page");
const spinner = document.getElementById("spinner");
var $ = function (selector) {
    // removes the buden pf using document.getSomething
  return document.querySelectorAll(selector);
};

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
        if(link ==="" || link == "registration/emailPassword.html"){
            greetGuest();
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
            if(next_page !== "done-3"){
                if(next_page == "done-2"){
                    let account_types = document.getElementsByName('account-type');
                    let account_types_value;
                    for(let i = 0; i < account_types.length; i++){
                        if(account_types[i].checked){
                            account_types_value = account_types[i].value;
                            saveData(input_target, account_types_value);
                            getForm("registration/terms-and-conditions.html");
                            return;
                        }
                    }
                }else{
                    let value = document.getElementById(input_target).value;
                    saveData(input_target, value);
                }
                
            }
            if(next_page == "done-2"){
                getForm ("registration/terms-and-condtions.html");
                return;
                
        }else if(next_page =="accepted-terms-and-condtions"){
            // after accepting terms and conditions
            if(localStorage.getItem("account_type") === "user"){
                firebase.firestore().collection("campus-users").doc(localStorage.getItem('userValuable')).set({
                    email: localStorage.getItem('email'),
                    student_id: localStorage.getItem('student-number'),
                    first_name: localStorage.getItem('first_name'),
                    last_name: localStorage.getItem('last_name'),
                    phone_number: localStorage.getItem('phone_number'),
                    account_type: localStorage.getItem('account_type'),
                }).then(() => {
                    getPage("registration/success.html").then((data)=>{
                        displayPage(data, page);
                        loading(false);
                    // ...
                }).catch((error)=>{
                    console.log(error);
                    loading(false);
                });
                
            }).catch((error)=>{
                loading(false);
                var errorCode = error.code;
                    var errorMessage = error.message;
                    console.log(errorMessage);
                    console.log(errorCode);
            });
            } else{
                getForm("registration/image-student-id-image.html");
            }
        }
        else if(next_page == "done-3"){
            let value = document.getElementById("check-box-2").value;
            if(value === "checked"){
                submitImages().then((data) =>{
                    document.getElementById("cover").classList.remove("hidden");
                    getPage("registration/success.html").then((data)=>{
                        displayPage(data, page);
                        loading(false);
                    // ...
                }).catch((error)=>{
                    console.log(error);
                    loading(false);
                });
                    
                }).catch((error)=>{
                    console.log(error);
                });
            } else{
                return false;
            }
            
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
            if (link ==="" || link == "registration/emailPassword.html") {
                getPage("registration/emailPassword.html").then((data)=>{
                    displayPage(data, position);
                    let options = document.getElementById('options');
                    options.classList.remove('hidden');
                    options.classList.add('animate__slideInUp');
                    document.getElementById("email").setAttribute('value', localStorage.getItem("email"));
                    greetGuest();

                }).catch((error)=>{
                    console.log("getting "+link);
                })
                
            } else if(link == "registration/password-reset.html"){
                loading(true);
                getPage(link).then((data) => {
                    displayPage(data, position);
                    loading(false);
                    let form = document.getElementById("password-reset");
                    form.classList.remove('hidden');
                    form.classList.add("animate__slideInRight");
                    form.addEventListener('submit', function(event){
                        event.preventDefault();
                        form.classList.add("hidden");
                        loading(true);
                        sendPasswordReset(getPage, displayPage, position, loading, $);

                    });
                    // ...
                }).catch((error) => {
                    console.log(error);
                    loading(false);
                });

            }else if(splits[2] == "error"){
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
entryPoint();
function entryPoint(){
    //   get options page
 let hash = this.location.hash;
 let link = hash.substring(1);
 let splits = hash.split("#");
 
     if (link ==="" || link == "registration/emailPassword.html") {
         console.log("pass");
         getForm("registration/emailPassword.html");

         return;
         // getPage("registration/emailPassword.html").then((data)=>{
         //     displayPage(data, position);
         //     let options = document.getElementById('options');
         //     options.classList.remove('hidden');
         //     options.classList.add('animate__slideInUp');
         //     
         //     return false;
             
         // }).catch((error)=>{
         //     console.log(error);
         //     return false;
         // });
         
     } 
     if(link === "registration/studentNumber.html"){
         getForm(link);
         return;
     } else{
         getForm(link);
         console.log("getting form link");
     }
}
 

var myStorage = window.localStorage;
function saveData(field, value){
  localStorage.setItem(field, value);
  console.log(field + ' saved');
  
}


// window.setAccountType = function accountType(type){
//     localStorage.setItem("account_type", type);
//     window.location.hash = "registration/form1.html";
// }
function submitImages(){
    return new Promise((resolve, reject)=>{
        loading(false);
        document.getElementById('cover').classList.remove("hidden");
        let student_id_name = document.getElementById("");
        let passport_photo_name = document.getElementById("");
        let student_id_image = document.getElementById("passport_size_photo");
        let passport_size_photo = document.getElementById("student_id_image");
        // student_id_image = 
    var uploadTask = firebase.storage().ref('profile_images/'+localStorage.getItem('userValuable')+'/'+'student_id.png').put(files_id[0]);
    document.getElementById('upload-helper-text').innerHTML = "0/2 <br> Uploading student Id...";
    uploadTask.on('state_changed', function(snapshot){
        let progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100; 
        console.log(progress);
        updateProgressBar(progress);
        if(progress == 100) {
            console.log("Uploading 1 done");
            document.getElementById('upload-helper-text').innerHTML = "1/2 <br> Uploading passport size photo";
            let uploadTask2 = firebase.storage().ref('profile_images/'+localStorage.getItem('userValuable')+'/'+'passport_size_photo.png').put(files_passport[0]);
            uploadTask2.on('state_changed', function(snapshot){
                let progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100; 
                updateProgressBar(progress);
                if(progress === 100) {
                    document.getElementById('upload-helper-text').innerHTML = "2/2 <br> Upload finished.";
                    document.getElementById("cover").classList.add("hidden");
                    loading(true);
                    firebase.firestore().collection("campus-users").doc(localStorage.getItem('userValuable')).set({
                        email: localStorage.getItem('email'),
                        student_id: localStorage.getItem('student-number'),
                        first_name: localStorage.getItem('first_name'),
                        last_name: localStorage.getItem('last_name'),
                        phone_number: localStorage.getItem('phone_number'),
                        account_type: localStorage.getItem('account_type'),
                    }).then(() => {
                        getPage("registration/success.html").then((data)=>{
                            displayPage(data, page);
                            loading(false);
                        // ...
                    }).catch((error)=>{
                        console.log(error);
                        loading(false);
                    });
                    
                }).catch((error)=>{
                    loading(false);
                    var errorCode = error.code;
                        var errorMessage = error.message;
                        console.log(errorMessage);
                        console.log(errorCode);
                });
                 
                 
                }
            },
            function(error){
                console.log("error "+error);
            }
            );
        }
    },
    function(error){
        console.log("error "+error);
        // reject(error);
    }
    );
    });
    

}
var files_id, files_passport, reader;

window.saveLocalImg_student_id_image = function saveImageToLocalstudentid_image(){
    let input = document.createElement("input");
    input.type = "file";
    input.setAttribute("required", "required");
    input.id = "student_id_image";
    let checkBox = document.getElementById("check-box-1");

    input.onchange = e =>{
        files_id = e.target.files;
        reader = new FileReader();
        console.log(files_id);
        checkBox.value = "checked";
        reader.onload = function(){
            document.getElementById("preview_student_id").src = reader.result;
        }
        reader.readAsDataURL(files_id[0]);

    }
    input.click();
}
window.saveLocal_passport_size_photo_image = function saveLocalpassportsize_photo_image(){
    let input = document.createElement("input");
    input.type = "file";
    input.setAttribute("required", "required");
    input.id = "passport_size_photo";
    let checkBox = document.getElementById("check-box-2");
    input.onchange = e =>{
        files_passport = e.target.files;
        reader = new FileReader();
        console.log(files_passport);
        checkBox.value = "checked";
        reader.onload = function(){
            document.getElementById("preview_password_size_photo").src = reader.result;
        }
        reader.readAsDataURL(files_passport[0]);

    }
    input.click();
}

function updateProgressBar(value){
    document.getElementById("progres-bar").style.width = value+"%";
}
window.switchToP8 = function switchToP8(){
    let value = document.getElementById("check-box-1").value;
    if(value === "checked"){
        getForm("registration/passport-size-photo.html");
    }
}

var curImg = new Image();

curImg.src = "src/assets/background-2.jpg";
curImg.onload = function(){
        // do whatever here, add it to the background, append the image ect.
        document.getElementById("side-image").style.backgroundImage = "url('"+curImg.src+"')";  
    }

//function for loging in users#
function login(email, password){
    saveData('email', email);
    return new Promise((resolve, reject)=>{
        firebase.auth().signInWithEmailAndPassword(email, password).then((userCredential)=>{
            // signed in
            saveData('userValuable', userCredential.user.uid);
            const user = userCredential.user;
            resolve("success");
        }).catch((error)=>{
        // you can view either error.code or error.message
        reject(error);
    });
});
}


// function to call createAccountAndVerifyEmail
window.callCreateAccountAndVerifyEmail = function callCreateAccountAndVerifyEmail(){
    $("#email")[0].classList.remove("invalid");
    $("#email")[0].setAttribute("disabled", true);
    $("#email-container")[0].classList.remove("animate__shakeX");
    $("#email-container")[0].classList.remove("error-text");
    $("#email-error-text-2")[0].classList.add("hidden");
    $("#password")[0].classList.remove("invalid");
    $("#password")[0].setAttribute("disabled", true);
    $("#password-container")[0].classList.remove("animate__shakeX");
    $("#password-container")[0].classList.remove("error-text");
    $("#password-error-text-1")[0].classList.add("hidden");
    //buttons
    $("button")[0].disabled = false;
    $("button")[1].disabled = false;

    // get email and password
    let email = document.getElementById("email").value;
    let password = document.getElementById("password").value;

    createAccountAndVerifyEmail(email, password).then((userCredential)=>{
        saveData('userValuable', userCredential.user.uid);
        const user = userCredential.user;
        // CHECKS IF AUTH STATUS HAS CHANGED
        console.log("here");
    firebase.auth().onAuthStateChanged(function(user) { 
        if (user.emailVerified) {
          console.log('Email is verified');
        }
        else {
          console.log('Email is not verified');
          user.sendEmailVerification();
          
        }
      });
        // redirect to email verification information page
        getPage("registration/emailVerification.html").then((data)=>{
            displayPage(data, page);
            saveData("email", email);
            $("#email-address")[0].innerHTML = email;
            loading(false);
            // ...
        }).catch((error)=>{
            console.log(error);
            loading(false);
        });
    }).catch((error)=>{
        console.log(error);
    })
}
// function creates an account for the user and sends email verification
function createAccountAndVerifyEmail(email, password){
    return new Promise((resolve,reject)=>{
        firebase.auth().createUserWithEmailAndPassword(email, password).then((userCredential)=>{
            resolve(userCredential);
        }).catch((error)=>{
            reject(error);
        })
    })
    
}
// this functions handles the submition of email and password in login

window.callLogin = function promptLogin(){
    // reset everything....
    $("#email")[0].classList.remove("invalid");
    $("#email")[0].setAttribute("disabled", true);
    $("#email-container")[0].classList.remove("animate__shakeX");
    $("#email-container")[0].classList.remove("error-text");
    $("#email-error-text-2")[0].classList.add("hidden");
    $("#password")[0].classList.remove("invalid");
    $("#password")[0].setAttribute("disabled", true);
    $("#password-container")[0].classList.remove("animate__shakeX");
    $("#password-container")[0].classList.remove("error-text");
    $("#password-error-text-1")[0].classList.add("hidden");

    //buttons
    $("button")[0].disabled = false;
    $("button")[1].disabled = false;

    let email = document.getElementById("email").value;
    let password = document.getElementById("password").value;
    
    login(email, password).then((responce)=>{
        //redirect to success page
        getPage("registration/success.html").then((data)=>{
            displayPage(data, page);
            loading(false);
        // ...
    }).catch((error)=>{
        console.log(error);
        loading(false);
    });
    }).catch((error)=>{
        console.log(error.code);
        if(error.code === "auth/user-not-found"){
            shakeEmail();
            $("#password")[0].removeAttribute("disabled");
        } else if(error.code === "auth/wrong-password"){
            // show option for reseting password
            shakePassword();
            $("#email")[0].removeAttribute("disabled");
        }else{
            shakeEmail();
            shakePassword();
        }
        $("button")[0].disabled = false;
        $("button")[1].disabled = false;
    })
}

function shakeEmail(){
    $("#email")[0].classList.add("invalid");
    $("#email")[0].removeAttribute("disabled");
    $("#email-container")[0].classList.add("animate__shakeX");
    $("#email-container")[0].classList.add("error-text");
    $("#email-error-text-2")[0].classList.remove("hidden");
}
function shakePassword(){
    $("#password")[0].classList.add("false");
    $("#password")[0].removeAttribute("disabled");
    $("#password-container")[0].classList.add("animate__shakeX");
    $("#password-container")[0].classList.add("error-text");
    $("#password-error-text-1")[0].classList.remove("hidden");
}

// greetings to our guest
function  greetGuest(){
    let welcome;  
    let date = new Date();  
    let hour = date.getHours();  
    let minute = date.getMinutes();  
    let second = date.getSeconds();  
    if (minute < 10) {  
      minute = "0" + minute;  
    }  
    if (second < 10) {  
      second = "0" + second;  
    }  
    if (hour < 12) {  
      welcome = "morning";  
    } else if (hour < 17) {  
      welcome = "afternoon";  
    } else {  
      welcome = "evening";  
    }
    $("#greetings-text")[0].innerHTML = welcome;
}

//function gets values from a url
function getValueFromUrl(urli, valueNeeded){
    let url = new URL(urli);
    let searchParams = new URLSearchParams(url.search);
    return searchParams.get(valueNeeded);
}



  window.togglePassword = function toggpassword(){
    let password = document.getElementById('password');
    let button = document.getElementById('togglePassword');
    let state = button.getAttribute("state");
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

function sendPasswordReset(getPage, displayPage, position, loading, $) {
    let email = $("#email")[0].value;
    firebase.auth().sendPasswordResetEmail(email).then((responce) => {
        console.log("password reset email sent successfully");
        // redirect to email verification information page
        getPage("registration/password-reset-confirmation.html").then((data) => {
            displayPage(data, position);
            loading(false);
            $("#email-address")[0].innerHTML = email;
            // ...
        }).catch((error) => {
            console.log(error);
            loading(false);
        });
    }).catch((error) => {
        alert("This user does not exist, check your email address");
        window.history.go(-1);
        loading(false);
        document.getElementById("password-reset").classList.remove("hidden");
    });
}

});


