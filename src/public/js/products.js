const btn = document.getElementById('logOut');

btn.addEventListener('click',e => {
    e.preventDefault();
    fetch('api/sessions/logOut',{
        method: 'DELETE',
        headers: {
            'Content-Type':'application/json'
        }
    }).then(res => {
        if(res.status === 200){
            window.location.replace('/login')
        }
    })

})