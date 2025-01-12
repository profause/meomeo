export interface OrderItem {
    id?: string
    quantity?: number
    food_name?: string
    food_id?: string
    food_image?: string
    display_image?: string
    total_cost?: number
    status?: string
    created_date?:Date
    description?:string
    user_id?:string
    username?:string
    delivery_location?:string
    softDelete?:boolean
    payment_method?:string
    mobileNumber?:string
    confirmationCode?:string
    checked?:boolean
}
