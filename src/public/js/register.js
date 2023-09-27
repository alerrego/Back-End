const form = document.getElementById('registerForm');

form.addEventListener('submit', e =>{
    e.preventDefault()
    const data = new FormData(form);
    const obj = {};
    data.forEach((value,key) => obj[key] = value);
    fetch('api/sessions/register',{
        method: 'POST',
        body : JSON.stringify(obj),
        headers: {
            'Content-Type':'application/json'
        }
    }).then(res => {
        if(res.status === 404){
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Your email is alredy used!',
                footer: '<a href="">Why do I have this issue?</a>'
              })
        }else if(res.status === 200){
            Swal.fire({
                icon: 'success',
                title: 'You have registered!',
                text: 'Welcome!',
                footer: '<a href="">Why do I have this issue?</a>'
              });
            setTimeout(() => {
            window.location.replace('/login')
            }, 2500); 
        }
    })
    form.reset()
})