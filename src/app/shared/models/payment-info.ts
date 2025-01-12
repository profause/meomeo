export interface PaymentInfo {
    id?:string
    reference?: string
    status?: string
    amount?: number
    method?: string,
    currency?: string
    transaction_fees?: number
    customer_email?: string
    date?: number
}
