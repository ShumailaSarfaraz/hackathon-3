"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Doughnut } from "react-chartjs-2"
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js"

ChartJS.register(ArcElement, Tooltip, Legend)

interface Review {
  rating: number
  comment: string
  date: string
  userId: string
  userName: string
  userEmail: string
}

interface Item {
  _id: string
  name: string
  price: number
  quantity: number
}

interface Order extends Item {
  date: string
}

const ItemPerformance = ({ itemId, itemName }: { itemId: string; itemName: string }) => {
  const [reviews, setReviews] = useState<{ [key: string]: Review[] }>({})
  const [orders, setOrders] = useState<Order[]>([])
  const [cartItems, setCartItems] = useState<Item[]>([])

  useEffect(() => {
    // Fetch data from localStorage
    const allReviews: { [key: string]: Review[] } = {}
    const allOrders: Order[] = []
    const allCartItems: Item[] = []

    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i)
      if (key?.startsWith("reviews_")) {
        const productId = key.split("_")[1]
        allReviews[productId] = JSON.parse(localStorage.getItem(key) || "[]")
      } else if (key?.endsWith("_orders")) {
        allOrders.push(...JSON.parse(localStorage.getItem(key) || "[]"))
      } else if (key?.endsWith("_cart")) {
        allCartItems.push(...JSON.parse(localStorage.getItem(key) || "[]"))
      }
    }

    setReviews(allReviews)
    setOrders(allOrders)
    setCartItems(allCartItems)
  }, [])

  // Aggregate data
  const itemReviews = reviews[itemId] || []
  const totalReviews = itemReviews.length

  const itemOrders = orders.filter((order) => order._id === itemId)
  const totalOrders = itemOrders.length
  const totalRevenue = itemOrders.reduce((sum, order) => sum + order.price * order.quantity, 0)

  const itemCartAdditions = cartItems.filter((item) => item._id === itemId)
  const totalCartAdditions = itemCartAdditions.length

  // Prepare chart data
  const chartData = {
    labels: ["Reviews", "Orders", "Cart Additions"],
    datasets: [
      {
        data: [totalReviews, totalOrders, totalCartAdditions],
        backgroundColor: ["rgba(255, 99, 132, 0.5)", "rgba(54, 162, 235, 0.5)", "rgba(255, 206, 86, 0.5)"],
        borderColor: ["rgba(255, 99, 132, 1)", "rgba(54, 162, 235, 1)", "rgba(255, 206, 86, 1)"],
        borderWidth: 1,
      },
    ],
  }

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: true,
        text: `${itemName} Performance`,
      },
    },
  }

  return (
    <div className="space-y-4 font-sans">
      <Card>
        <CardHeader>
          <CardTitle>Item Performance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <Doughnut options={chartOptions} data={chartData} />
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Performance Metrics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <p className="text-sm font-medium text-gray-500">Total Reviews</p>
              <p className="text-2xl font-semibold">{totalReviews}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Total Orders</p>
              <p className="text-2xl font-semibold">{totalOrders}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Total Revenue</p>
              <p className="text-2xl font-semibold">£{totalRevenue.toFixed(2)}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default ItemPerformance

