class BackDropSwatch{
    constructor(){
        this.morning = "src/assets/bg/WhatsApp Image 2022-01-19 at 11.15.19 AM.jpeg";
        this.afternoon = "src/assets/afternoon.jpg";
        this.evening = "src/assets/night.jpg";
        this.rainyMorning = null;
        this.rainyAfternoon = null;
        this.rainyEvening = null;
        this.timeOfDay = null;
        this.weather = null;
    }
    getTime(){
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
      this.timeOfDay = "morning";  
    } else if (hour < 17) {  
      this.timeOfDay = "afternoon";  
    } else {  
      this.timeOfDay = "evening";  
    }
    return;
    }
    // getWeather(){

    // }
    place(imgUrl){
        let bgImg = new Image();
        bgImg.src = imgUrl;
        bgImg.onload = function(){
            // do whatever here, add it to the background, append the image ect.
            document.getElementById("back-drop").style.backgroundImage = "url('"+bgImg.src+"')";  
            return;
        
        }
        return;

    }
    putImage(){
      this.place(this.morning);
      
        // if(this.timeOfDay === "morning"){
        //     this.place(this.morning);
        //     document.getElementById("back-drop").style.color = "#000000";
        //     document.getElementById("search-box").style.borderColor = "#00000087";
        // } else if(this.timeOfDay === "afternoon"){
        //     this.place(this.afternoon);
        //     document.getElementById("back-drop").style.color = "#ffffff";
        //     document.getElementById("search-box").style.borderColor = "#ffffff";
        // } else if(this.timeOfDay === "evening"){
        //     this.place(this.evening);
        //     document.getElementById("back-drop").style.color = "#ffffff";
        //     document.getElementById("search-box").style.borderColor = "#ffffff";
        //     // document.getElementById("header").style.backgroundColor = "#24235f";
        // }
        return;
    }
}
// var backDrop = new BackDropSwatch();
// backDrop.getTime()
// backDrop.putImage();

