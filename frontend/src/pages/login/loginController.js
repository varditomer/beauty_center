'use strict'
const form = document.querySelector('form');//here we get the form
form.addEventListener('submit',function(e){//when the form is submitted  we add an event listener to the form

  e.preventDefault();//prevent the default behaviour


  const username = form['username'].value;//here we get the username and password from the form
  const password = form['password'].value;  //here we get the username and password from the form
  console.log(`password:`, password)

   let flag = true;//we create a flag variable and we set it to true
   flag = flag && username.includes("@gmail.com");
   if(!flag){  

    document.querySelector(".message").innerHTML = "USER NAME MUST HAVE GMAIL"
    return;
  }

  flag = flag && password.length >= 8;
  if(!flag)
  {
    document.querySelector(".message").innerHTML = "PASSWORD MUST HAVE MINIMUM 8 CHARACTER/NUMBERS .."
    return;

  }

  if(flag)
  {
  
    //form.submit(); //we submit the form
    let data = {            //we create an object with the username and password
      username: username,
      password: password
    };


    //we fetch the data from the login route

    fetch("user/login", {
      method: "POST",
      headers: {
        "accept": "application/json",
        "content-type": "application/json",
      },

      body: JSON.stringify(data)//we convert the data to json
     })
     .then((val) => val.text())//we convert the data to text
     .then((val) => {
        console.log(val);
       if (val === "valid") {
        location.href = "/home";//if the data is valid, we redirect the user to the home page
      } 
      else if(val==="valid_empl"){
        location.href = "/home_employee.html"
      }
      {
        //if the data is not valid, we display an error message
        document.querySelector(".message").innerHTML =
         "Username and password do not match. Please try again.";
     }
  })
  .catch((err) => console.log(err));

  
}
});