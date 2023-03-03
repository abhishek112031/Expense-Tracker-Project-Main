
async function saveToDatabase(event) {

  event.preventDefault();

  try {

    const token = localStorage.getItem('token');
    const expenses = {
      expenseAmount: event.target.expenseAmount.value,
      description: event.target.description.value,
      category: event.target.category.value,

    };
    const response = await axios.post('/user/add-daily-expenses', expenses, { headers: { "Authorization": token } });

    if (response.status === 201) {
      event.target.expenseAmount.value = "";
      event.target.description.value = "";
      event.target.category.value = "";
      updatePagination();
      // showLeaderBoard();

      document.getElementById('added').innerHTML += `Expense Added successfully!</h4>`
      setTimeout(() => {
        document.querySelector('#added').innerHTML = '';
      }, 2000);
    }
  }


  catch (err) {
    document.getElementById('er').innerHTML += `Error:${err.response.data.message}`


  }


}
function PremiumUserTitle(premiumUser) {
  document.getElementById('premium').innerHTML = `<h5 class="text-center text-success  bg-warning">Hi ${premiumUser.data.name}, ${premiumUser.data.message}</h5>`
  document.getElementById('rzp-button').style.visibility = "hidden";

}


window.addEventListener('DOMContentLoaded', async () => {
  let token = localStorage.getItem('token');
  try {
    let getResponse = await axios.get("/user/all-expenses", { headers: { "Authorization": token } });
    // console.log(getResponse);
  pagination(getResponse.data.totalNo, 5);
  getResponse.data.allExpenses.forEach((x)=>{
  console.log(x);
    addExpenseToList(x);
  })


    let premiumUser = await axios.get('/premium-user', { headers: { "Authorization": token } });
    // console.log(premiumUser);
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

});

function pagination(totalExpenses, noOfRows){
try{
    const container = document.querySelector('.pagination');
    container.innerHTML = '';
    let noOfPages = Math.floor(totalExpenses/noOfRows);
    if(totalExpenses%noOfRows){
        noOfPages += 1;
    }
    for(let i=1; i <= noOfPages; i++){
        const li = document.createElement('li');
        li.setAttribute('class', 'page-item');

        const a = document.createElement('a');
        a.setAttribute('class', 'page-link');
        a.setAttribute('class', 'btn');

        a.setAttribute("style", "color: #E9E8E8; background-color: #913175; border-color: #CD5888;")
        a.innerHTML = i;

        a.addEventListener('click', async () => {
          
          let token=localStorage.getItem('token');
            const sizeOfPage = document.getElementById('sizeOfPage').value;
            console.log("size of the page==>",sizeOfPage)
            axios.get(`/user/all-expenses/?page=${a.innerHTML}&size=${sizeOfPage}`,{ headers: { "Authorization": token } })
            .then(res => {
              console.log("response---->",res)
                arrayOfLists = res.data.allExpenses;
                document.querySelector('.expenseTableBody').innerHTML = '';
                arrayOfLists.forEach(list => {
                    addExpenseToList(list);
                })
            })
            .catch(err => {
                console.log(err);
            })
        })
        li.appendChild(a);
        container.appendChild(li);
    }
}
catch(err){
    console.log(err);
}
}

function addExpenseToList(expense){
try{
    const tableBody = document.querySelector('.expenseTableBody');
    const tableRow = document.createElement('tr');
    const rowDate = document.createElement('th');
    const rowAmount = document.createElement('th');
    const rowDescription = document.createElement('td');
    const rowCategory = document.createElement('td');
    const rowEdit = document.createElement('td');
    const rowDelete = document.createElement('td');
    rowAmount.setAttribute('scope', 'row');

    rowDate.innerHTML = expense.createdAt.split('T')[0];
    rowAmount.innerHTML = expense.expenseAmount;
    rowDescription.innerHTML = expense.description;
    rowCategory.innerHTML = expense.category;

    const editButton = document.createElement('button');
    editButton.innerHTML = "Edit";
    editButton.setAttribute("class", "btn btn-success btn-sm  edit")
    editButton.setAttribute("data-toggle", "modal")
    editButton.setAttribute("data-target", "#exampleModalCenter")
    rowEdit.appendChild(editButton);

    const deleteButton = document.createElement('a');
    deleteButton.innerHTML = "X";
    deleteButton.setAttribute("class", "btn btn-danger btn-sm  delete");
    rowDelete.appendChild(deleteButton);

    tableBody.appendChild(tableRow);
    tableRow.appendChild(rowDate);
    tableRow.appendChild(rowAmount);
    tableRow.appendChild(rowDescription);
    tableRow.appendChild(rowCategory);
    tableRow.appendChild(rowEdit);
    tableRow.appendChild(rowDelete);

    deleteButton.addEventListener('click', (e) => {
        e.preventDefault();
        deleteExpense(expense.id);
        tableBody.removeChild(tableRow);
    })

    editButton.addEventListener('click', () => {
        document.querySelector('#newAmount').value = expense.amount;
        document.querySelector('#newDescription').value = expense.description;
        document.querySelector('#newCategory').value = expense.category;
        document.querySelector('#id').value = expense.id;
        document.querySelector('#editForm').setAttribute("onsubmit", `editExpense(this, event)`);
    });
}
catch(err){
    console.log(err);
}

}

const sizeOfPage = document.getElementById("sizeOfPage");
sizeOfPage.addEventListener("change", async () => {
try{
    updatePagination();
}
catch(err){
    console.log(err);
}
});

async function getExpenses(noOfRows){
let token=localStorage.getItem('token');
try{
  // console.log('hiii')
    return axios.get(`/user/all-expenses/?page=1&size=${noOfRows}`,{ headers: { "Authorization": token } })
    .then(res => {
      console.log("res in getExpenses--->",res)
        return (res.data);
    })
    .catch(err => console.log(err));
}
catch(err){
    console.log(err);
}
}


async function updatePagination(){
try{
    const noOfRows = parseInt(sizeOfPage.options[sizeOfPage.selectedIndex].value);
    console.log("no of rows===>",noOfRows)
    const expensesList = await getExpenses(noOfRows);
    // console.log("expense list--->",expensesList)
    const expensesArray = expensesList.allExpenses;
    document.querySelector('.expenseTableBody').innerHTML = '';
    expensesArray.forEach(list => {
        addExpenseToList(list);
    })
    pagination(expensesList.totalNo, noOfRows);
}
catch(err){
    console.log(err);
}
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
      document.body.innerHTML += `<h5>${err.response.data.message}<h5/>`

    }
  }

  document.getElementById("leaderBoard").appendChild(inputElem);


}

function showLeaderBoardOnScreen(data) {
  let parentElem = document.getElementById('lboard');
  let childElem = `<li class=" text-center text-primary bg-warning fw-bold mt-2 border border-warning border-2 rounded ">Name: ${data.name} & Total_Expenses: ${data.totalExpenses} ₹ </li>`;
  parentElem.innerHTML += childElem;
}

