'use client'
import { useState, useEffect } from "react"
import { Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { auth } from "../../firebase/firebase"
import { useRouter } from 'next/navigation'

interface UserReview {
  stars: number
  feedback: string
  timestamp: string
  userId: string
  username: string
  email: string
}

interface ReviewSectionProps {
  productId: string
}

export function ReviewSection({ productId }: ReviewSectionProps) {
  const [selectedStars, setSelectedStars] = useState(0)
  const [feedback, setFeedback] = useState("")
  const [userReviews, setUserReviews] = useState<UserReview[]>([])
  const currentUser = auth.currentUser
  const router = useRouter()

  // Load reviews from localStorage on component mount
  useEffect(() => {
    const savedReviews = localStorage.getItem(`product_reviews_${productId}`)
    if (savedReviews) {
      setUserReviews(JSON.parse(savedReviews))
    }
  }, [productId])

  // Handle star rating selection
  const handleStarClick = (stars: number) => {
    setSelectedStars(stars)
  }

  // Submit a new review
  const submitReview = (e: React.FormEvent) => {
    e.preventDefault()
    if (!currentUser) {
      alert("Please log in to submit a review!")
      return
    }

    const newReview: UserReview = {
      stars: selectedStars,
      feedback,
      timestamp: new Date().toISOString(),
      userId: currentUser.uid,
      username: currentUser.displayName || "Anonymous",
      email: currentUser.email || "No email",
    }

    const updatedReviews = [...userReviews, newReview]
    setUserReviews(updatedReviews)
    localStorage.setItem(`product_reviews_${productId}`, JSON.stringify(updatedReviews))
    setSelectedStars(0)
    setFeedback("")
  }

  // Delete a review
  const deleteReview = (index: number) => {
    const review = userReviews[index]
    if (review.userId !== currentUser?.uid) {
      alert("You can only delete your own reviews!")
      return
    }

    const updatedReviews = userReviews.filter((_, i) => i !== index)
    setUserReviews(updatedReviews)
    localStorage.setItem(`product_reviews_${productId}`, JSON.stringify(updatedReviews))
  }

  // Redirect to the sign-up page
  const redirectToSignUp = () => {
    router.push('/acc-creation')
  }

  return (
    <div className="my-8">
      {currentUser ? (
        <>
          <h2 className="text-3xl font-semibold mb-6">Share Your Thoughts</h2>

          <div className="mb-8">
            <form onSubmit={submitReview} className="space-y-4">
              <div>
                <label className="block mb-2 font-medium">Rate This Product</label>
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`w-6 h-6 cursor-pointer ${star <= selectedStars ? "text-yellow-400 fill-current" : "text-gray-300"}`}
                      onClick={() => handleStarClick(star)}
                    />
                  ))}
                </div>
              </div>
              <div>
                <label htmlFor="feedback" className="block mb-2 font-medium">Your Feedback</label>
                <textarea
                  id="feedback"
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  className="w-full p-2 border rounded"
                  rows={4}
                  required
                />
              </div>
              <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white">
                Submit Feedback
              </Button>
            </form>
          </div>
        </>
      ) : (
        <div className="text-center">
          <p className="text-lg text-gray-500 mb-4">Please log in to leave a review.</p>
          <Button onClick={redirectToSignUp} className="bg-blue-600 hover:bg-blue-700 text-white">
            Log In / Sign Up
          </Button>
        </div>
      )}

      <div>
        <h3 className="text-2xl font-semibold mb-6">Customer Feedback</h3>
        {userReviews.length === 0 ? (
          <p>No reviews yet. Be the first to share your experience!</p>
        ) : (
          userReviews.map((review, index) => (
            <div key={index} className="mb-6 pb-6 border-b last:border-b-0">
              <div className="flex items-center mb-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`w-4 h-4 ${star <= review.stars ? "text-yellow-400 fill-current" : "text-gray-300"}`}
                  />
                ))}
                <span className="ml-2 text-sm text-gray-600">
                  {new Date(review.timestamp).toLocaleDateString()}
                </span>
              </div>
              <p className="mb-2">{review.feedback}</p>
              <p className="text-sm text-gray-500">
                By: {review.username} ({review.email})
              </p>
              {review.userId === currentUser?.uid && (
                <Button
                  onClick={() => deleteReview(index)}
                  className="mt-2 text-red-600 hover:text-red-800 bg-transparent hover:bg-transparent"
                >
                  Remove Review
                </Button>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  )
}