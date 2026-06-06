"use client";

import { Star } from "lucide-react";

interface StarRatingProps {
  rating: number; // 0-5
  maxStars?: number;
  size?: number;
  interactive?: boolean;
  onChange?: (rating: number) => void;
}

export function StarRating({
  rating,
  maxStars = 5,
  size = 16,
  interactive = false,
  onChange,
}: StarRatingProps) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: maxStars }, (_, i) => {
        const starValue = i + 1;
        const filled = starValue <= Math.floor(rating);
        const halfFilled = !filled && starValue <= Math.ceil(rating) && rating % 1 >= 0.5;

        return (
          <button
            key={i}
            type="button"
            disabled={!interactive}
            className={`${interactive ? "cursor-pointer hover:scale-110 transition-transform" : "cursor-default"}`}
            onClick={() => interactive && onChange?.(starValue)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && interactive) onChange?.(starValue);
            }}
          >
            <Star
              size={size}
              className={`${
                filled
                  ? "fill-yellow-400 text-yellow-400"
                  : halfFilled
                  ? "fill-yellow-400/50 text-yellow-400"
                  : "text-gray-300"
              }`}
            />
          </button>
        );
      })}
    </div>
  );
}
