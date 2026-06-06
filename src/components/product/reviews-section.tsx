"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { MessageSquare, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { StarRating } from "./star-rating";
import { toast } from "sonner";

interface Review {
  id: string;
  rating: number;
  title: string | null;
  body: string | null;
  isVerified: boolean;
  createdAt: string;
  user: { name: string | null; image: string | null };
}

interface ReviewsData {
  reviews: Review[];
  averageRating: number;
  totalCount: number;
  distribution: { stars: number; count: number }[];
}

export function ReviewsSection({ productId }: { productId: string }) {
  const { data: session } = useSession();
  const [data, setData] = useState<ReviewsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [rating, setRating] = useState(5);
  const [body, setBody] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);

  async function loadReviews() {
    const res = await fetch(`/api/reviews?productId=${productId}`);
    if (res.ok) setData(await res.json());
    setLoading(false);
  }

  useEffect(() => {
    loadReviews();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productId]);

  async function submitReview() {
    if (!session) {
      toast.error("Please sign in first");
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, rating, body: body || null }),
      });
      if (res.ok) {
        toast.success("Review submitted");
        setShowForm(false);
        setBody("");
        loadReviews();
      } else {
        const err = await res.json();
        toast.error(err.error || "Submission failed");
      }
    } catch {
      toast.error("Submission failed");
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <section className="mt-16">
      <h2 className="font-[family-name:var(--font-heading)] text-[clamp(24px,3vw,36px)] tracking-[-1px] mb-10 text-[#0a0a0a]">Reviews</h2>

      {/* Summary */}
      {data && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
          <div className="flex items-center gap-6">
            <div className="text-center">
              <p className="text-5xl font-bold">{data.averageRating || "—"}</p>
              <StarRating rating={data.averageRating} size={14} />
              <p className="text-sm text-muted-foreground mt-1">{data.totalCount} reviews</p>
            </div>
            <div className="flex-1 space-y-1">
              {data.distribution.reverse().map((d) => (
                <div key={d.stars} className="flex items-center gap-2 text-sm">
                  <span className="w-8 text-right text-muted-foreground">{d.stars} star</span>
                  <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-yellow-400 rounded-full"
                      style={{
                        width: data.totalCount > 0 ? `${(d.count / data.totalCount) * 100}%` : "0%",
                      }}
                    />
                  </div>
                  <span className="w-6 text-muted-foreground">{d.count}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-center border rounded-lg p-6">
            <div className="text-center">
              <p className="text-muted-foreground mb-3">
                {session ? "Share your experience" : "Sign in to leave a review"}
              </p>
              <Button
                variant="outline"
                className="gap-2 rounded-full"
                onClick={() => {
                  if (!session) {
                    window.location.href = "/auth/login";
                    return;
                  }
                  setShowForm(!showForm);
                }}
              >
                <MessageSquare className="h-4 w-4" />
                {showForm ? "Cancel" : "Write a review"}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Review form */}
      {showForm && (
        <div className="border rounded-lg p-6 mb-8 space-y-4">
          <h3 className="font-medium">Write a review</h3>
          <div>
            <Label className="mb-2 block">Rating</Label>
            <StarRating rating={rating} size={24} interactive onChange={setRating} />
          </div>
          <div>
            <Label className="mb-2 block">Your review</Label>
            <Textarea
              placeholder="Tell us how it fits and feels..."
              value={body}
              onChange={(e) => setBody(e.target.value)}
              rows={3}
            />
          </div>
          <Button onClick={submitReview} disabled={submitting} className="rounded-full">
            {submitting && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
            Submit
          </Button>
        </div>
      )}

      {/* Review list */}
      <div className="space-y-4">
        {data?.reviews.map((review) => (
          <div key={review.id} className="border rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="font-medium text-sm">
                  {review.user.name || "Anonymous"}
                </span>
                {review.isVerified && (
                  <Badge variant="secondary" className="text-xs">
                    Verified
                  </Badge>
                )}
              </div>
              <span className="text-xs text-muted-foreground">
                {new Date(review.createdAt).toLocaleDateString("en-GB")}
              </span>
            </div>
            <StarRating rating={review.rating} size={12} />
            {review.body && (
              <p className="text-sm text-muted-foreground mt-2">{review.body}</p>
            )}
          </div>
        ))}
        {data?.reviews.length === 0 && !showForm && (
          <p className="text-center text-muted-foreground py-8">No reviews yet — be the first to share your thoughts</p>
        )}
      </div>
    </section>
  );
}
