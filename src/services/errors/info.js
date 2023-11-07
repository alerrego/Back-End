export const createProductErrorInfo = (product) =>{
    return `One or more propeties were incomplete or not valid.
    Lis of requires:
    *title: needs to be a String, received ${product.title}
    *description: needs to be a String, received ${product.description}
    *code: needs to be a String, received ${product.code}
    *price: needs to be a Number, received ${product.price}
    *stock: needs to be a Number, received ${product.stock}
    *category: needs to be a String, received ${product.category}
    *thumbnails: needs to be a Array, received ${product.thumbnails}`
}

export const getProductErrorInfo = (id) =>{
    return `The search for the product with ID ${id} has not been successful since a product with that ID was not found`
}

export const addProductErrorInfo = (cID,pID) =>{
    return `The search for the product with ID ${pID} or cart with ID ${cID} are incorrect`
}