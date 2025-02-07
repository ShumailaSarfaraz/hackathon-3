import { type SchemaTypeDefinition } from 'sanity'
import { Category } from './category'
import { product } from './product'

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [Category, product],
}
