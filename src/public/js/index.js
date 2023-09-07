const socket = io();

socket.on("productos", (products) => {
    console.log(products);
    updateProductList(products);
  });

// Función para actualizar la lista de productos
const updateProductList = (products) => {
    let div = document.getElementById("list-products");
    let productos = "";
  
    products.forEach((product) => {
      productos += `
    <div class="container">
        <div>
            <h2>${product.title}</h2>
            <div>
              <h3>Descripcion: ${product.description}</h3>
              <h3>Precio: ${product.price}</h3>
              <h3>Stock: ${product.stock}</h3>
              <h3>ID: ${product._id}</h3>
            </div>
        </div>
    </div>`;
    });
  
    div.innerHTML = productos;
  }
  
  let form = document.getElementById("formProduct");
  
  form.addEventListener("submit", (evt) => {
    evt.preventDefault();
  
    let title = form.elements.title.value;
    let description = form.elements.description.value;
    let stock = form.elements.stock.value;
    let thumbnail = form.elements.thumbnail.value;
    let category = form.elements.category.value;
    let price = form.elements.price.value;
    let code = form.elements.code.value;
  
    socket.emit("addProduct", {
      title,
      description,
      stock,
      thumbnail,
      category,
      price,
      code,
    })
  
    form.reset();
  });
  
  document.getElementById("delete-btn").addEventListener("click",() => {
      const deleteidinput = document.getElementById("id-prod");
      const deleteid = parseInt(deleteidinput.value);
      socket.emit("deleteProduct", deleteid);
      deleteidinput.value = "";
    });
  

 socket.on("update", (obj) => {
    updateProductList(obj);
  });
  