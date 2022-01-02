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

// function getForm(link){
//     getPage(link).then((data)=>{
//         displayPage(data, page);
//         let hash = this.location.hash;
//         let splits = hash.split("#");
//         if(splits[2] == "error"){
//             document.getElementById("email-help").classList.remove("hidden");
            
//             document.getElementById("email").setAttribute('value', localStorage.getItem("email"));
//             console.log("email error");
//         }
//         let it = document.getElementsByClassName('registration');
//         let item = it[0].id;
//         let thing = document.getElementById(item);
//         thing.classList.remove('hidden');
//         thing.classList.add("animate__slideInRight");
//         let input_target = thing.getAttribute('input_name');
//         let next_page = thing.getAttribute('next_form');
//         thing.addEventListener('submit', function(event){
//             thing.classList.add("hidden");
//             loading(true);
//             event.preventDefault();
            
//             if(next_page !== "done-3"){
//                 let value = document.getElementById(input_target).value;
//                 saveData(input_target, value);
//             }
            
//             if(next_page === "registration/form3.html"){
//                 firebase.auth().createUserWithEmailAndPassword(localStorage.getItem('email'), localStorage.getItem('password'))
//                         .then((userCredential) => {
//                             // Signed in 
//                             var user = userCredential.user;
//                             console.log('signed in'+user);
                           
//                 }).catch((error) => {
//                     loading(false);
//                     var errorCode = error.code;
//                     var errorMessage = error.message;
//                     console.log(errorMessage);
//                         getForm("registration/form1.html#error");

//                     // ..
//                 });
//             }
//             if(next_page == "done-2"){
//                 if(localStorage.getItem("account_type") === "user"){
//                     firebase.firestore().collection("campus-users").doc(localStorage.getItem('email')).set({
//                         email: localStorage.getItem('email'),
//                         student_id: localStorage.getItem('student-number'),
//                         first_name: localStorage.getItem('first_name'),
//                         last_name: localStorage.getItem('last_name'),
//                         phone_number: localStorage.getItem('phone_number'),
//                         account_type: localStorage.getItem('account_type'),
//                     }).then(() => {
//                         getPage("registration/success.html").then((data)=>{
//                             displayPage(data, page);
//                             loading(false);
//                         // ...
//                     }).catch((error)=>{
//                         console.log(error);
//                         loading(false);
//                     });
                    
//                 }).catch((error)=>{
//                     loading(false);
//                     var errorCode = error.code;
//                         var errorMessage = error.message;
//                         console.log(errorMessage);
//                         console.log(errorCode);
//                 });
//                 } else{
//                     getForm("registration/form7.html");
//                 }
//                 return false;
//         }else if(next_page == "done-3"){
//             let value = document.getElementById("check-box-2").value;
//             if(value === "checked"){
//                 submitImages().then((data) =>{
//                     document.getElementById("cover").classList.remove("hidden");
//                     getPage("registration/success.html").then((data)=>{
//                         displayPage(data, page);
//                         loading(false);
//                     // ...
//                 }).catch((error)=>{
//                     console.log(error);
//                     loading(false);
//                 });
                    
//                 }).catch((error)=>{
//                     console.log(error);
//                 });
//             } else{
//                 return false;
//             }
            
//         } else{
//                 getForm(next_page);

//             }
//           })
//     })
// }

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
    if (link ==="" || link == "registration/emailPassword.html") {
        getPage("registration/emailPassword.html").then((data)=>{
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
window.togglePassword = function togglepassword(){
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

window.setAccountType = function accountType(type){
    localStorage.setItem("account_type", type);
    window.location.hash = "registration/form1.html";
}
function submitImages(){
    return new Promise((resolve, reject)=>{
        loading(false);
        document.getElementById('cover').classList.remove("hidden");
        let student_id_name = document.getElementById("");
        let passport_photo_name = document.getElementById("");
        let student_id_image = document.getElementById("passport_size_photo");
        let passport_size_photo = document.getElementById("student_id_image");
        // student_id_image = 
    var uploadTask = firebase.storage().ref('profile_images/'+localStorage.getItem('email')+'/'+'student_id.png').put(files_id[0]);
    document.getElementById('upload-helper-text').innerHTML = "0/2 <br> Uploading student Id...";
    uploadTask.on('state_changed', function(snapshot){
        let progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100; 
        console.log(progress);
        updateProgressBar(progress);
        if(progress == 100) {
            console.log("Uploading 1 done");
            document.getElementById('upload-helper-text').innerHTML = "1/2 <br> Uploading passport size photo";
            let uploadTask2 = firebase.storage().ref('profile_images/'+localStorage.getItem('email')+'/'+'passport_size_photo.png').put(files_passport[0]);
            uploadTask2.on('state_changed', function(snapshot){
                let progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100; 
                updateProgressBar(progress);
                if(progress === 100) {
                    document.getElementById('upload-helper-text').innerHTML = "2/2 <br> Upload finished.";
                    document.getElementById("cover").classList.add("hidden");
                    loading(true);
                    firebase.firestore().collection("campus-users").doc(localStorage.getItem('email')).set({
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

window.saveLocalImg_student_id_image = function saveImageToLocal_student_id_image(){
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
window.saveLocal_passport_size_photo_image = function saveLocal_passport_size_photo_image(){
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
        getForm("registration/form8.html");
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
    return new Promise((resolve, reject)=>{
        firebase.auth().signInWithEmailAndPassword(email, password).then((userCredential)=>{
            // signed in
            var user = userCredential.user;
            resolve("success");
        }).catch((error)=>{
        // you can view either error.code or error.message
        reject(error);
    });
});
}
// this functions handles the submition of email and password in login

window.callLogin = function promptLogin(){
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
        console.log(error.message);
    })
}


});