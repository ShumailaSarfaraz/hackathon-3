"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Bar } from "react-chartjs-2"
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js"

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

interface FeedbackEntry {
  score: number
  feedback: string
  timestamp: string
  userId: string
  userName: string
  userEmail: string
}

interface InventoryItem {
  id: string
  name: string
  cost: number
  stock: number
}

interface SalesRecord extends InventoryItem {
  timestamp: string
}

export function PerformanceDashboard() {
  const [feedbackEntries, setFeedbackEntries] = useState<{ [key: string]: FeedbackEntry[] }>({})
  const [salesRecords, setSalesRecords] = useState<SalesRecord[]>([])
  const [favoriteItems, setFavoriteItems] = useState<InventoryItem[]>([])

  useEffect(() => {
    // Fetch data from localStorage
    const storedFeedback: { [key: string]: FeedbackEntry[] } = {}
    const storedSales: SalesRecord[] = []
    const storedFavorites: InventoryItem[] = []

    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i)
      if (key?.startsWith("feedback_")) {
        const itemId = key.split("_")[1]
        storedFeedback[itemId] = JSON.parse(localStorage.getItem(key) || "[]")
      } else if (key?.endsWith("_sales")) {
        storedSales.push(...JSON.parse(localStorage.getItem(key) || "[]"))
      } else if (key?.endsWith("_favorites")) {
        storedFavorites.push(...JSON.parse(localStorage.getItem(key) || "[]"))
      }
    }

    setFeedbackEntries(storedFeedback)
    setSalesRecords(storedSales)
    setFavoriteItems(storedFavorites)
  }, [])

  const totalFeedback = Object.values(feedbackEntries).flat().length
  const avgScore = Object.values(feedbackEntries)
    .flat()
    .reduce((sum, entry) => sum + entry.score, 0) / totalFeedback || 0
  const totalSales = salesRecords.length
  const totalRevenue = salesRecords.reduce((sum, record) => sum + record.cost * record.stock, 0)
  const totalFavorites = favoriteItems.length

  const itemPerformance = Object.entries(feedbackEntries).map(([itemId, itemFeedback]) => {
    const itemSales = salesRecords.filter((record) => record.id === itemId)
    const itemFavorites = favoriteItems.filter((item) => item.id === itemId)
    return {
      itemId,
      feedbackCount: itemFeedback.length,
      avgScore: itemFeedback.reduce((sum, entry) => sum + entry.score, 0) / itemFeedback.length || 0,
      salesCount: itemSales.length,
      favoriteCount: itemFavorites.length,
    }
  })

  const chartData = {
    labels: itemPerformance.map((p) => p.itemId),
    datasets: [
      {
        label: "Feedback",
        data: itemPerformance.map((p) => p.feedbackCount),
        backgroundColor: "rgba(255, 99, 132, 0.5)",
      },
      {
        label: "Sales",
        data: itemPerformance.map((p) => p.salesCount),
        backgroundColor: "rgba(53, 162, 235, 0.5)",
      },
      {
        label: "Favorites",
        data: itemPerformance.map((p) => p.favoriteCount),
        backgroundColor: "rgba(75, 192, 192, 0.5)",
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
        text: "Item Performance Analysis",
      },
    },
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Performance Analytics</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Total Feedback</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{totalFeedback}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Average Score</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{avgScore.toFixed(1)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Total Sales</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{totalSales}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Total Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">£{totalRevenue.toFixed(2)}</p>
          </CardContent>
        </Card>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Item Performance</CardTitle>
        </CardHeader>
        <CardContent>
          <Bar options={chartOptions} data={chartData} />
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Favorite Items</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-xl font-bold">Total Favorite Items: {totalFavorites}</p>
        </CardContent>
      </Card>
    </div>
  )
}
