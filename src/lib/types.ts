// lib/types.ts

export type Property = {
  id: number
  title: string
  price: number
  address: string
  bedrooms: number
  area: string
  bathrooms: number
  description: string
  image: string
  rating: number
  reviews: number
  sqft: number
}

export type PropertyResponse = {
  data: Property[]
  page: number
  pageSize: number
  total: number
  totalPages: number
}