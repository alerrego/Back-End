
const findUser = document.getElementById('findUserForm')

document.getElementById('findUserForm').addEventListener('submit', function (event) {
    event.preventDefault();
    
    const userId = document.getElementById('findUserInput').value;
    
    const apiUrl = `/api/users/${userId}`;
    
    fetch(apiUrl)
      .then(response => response.json())
      .then(data => {
         if(data.payload){
            Swal.fire({
                icon: 'success',
                title: "User found",
                text: `${data.payload.first_name} ${data.payload.last_name} ${data.payload.email}`
            })
            }
        else{
            Swal.fire({
                icon: 'error',
                title: 'ID not found',
                })
            }
        })
        .catch(error =>{
            console.log(error)
        })
        findUser.reset()
  });

  const toPremium = document.getElementById('toPremiumForm')

  document.getElementById('toPremiumForm').addEventListener('submit', function (event) {
    event.preventDefault();
    
    const userId = document.getElementById('toPremium').value;
    
    const apiUrl = `/api/users/premium/${userId}`;
    
    fetch(apiUrl,{
        method: 'POST',
        headers: {
            'Content-Type':'application/json'
        }
        }).then(response => response.json())
      .then(data => {
         if(data.status == "success"){
            Swal.fire({
                icon: 'success',
                title: "User update to Premium",
            })
            }
        else{
            Swal.fire({
                icon: 'error',
                title: 'You can´t update to Premium',
                text: "Your ID could be incorrect or unverified"
                })
            }
        })
        .catch(error =>{
            console.log(error)
        })
        toPremium.reset()
  });

const toUser = document.getElementById('toUserForm')

document.getElementById('toUserForm').addEventListener('submit', function (event) {
    event.preventDefault();
    
    const userId = document.getElementById('toUser').value;
    
    const apiUrl = `/api/users/user/${userId}`;
    
    fetch(apiUrl,{
        method: 'POST',
        headers: {
            'Content-Type':'application/json'
        }
        }).then(response => response.json())
      .then(data => {
         if(data.status == "success"){
            Swal.fire({
                icon: 'success',
                title: "User update to user role",
            })
            }
        else{
            Swal.fire({
                icon: 'error',
                title: 'You can´t update to Premium',
                text: "the ID could be incorrect"
                })
            }
        })
        .catch(error =>{
            console.log(error)
        })
        toUser.reset()
  });

  const toDelete = document.getElementById('deleteForm')

  document.getElementById('deleteForm').addEventListener('submit', function (event) {
    event.preventDefault();
    
    const userId = document.getElementById('toDelete').value;
    
    const apiUrl = `/api/users/${userId}`;
    
    fetch(apiUrl,{
        method: 'DELETE',
        headers: {
            'Content-Type':'application/json'
        }
        }).then(response => response.json())
      .then(data => {
         if(data.status == "success"){
            Swal.fire({
                icon: 'success',
                title: "User deleted correctly",
            })
            }
        else{
            Swal.fire({
                icon: 'error',
                title: 'You can´t delete user',
                text: "the ID could be incorrect"
                })
            }
        })
        .catch(error =>{
            console.log(error)
        })
        toDelete.reset()
  });

  const btnDelete = document.getElementById('btnDelete')

  btnDelete.addEventListener('click',() =>{
    const apiUrl = `/api/users`;
    
    fetch(apiUrl,{
        method: 'DELETE',
        headers: {
            'Content-Type':'application/json'
        }
        }).then(response => response.json())
      .then(data => {
         if(data.status == "success"){
            Swal.fire({
                icon: 'success',
                title: "Users deleted correctly",
            })
            }
        else{
            Swal.fire({
                icon: 'error',
                title: 'You can´t delete users',
                })
            }
        })
        .catch(error =>{
            console.log(error)
        })
  })