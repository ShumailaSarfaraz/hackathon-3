import { createClient } from '@sanity/client';
import dotenv from "dotenv"

dotenv.config()
export const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT__ID,
  dataset: 'production',
  apiVersion: '2024-01-04',
  useCdn: true,
  token: process.env.token,
});