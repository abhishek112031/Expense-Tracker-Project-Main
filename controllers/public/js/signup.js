
async function saveToServer(event){
    event.preventDefault();

    try{

      const user=document.getElementById('userName').value;
      const email=document.getElementById('userEmail').value;
      const password=document.getElementById('password').value;
  
      const info={
        user,email,password
      }
      const res = await axios.post('/user/sign-up',info);
        // console.log(res.data);
        if(res.status===201){
          console.log(res.data)
          alert(`${res.data.message}`)
          // window.location.href='http://localhost:3000/user/login'
          window.location.href='/user/login'

  
        }
    }
    catch(err){
      // console.log(err);
      document.body.innerHTML+=`<div class="text-white text-center bg-danger">Error: ${err.response.data.message}</div>`
     
    }

}
