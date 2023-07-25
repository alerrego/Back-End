class ProductManager {
    constructor (){
        this.products = []
    }
    addProduct = (title,description,price,thumbnail,code,stock) =>{

        let id = 0
        let length = this.products.length
        let cod = ""
        
        if( length === 0){
            id = 1
        }else{
            this.products.forEach((element) => {
                if(element.id > id){
                    id = element.id // ME QUEDO CON EL ID MAS ALTO ASI SE QUE LUEGO AL AGREGAR 1 NO REPITO LOS VALORES
                }
                if(element.code === code){
                    cod = code
                }
            } )
            id += 1
        }

        if(cod != ""){
            return // SI EL CODIGO SE DUPLICO RETORNO ANTES DE AGREGAR AL PRODUCTO
        }
        
        const product = {title: title,
            description: description,
            price: price,
            thumbnail: thumbnail,
            code: code,
            stock: stock,
            id: id          
        }

       this.products.push(product)
    }
    getProducts = () =>{
        return this.products
    }
    getProductById = (id) => {
        let isFound
        this.products.forEach((product) => {
            isFound = Object.values(product).includes(id)
        })
        if(isFound){
            return console.log("Is on the array") // TAMBIEN SE PODRIA RETORNAR EL OBJETO EN CUESTION
        }else{
            return console.log("Not found in array")
        }
    }
}

let ControladorDeProductos = new ProductManager()

ControladorDeProductos.addProduct('Pollo','Carne de pollo',200,'url','abc123',10)

ControladorDeProductos.addProduct('Tomate','Verdura',120,'url','abc123',7)

ControladorDeProductos.addProduct('Tomate','Verdura',120,'url','abc1',7)

ControladorDeProductos.getProductById(1)

ControladorDeProductos.getProductById(100)




console.log(ControladorDeProductos.getProducts())