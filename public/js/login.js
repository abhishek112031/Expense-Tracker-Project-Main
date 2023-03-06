
async function checkData(event){
  event.preventDefault();

  try{

    const email=document.getElementById('userEmail').value;
    const password=document.getElementById('password').value;
    
  
    const loginData={
      email,password
    }
  
    const resp=await axios.post('/user/login',loginData)
    
      if(resp.status===200){
        alert(resp.data.message);
        // console.log(resp.data);
        localStorage.setItem('token',resp.data.token);
        window.location.href='/user/daily-expenses'
      }
  }
  
  catch(err){
    // console.log(err.response.data.message)
        document.body.innerHTML+=`<div class="text-white text-center bg-danger">Error: ${err.response.data.message}</div>`
  }


}


//forgot password:-->
document.getElementById('forgetpw').onclick=async function(){
  window.location.href='/password/forgotpassword'

}

