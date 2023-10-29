export default class UserDTO{
    constructor(user){
        this.full_name = `${user.first_name} ${user.last_name}`
        this.first_name = user.first_name,
        this.last_name = user.last_name,
        this.email = user.email,
        this.role = user.role,
        this.active = true,
        this.phone = user.phone?user.phone.split('-').join(''):""//LE SACO LOS - SEPARADORES AL NRO DE TELEFONO
        this.cartID = user.cartID
    }
}