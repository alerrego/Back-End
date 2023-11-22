const form = document.getElementById('changeForm');

form.addEventListener('submit',e =>{
    e.preventDefault()
    const data = new FormData(form);
    const obj = {};
    data.forEach((value,key) => obj[key] = value);
    fetch('api/sessions/sendMailForgotPassword',{
        method: 'POST',
        body : JSON.stringify(obj),
        headers: {
            'Content-Type':'application/json'
        }
    }).then(res => {
        if(res.status === 200){
            Swal.fire({
                icon: 'success',
                title: 'the email was sent',
              })
            window.location.replace('/login')
        }
        else if(res.status === 404){
            Swal.fire({
                icon: 'error',
                title: 'Incorrect data!',
              })
        }
    })
    form.reset()
})