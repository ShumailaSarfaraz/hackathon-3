export interface Category {
    _id: string
    name: string
    slug: string
  }
  
  export interface Dimensions {
    width: string
    height: string
    depth: string
  }
  
  export interface Item {
    _id: string
    name: string
    description: string
    image: string
    features: string[]
    dimensions: Dimensions
    category: Category
    price: number
    quantity: number
  }
  
  export interface User {
    uid: string
    name: string
    email: string
    role: string
  }
  
  