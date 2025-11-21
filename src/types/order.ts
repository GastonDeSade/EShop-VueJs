import type { Product } from '@/types/product'
import type { User } from '@/types/auth'

// Product DTO used by API (POST/PUT payloads and list responses wrapper may differ)
export interface ProductDto {
  id?: string
  name?: string
  description?: string
  price?: number
  image?: string | null
  image2?: string | null
  image3?: string | null
  image4?: string | null
}

// Orders
export interface OrderProduct {
  orderId?: string
  productId?: string
  product?: Product
  quantity?: number
}

export interface OrderProductDTO {
  productId?: string
  quantity?: number
}

export interface OrderDto {
  idUser?: string
  orderProducts?: OrderProductDTO[]
}

export interface OrderUpDTO {
  Id: string
  Created: Date
  Modified: Date
  OrderProducts: OrderProductDownDto[]
}
export interface OrderProductDownDto {
  ProductId: string
  Quantity: number
}

export interface Order {
  orderProducts?: OrderProduct[] | null
  user?: User
  id?: string
  created?: Date | null
  modified?: Date | null
}

export interface PaginatedResponse<T> {
  data: T
  page?: number
  pageSize?: number
  total?: number
}

export default {}
