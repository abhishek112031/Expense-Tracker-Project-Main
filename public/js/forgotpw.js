
async function getNewPassword(event) {
    event.preventDefault();


    const email = { email: document.getElementById('userEmail').value }
    document.body.innerHTML += `<h5 id="wait" class="mt-4 fw-bold fst-italic text-center text-primary "> please Wait..</h5>`

    try {

        const resp = await axios.post('http://localhost:3000/password/forgotpassword', email);

        // console.log(resp.data.message);
        document.getElementById("wait").style.visibility = "hidden"
        document.body.innerHTML += `<h5 class="mt-4 fw-bold fst-italic text-center text-dark border border-warning bg-success">${resp.data.message}</h5>`
    }

    catch (err) {
        // console.log(err.response.data.message);
        document.getElementById("wait").style.visibility = "hidden"
        document.body.innerHTML += `<h5 class="mt-4 text-center text-dark border border-warning bg-danger">${err.response.data.message}</h5>`

    }



}


