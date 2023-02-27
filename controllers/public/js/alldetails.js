

    window.addEventListener('DOMContentLoaded', async() => {
      let token = localStorage.getItem('token');
    
        try {
          let getResponse = await axios.get("/user/all-expenses", { headers: { "Authorization": token } });
          for (let i = 0; i < getResponse.data.length; i++) {

            showExpensesOnScreen(getResponse.data[i]);

          }

       
          let allDownloads=await axios.get("/downloads/all", { headers: { "Authorization": token } })
         
          allDownloads.data.forEach((data)=>{
            showallDownloads(data.url);
          })


        }
        catch (err) {
          console.log(err);
          document.getElementById('dwn').innerHTML += `<p class="rounded fw-bold fst-italic  text-warning ">${err.response.data.message}</p>`


        }

    })
    function showExpensesOnScreen(expense) {
      const parent_node = document.getElementById("exp");
      const child_node = `<li id=${expense.id} class=" List text-center mt-3 ms-2 rounded border border-secondary col-md-6 fw-bold">
  ${expense.description} for ${expense.expenseAmount} ₹ in ${expense.category}</li>`;

      parent_node.innerHTML = parent_node.innerHTML + child_node;

    }

    //download button functionalities:
    document.getElementById('download').onclick= async function(){
     

      try{

        const token=localStorage.getItem('token');
        const resp=await axios.get('/expenses/download',{ headers: { "Authorization": token } });
        if(resp.status===200){
          var a=document.createElement('a');
          a.href=resp.data.fileUrl;
          a.download='myexpense.csv';
          a.click()

        }
        showallDownloads(resp.data.fileUrl)//trial

      }
      catch(err){
        document.body.innerHTML += `<h5 class="text-center text-danger">${err.response.data.message}</h5>`
        // console.log("bucket s3 error====>>",err)

      }

    }

    function showallDownloads(data){
      document.getElementById('dwn').innerHTML+=`<li><a href="${data}">${data}</a></li>`
    }

