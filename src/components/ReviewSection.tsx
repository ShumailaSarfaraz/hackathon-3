'use client'
import { useState, useEffect } from "react"
import { Star, MessageSquare, Trash2, UserCircle, ChevronDown, ChevronUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { auth } from "../../firebase/firebase"
import { useRouter } from 'next/navigation'

interface Review {
  rating: number
  comment: string
  date: string
  userId: string
  userName: string
  userEmail: string
}

interface RatingsAndReviewsProps {
  productId: string
}

export function ReviewSection({ productId }: RatingsAndReviewsProps) {
  const [rating, setRating] = useState(0)
  const [comment, setComment] = useState("")
  const [reviews, setReviews] = useState<Review[]>([])
  const [showReviewForm, setShowReviewForm] = useState(false)
  const [hoveredRating, setHoveredRating] = useState(0)
  const [sortBy, setSortBy] = useState<'newest' | 'highest' | 'lowest'>('newest')
  const user = auth.currentUser
  const router = useRouter()

  useEffect(() => {
    const storedReviews = localStorage.getItem(`reviews_${productId}`)
    if (storedReviews) {
      setReviews(JSON.parse(storedReviews))
    }
  }, [productId])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) {
      alert("You must be logged in to submit a review!")
      return
    }

    const newReview: Review = {
      rating,
      comment,
      date: new Date().toISOString(),
      userId: user.uid,
      userName: user.displayName || "Anonymous",
      userEmail: user.email || "No email",
    }

    const updatedReviews = [...reviews, newReview]
    setReviews(updatedReviews)
    localStorage.setItem(`reviews_${productId}`, JSON.stringify(updatedReviews))
    setRating(0)
    setComment("")
    setShowReviewForm(false)
  }

  const handleDeleteReview = (index: number) => {
    const reviewToDelete = reviews[index]
    if (reviewToDelete.userId !== user?.uid) {
      alert("You can only delete your own reviews!")
      return
    }

    const updatedReviews = reviews.filter((_, i) => i !== index)
    setReviews(updatedReviews)
    localStorage.setItem(`reviews_${productId}`, JSON.stringify(updatedReviews))
  }

  const sortedReviews = [...reviews].sort((a, b) => {
    switch (sortBy) {
      case 'newest':
        return new Date(b.date).getTime() - new Date(a.date).getTime()
      case 'highest':
        return b.rating - a.rating
      case 'lowest':
        return a.rating - b.rating
      default:
        return 0
    }
  })

  const averageRating = reviews.length 
    ? (reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length).toFixed(1)
    : '0.0'

  return (
    <div className="font-clash">
      <div className="bg-[#2A254B] text-white p-8 rounded-2xl mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-4xl font-medium mb-2">{averageRating}</h2>
            <div className="flex items-center gap-1 mb-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`w-4 h-4 ${
                    star <= Number(averageRating) ? "fill-white" : "text-white/30"
                  }`}
                />
              ))}
            </div>
            <p className="text-white/70">{reviews.length} reviews</p>
          </div>
          {user && (
            <Button
              onClick={() => setShowReviewForm(!showReviewForm)}
              className="bg-white text-[#2A254B] hover:bg-white/90"
            >
              <MessageSquare className="w-4 h-4 mr-2" />
              Write a Review
            </Button>
          )}
        </div>
      </div>

      {showReviewForm && user && (
        <div className="bg-white border border-[#2A254B]/10 rounded-2xl p-6 mb-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block mb-3 text-sm text-[#2A254B]/70">Rating</label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    type="button"
                    key={star}
                    onMouseEnter={() => setHoveredRating(star)}
                    onMouseLeave={() => setHoveredRating(0)}
                    onClick={() => setRating(star)}
                    className="p-2 hover:bg-[#2A254B]/5 rounded-lg transition-colors"
                  >
                    <Star
                      className={`w-6 h-6 ${
                        star <= (hoveredRating || rating)
                          ? "text-[#2A254B] fill-current"
                          : "text-[#2A254B]/20"
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block mb-3 text-sm text-[#2A254B]/70">Review</label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="w-full p-4 border border-[#2A254B]/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2A254B]/20"
                rows={4}
                placeholder="Share your thoughts about the product..."
                required
              />
            </div>
            <div className="flex justify-end gap-3">
              <Button
                type="button"
                onClick={() => setShowReviewForm(false)}
                className="bg-transparent text-[#2A254B] hover:bg-[#2A254B]/5"
              >
                Cancel
              </Button>
              <Button type="submit" className="bg-[#2A254B] hover:bg-[#2A254B]/90">
                Post Review
              </Button>
            </div>
          </form>
        </div>
      )}

      {!user && (
        <div className="bg-white border border-[#2A254B]/10 rounded-2xl p-8 text-center mb-8">
          <UserCircle className="w-12 h-12 text-[#2A254B]/20 mx-auto mb-4" />
          <h3 className="text-xl font-medium text-[#2A254B] mb-2">Sign in to write a review</h3>
          <p className="text-[#2A254B]/60 mb-6">Share your experience with other customers</p>
          <Button
            onClick={() => router.push('/user-creation')}
            className="bg-[#2A254B] hover:bg-[#2A254B]/90"
          >
            Sign In / Sign Up
          </Button>
        </div>
      )}

      <div className="bg-white border border-[#2A254B]/10 rounded-2xl p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-medium text-[#2A254B]">Customer Reviews</h3>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as 'newest' | 'highest' | 'lowest')}
            className="p-2 border border-[#2A254B]/10 rounded-lg text-sm"
          >
            <option value="newest">Most Recent</option>
            <option value="highest">Highest Rated</option>
            <option value="lowest">Lowest Rated</option>
          </select>
        </div>

        <div className="space-y-6">
          {sortedReviews.length === 0 ? (
            <div className="text-center py-8 text-[#2A254B]/60">
              No reviews yet. Be the first to share your thoughts!
            </div>
          ) : (
            sortedReviews.map((review, index) => (
              <div
                key={index}
                className="border-b border-[#2A254B]/10 last:border-0 pb-6 last:pb-0"
              >
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <p className="font-medium text-[#2A254B] mb-1">{review.userName}</p>
                    <div className="flex items-center gap-2">
                      <div className="flex">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`w-4 h-4 ${
                              star <= review.rating
                                ? "text-[#2A254B] fill-current"
                                : "text-[#2A254B]/20"
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-sm text-[#2A254B]/60">
                        {new Date(review.date).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  {review.userId === user?.uid && (
                    <Button
                      onClick={() => handleDeleteReview(index)}
                      className="text-red-500 hover:text-red-600 p-2 hover:bg-red-50 rounded-lg"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  )}
                </div>
                <p className="text-[#2A254B]/80">{review.comment}</p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}