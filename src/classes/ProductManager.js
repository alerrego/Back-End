import fs from 'fs'

export default class ProductManager {
    constructor (path){
        this.path = path
    }
    addProduct = async(title,description,price,thumbnail,code,stock) =>{
        try{const products = await this.getProducts()
        
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
        
        }catch(err){
            console.error(error)

        }        
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
        try{const products = await this.getProducts()
            const proID = products.find((el) => el.id === id) // ME RETORNA LA PRIMER COINCIDENCIA EN FORMA DE OBJ
            if(proID){
                return (proID)
            }else{
                return console.log("Not found in array of products")
            }
        }catch(error){
                console.error(error)
        }
    }
    updateProduct = async(id,obj) =>{
        try{const products = await this.getProducts()
            const indexToUpdate = this.getIndexProduct(products,id)
            if(indexToUpdate !== -1){
                products.splice(indexToUpdate,1) //ELIMINO LA POS DEL OBJETO CON EL ID ENCONTRADO
                
                products.push({...obj, id : id}) //PUSHEO EL OBJ, USO EL SPREAD PARA OBTENER LAS PROPIEDADES Y AGREGO EL ID 
                
                await fs.promises.writeFile(this.path,JSON.stringify(products)) // REESCRIBO UN NUEVO ARRAY CON EL PRODUCTO AGREGADO
    
    
            }else{
                console.error('ID DOESN´T EXIST')
            }
        }catch(err){
                console.error(err)
        }

    }
    deleteProduct = async(id) => {
        try{const products = await this.getProducts()
        
            const indexToDelete = this.getIndexProduct(products,id)
    
            if(indexToDelete !== -1){
                products.splice(indexToDelete,1) //ELIMINO LA POS DEL OBJETO CON EL ID ENCONTRADO
            
                await fs.promises.writeFile(this.path,JSON.stringify(products)) //ACTUALIZO CON EL ID ELIMINADO}
            }else{
                console.error('ID DOESN´T EXIST')
            }
        }catch(err){
            console.error(err)
        }
    }
    getIndexProduct = (array,id) => {
        return (array.findIndex((el) => el.id === id))
    }
}

