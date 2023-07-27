const fs = require('fs')

class ProductManager {
    constructor (path){
        this.path = path
    }
    addProduct = async(title,description,price,thumbnail,code,stock) =>{
            const products = await this.getProducts()
        
            let id = 0
            let length = products.length
            let cod = ""
            
            if( length === 0){
                id = 1
            }else{
                products.forEach((element) => {
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

            products.push(product)

            await fs.promises.writeFile(this.path,JSON.stringify(products)) // REESCRIBO UN NUEVO ARRAY CON EL PRODUCTO AGREGADO

    }
    getProducts = async() =>{
        try{   
            if(fs.existsSync(this.path)){
                const products = await fs.promises.readFile(this.path,'utf-8') //SI EXISTE LO LEO Y RETORNO, SINO ARRAY VACIO
                return (JSON.parse(products))
            }else{
                return []
            }

        }catch(error){
            console.error(error)
        }
        
    }
    getProductById = async(id) => {
        const products = await this.getProducts()
        const proID = products.find((el) => el.id === id) // ME RETORNA LA PRIMER COINCIDENCIA EN FORMA DE OBJ
        if(proID){
            return (proID)
        }else{
            return console.log("Not found in array of products")
        }
    }
    updateProduct = async(id,obj) =>{
        const products = await this.getProducts()
        const indexToUpdate = products.findIndex((el) => el.id === id)
        if(indexToUpdate !== -1){
            products.splice(indexToUpdate,1) //ELIMINO LA POS DEL OBJETO CON EL ID ENCONTRADO
            
            products.push({...obj, id : id}) //PUSHEO EL OBJ, USO EL SPREAD PARA OBTENER LAS PROPIEDADES Y AGREGO EL ID 
            
            await fs.promises.writeFile(this.path,JSON.stringify(products)) // REESCRIBO UN NUEVO ARRAY CON EL PRODUCTO AGREGADO


        }else{
            console.error('ID DOESN´T EXIST')
        }

    }
    deleteProduct = async(id) => {
        const products = await this.getProducts()
        
        const indexToDelete = products.findIndex((el) => el.id === id)

        if(indexToDelete !== -1){
            products.splice(indexToDelete,1) //ELIMINO LA POS DEL OBJETO CON EL ID ENCONTRADO
        
            await fs.promises.writeFile(this.path,JSON.stringify(products)) //ACTUALIZO CON EL ID ELIMINADO}
        }else{
            console.error('ID DOESN´T EXIST')
        }
}}

const ControladorDeProductos = new ProductManager('products.json')


const ejecucion = async() => {

    await ControladorDeProductos.addProduct('Mesa','Mesa de madera',32000,'url','abc123',8)
    await ControladorDeProductos.addProduct('Mesa','Mesa de madera',32000,'url','abc123',8)//REPITO CODE NO AGREGA
    await ControladorDeProductos.addProduct("Televisor","Televisor 42",65000,"url","abc13",17)
    await ControladorDeProductos.addProduct('Ventilador','Ventilador de pie',19000,'url','azs1',11)

    console.log(await ControladorDeProductos.getProductById(1))

    await ControladorDeProductos.updateProduct(1,{title: 'Mouse',description: 'Mouse inalambrico',price: 6500,image: 'url',code: 'asx12',stock: 8})

    console.log(await ControladorDeProductos.getProductById(1))

    await ControladorDeProductos.deleteProduct(1)
    
}

ejecucion()