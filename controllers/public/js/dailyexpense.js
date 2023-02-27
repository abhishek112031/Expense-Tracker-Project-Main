

    function saveToDatabase(event) {
      event.preventDefault();

      const token = localStorage.getItem('token');
      const expenses = {
        expenseAmount: event.target.expenseAmount.value,
        description: event.target.description.value,
        category: event.target.category.value,

      };


      axios.post('/user/add-daily-expenses', expenses, { headers: { "Authorization": token } })
        .then((response) => {

          showExpensesOnScreen(response.data);
        })
        .catch((err) => {
          document.getElementById('er').innerHTML+=`Error:${err.response.data.message}`
       

        })


    }
    function PremiumUserTitle(premiumUser) {
      document.getElementById('premium').innerHTML = `<h5 class="text-center text-success  bg-warning">Hi ${premiumUser.data.name}, ${premiumUser.data.message}</h5>`
      document.getElementById('rzp-button').style.visibility = "hidden";




    }


    window.addEventListener('DOMContentLoaded', async() => {
      let token = localStorage.getItem('token');
      // async function get() {
        try {
          let getResponse = await axios.get("/user/all-expenses", { headers: { "Authorization": token } });
          DisplayList(getResponse.data, list_element, rows, current_page);
          SetupPagination(getResponse.data, pagination_element, rows);

          let premiumUser = await axios.get('/premium-user', { headers: { "Authorization": token } });
          console.log(premiumUser);
          if (premiumUser.status === 200) {
            PremiumUserTitle(premiumUser);
            showLeaderBoard();

          }
          else {
            document.getElementById('details').style.visibility = "hidden"
          }

        }
        catch (err) {
          document.body.innerHTML += `<h5 class="text-center">1st ON REFRESH:something went wrong::ref${err}</h5>`


        }

      // }
      // get();


    });
    function showExpensesOnScreen(item) {


      document.getElementById("expenseAmount").value = "";
      document.getElementById("description").value = "";
      document.getElementById("category").value = "";



      let child = `<li id=${item.id} class="mt-2 border border-warning rounded bg-light">${item.expenseAmount}---${item.description}--${item.category}<button class="btn btn-outline-danger ms-5" onclick=deleteExpense('${item.id}')>Delete</button></li>`
      // item_element.innerText=item;


      document.getElementById('list').innerHTML += child;

    }
    async function deleteExpense(expId) {
      const token = localStorage.getItem('token');
      if (confirm(`Are you sure to delete this Expense?`) === true) {
        // async function deleted() {
          try {
            let res = await axios.delete(`/user/expenses/delete/${expId}`, { headers: { "Authorization": token } })
            removeFromScreen(expId);
          }
          catch (err) {
            document.body.innerHTML += `<h3 class="text-center">1st ON delete:something went wrong::ref${err}</h3>`

          }

        


      }

    }
    function removeFromScreen(expId) {
      const parent = document.getElementById("list");
      const child = document.getElementById(expId);
      if (child) {
        parent.removeChild(child);


      }
    }



    //for razorpay:--->
    document.getElementById('rzp-button').onclick = async function (e) {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('/user/purchase/premium-membership', { headers: { "Authorization": token } });

        var options = {
          "key": response.data.key_id,
          "order_id": response.data.order.id,
          //this handler function handle payment success
          "handler": async function (response) {

            await axios.post('/user/purchase/updateTrasactionStatus', {
              order_id: options.order_id,
              payment_id: response.razorpay_payment_id
            },
              {
                headers: { "Authorization": token }

              });

            alert('you are a premium user now!');
            showLeaderBoard()


            document.getElementById('premium').innerHTML = `<h5 class="text-center text-success bg-warning">You are A Premium User</h5>`
            document.getElementById('rzp-button').style.visibility = "hidden";


          }

        }

        const rzp1 = new Razorpay(options);
        rzp1.open();
        e.preventDefault();
        rzp1.on('payment.failed', async function (response) {
          try {
            await axios.post('/user/purchase/updateTrasactionStatusFailed', {
              order_id: options.order_id,
              payment_id: response.razorpay_payment_id
            },
              {
                headers: { "Authorization": token }

              });

            alert('something went wrong')
          }
          catch (err) {

          }
        })
      }
      catch (err) {
        console.log(err.response.data.message);
        document.body.innerHTML += `<h5 class="text-center text-danger">Error:${err.response.data.message}</h5>`
      }

    }

    //for leader-board:-->
    function showLeaderBoard() {
      const inputElem = document.createElement("input");
      inputElem.type = "button";
      // inputElem.className="btn"
      inputElem.value = 'Show Leader Board:';

      inputElem.onclick = async function () {
        try {
          const token = localStorage.getItem('token');
          let resp = await axios.get('/premium/leader-board', { headers: { "Authorization": token } })
          // console.log("leader board----->>>", resp.data);

          resp.data.forEach(data => {
            console.log(data);
            showLeaderBoardOnScreen(data);
          })

        }
        catch (err) {
          document.body.innerHTML+=`<h5>${err.response.data.message}<h5/>`

        }
      }

      document.getElementById("leaderBoard").appendChild(inputElem);


    }

    function showLeaderBoardOnScreen(data) {
      let parentElem = document.getElementById('lboard');
      let childElem = `<li class=" text-center text-primary bg-warning fw-bold mt-2 border border-warning border-2 rounded ">Name: ${data.name} & Total_Expenses: ${data.totalExpenses} ₹ </li>`;
      parentElem.innerHTML += childElem;
    }

    //pagination:
    const list_element = document.getElementById('list');
    const pagination_element = document.getElementById('pagination');

    let current_page = 1;
    // let rows = parseInt(prompt("enter row per page"));//dynamic pagination
    let rows = 5;


    function DisplayList(items, wrapper, rows_per_page, page) {
      wrapper.innerHTML = "";
      page--;

      let start = rows_per_page * page;//starting index
      let end = start + rows_per_page;//ending index+1
      let paginatedItems = items.slice(start, end);//list 0f items per page

      for (let i = 0; i < paginatedItems.length; i++) {
        let item = paginatedItems[i];//each item
        showExpensesOnScreen(item)



        //<div class="item">item</div>//item=each item
        // let child =`<li id=${item.id}>${item.amount}---${item.description}---${item.category}</li>`
        // item_element.innerText=item;


        // wrapper.appendChild(child);
        // wrapper.innerHTML+=child;
      }
    }

    function SetupPagination(items, wrapper, rows_per_page) {
      wrapper.innerHTML = "";

      let page_count = Math.ceil(items.length / rows_per_page);//no of page/buttons
      for (let i = 1; i < page_count + 1; i++) {
        let btn = PaginationButton(i, items);
        wrapper.appendChild(btn);
      }
    }

    function PaginationButton(page, items) {
      let button = document.createElement('button');
      button.innerText = page;//ex-1,2,3,4...

      if (current_page == page) button.classList.add('active');

      button.addEventListener('click', async function () {
        const token = localStorage.getItem('token');
        const resp = await axios.get('/user/all-expenses', { headers: { "Authorization": token } })
        current_page = page;
        DisplayList(resp.data, list_element, rows, current_page);

        let current_btn = document.querySelector('.pagenumbers button.active');
        current_btn.classList.remove('active');

        button.classList.add('active');
      });

      return button;
    }



