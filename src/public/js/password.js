const form = document.getElementById('passwordForm');

form.addEventListener('submit',e =>{
    e.preventDefault()
    const newPassword = document.getElementById('newPassword').value; //OBTENGO LA NUEVA CONTRASEÑA
    
    const queryString = window.location.search;
    const params = new URLSearchParams(queryString);
    const tokenPassword = params.get('tokenPassword'); //OBTENGO EL QUERY PARAM
    
    fetch('api/sessions/changePassword',{
        method: 'POST',
        headers: {
            'Content-Type':'application/json'
        },
        body : JSON.stringify({newPassword,tokenPassword})
    }).then(res => {
        if(res.status === 200){
            Swal.fire({
                icon: 'success',
                title: 'Your password was changed',
              })
            window.location.replace('/login')
        }
        else{
            Swal.fire({
                icon: 'error',
                title: 'You need a new password',
              })
        }
    })
    form.reset()
})