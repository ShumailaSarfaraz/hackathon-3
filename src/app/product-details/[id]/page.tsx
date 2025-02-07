"use client"
import React, { useEffect, useState } from "react"
import { Toaster, toast } from "react-hot-toast"
import sanityClient from "@sanity/client"
import { Header } from "@/components/Header"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import PageFooter from "@/components/PageFooter"
import Newsletter from "@/components/Newsletter"
import Link from "next/link"
import { auth } from "../../../../firebase/firebase"
import type { User } from "firebase/auth"
import { ReviewSection } from "@/components/ReviewSection"

const client = sanityClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: "production",
  apiVersion: "2024-01-04",
  useCdn: true,
})

type Dimensions = {
  width: string
  height: string
  depth: string
}

type CategoryRef = {
  _ref: string
  _type: string
}

type Product = {
  _id: string
  name: string
  description: string
  image: string
  features: string[]
  dimensions: Dimensions
  category: CategoryRef
  price: number
  tags: string[]
  quantity: number
}

const getProductById = async (id: string) => {
  return await client.fetch(
    `*[_type == "product" && _id == $id][0] {
      _id,
      name,
      "image": image.asset->url,
      price,
      description,
      features,
      dimensions,
      category,
      tags,
      quantity
    }`,
    { id }
  )
}

const getRelatedProducts = async (categoryId: string, productId: string) => {
  return await client.fetch(
    `*[_type == "product" && category._ref == $categoryId && _id != $productId][0...4] {
      _id,
      name,
      "image": image.asset->url,
      price,
      quantity
    }`,
    { categoryId, productId }
  )
}

export default function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const [productData, setProductData] = useState<Product | null>(null)
  const [relatedItems, setRelatedItems] = useState<Product[]>([])
  const [productId, setProductId] = useState<string | null>(null)
  const [showModal, setShowModal] = useState(false)
  const [currentUser, setCurrentUser] = useState<User | null>(null)

  useEffect(() => {
    const fetchParams = async () => {
      const { id } = await params
      setProductId(id)
    }
    fetchParams()
  }, [params])

  useEffect(() => {
    if (productId) {
      const loadProduct = async () => {
        const data = await getProductById(productId)
        setProductData(data)
        if (data) {
          const related = await getRelatedProducts(data.category._ref, data._id)
          setRelatedItems(related)
        }
      }
      loadProduct()
    }
  }, [productId])

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setCurrentUser(user)
    })
    return () => unsubscribe()
  }, [])

  const handleAddToCart = (item: Product) => {
    if (!currentUser) {
      setShowModal(true)
      return
    }

    const cartKey = `${currentUser.uid}_cart`
    const cart = JSON.parse(localStorage.getItem(cartKey) || "[]")
    const existingItem = cart.find((cartItem: Product) => cartItem._id === item._id)

    if (existingItem) {
      existingItem.quantity += 1
      toast.success(`Increased quantity of ${item.name} to ${existingItem.quantity}`, {
        position: "bottom-right",
      })
    } else {
      cart.push({ ...item, quantity: 1 })
      toast.success(`${item.name} added to cart!`, {
        position: "bottom-right",
      })
    }

    localStorage.setItem(cartKey, JSON.stringify(cart))
  }

  if (!productData) return <div>Loading...</div>

  return (
    <>
      <Toaster />
      <Header />
      <div className="container mx-auto px-4 py-8 font-clash">
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          <div className="bg-gray-100">
            <Image
              src={productData.image || "/placeholder.svg"}
              alt={productData.name}
              width={600}
              height={600}
              className="w-[500px] h-[500px] mx-auto"
            />
          </div>

          <div className="self-start mt-6">
            <h1 className="font-clash text-4xl font-medium mb-2">{productData.name}</h1>
            <p className="text-2xl font-medium mb-6 font-clash">£{productData.price}</p>
            <div className="mb-6">
              <h2 className="font-medium mb-2 font-clash">Description</h2>
              <p className="text-gray-600 font-clash">{productData.description}</p>
            </div>
            <ul className="list-disc list-inside mb-6 text-gray-600 font-clash">
              {productData.features.map((feature, index) => (
                <li key={index}>{feature}</li>
              ))}
            </ul>
            <div className="mb-6">
              <h2 className="font-medium mb-2 font-clash">Dimensions</h2>
              <div className="grid grid-cols-3 gap-4 text-gray-600 font-clash">
                <div>
                  <p className="font-medium font-clash">Height</p>
                  <p>{productData.dimensions.height}</p>
                </div>
                <div>
                  <p className="font-medium font-clash">Width</p>
                  <p>{productData.dimensions.width}</p>
                </div>
                <div>
                  <p className="font-medium font-clash">Depth</p>
                  <p>{productData.dimensions.depth}</p>
                </div>
              </div>
            </div>
            <Button
              onClick={() => handleAddToCart(productData)}
              className="w-auto bg-[#2A254B] hover:bg-[#2A254B]/90 text-white font-clash"
            >
              Add to cart
            </Button>
          </div>
        </div>

        {productData && <ReviewSection productId={productData._id} />}
      </div>
      <Newsletter />
      <PageFooter />

      {!currentUser && showModal && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
          onClick={() => setShowModal(false)}
        >
          <div className="bg-white p-6 w-4/5 max-w-xl relative z-60" onClick={(e) => e.stopPropagation()}>
            <button
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
              onClick={() => setShowModal(false)}
            >
              &times;
            </button>
            <div className="text-center">
              <p className="text-gray-500 mb-4 font-clash">
                Please <strong>Sign In</strong> or <strong>Sign Up</strong> to add this item to your cart.
              </p>
              <Link href="/acc-creation">
                <Button className="rounded-none bg-[#2A254B] px-8 hover:bg-[#2A254B]/90 font-clash">
                  Sign In / Sign Up
                </Button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  )
}