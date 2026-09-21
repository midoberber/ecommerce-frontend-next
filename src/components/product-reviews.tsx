"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { BadgeCheck, Loader2, MessageSquare, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { StarInput } from "@/components/star-input";
import { StarRating } from "@/components/star-rating";
import { useSession } from "@/components/session-provider";
import { getErrorMessage } from "@/lib/errors";
import { mediaUrl } from "@/lib/media";
import { reviewsApi } from "@/lib/shop-client-api";
import type { MyReviewState, Review } from "@/types/review";

export function ProductReviews({
  productId,
  reviews,
  mine,
}: {
  productId: string;
  reviews: Review[];
  mine: MyReviewState | null;
}) {
  const router = useRouter();
  const user = useSession();
  const [rating, setRating] = useState(mine?.review?.rating ?? 0);
  const [comment, setComment] = useState(mine?.review?.comment ?? "");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const submit = async () => {
    if (rating === 0) {
      toast.error("اختر عدد النجوم أولاً");
      return;
    }

    setIsSubmitting(true);
    try {
      await reviewsApi.submit(productId, { rating, comment: comment.trim() || undefined });
      toast.success(mine?.review ? "تم تحديث تقييمك" : "تم نشر تقييمك");
      router.refresh();
    } catch (err) {
      toast.error(getErrorMessage(err, "تعذّر حفظ التقييم"));
    } finally {
      setIsSubmitting(false);
    }
  };

  const removeReview = async (reviewId: string, isMine: boolean) => {
    try {
      await reviewsApi.remove(reviewId);
      if (isMine) {
        setRating(0);
        setComment("");
      }
      toast.success("تم حذف التقييم");
      router.refresh();
    } catch (err) {
      toast.error(getErrorMessage(err, "تعذّر حذف التقييم"));
    }
  };

  const average = reviews.length
    ? Math.round((reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length) * 10) / 10
    : 0;

  return (
    <section className="mt-12 flex flex-col gap-6">
      <div className="flex items-center justify-between gap-4">
        <h2 className="text-xl font-semibold">التقييمات</h2>
        {reviews.length > 0 && <StarRating value={average} count={reviews.length} size="md" />}
      </div>

      {user && (
        <Card>
          <CardContent className="flex flex-col gap-3">
            <div className="flex items-center justify-between gap-2">
              <p className="font-medium">
                {mine?.review ? "عدّل تقييمك" : "شاركنا رأيك في المنتج"}
              </p>
              {mine?.canReview && (
                <Badge variant="secondary">
                  <BadgeCheck className="size-3" />
                  مشترٍ موثّق
                </Badge>
              )}
            </div>

            <StarInput value={rating} onChange={setRating} />

            <Textarea
              rows={3}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="اكتب تجربتك مع المنتج (اختياري)"
            />

            <div className="flex gap-2">
              <Button onClick={submit} disabled={isSubmitting} className="self-start">
                {isSubmitting && <Loader2 className="animate-spin" />}
                {mine?.review ? "تحديث التقييم" : "نشر التقييم"}
              </Button>
              {mine?.review && (
                <Button
                  variant="ghost"
                  className="text-destructive"
                  onClick={() => removeReview(mine.review!.id, true)}
                >
                  <Trash2 />
                  حذف تقييمي
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {reviews.length === 0 ? (
        <div className="flex flex-col items-center gap-2 rounded-xl border border-dashed py-12 text-center">
          <MessageSquare className="size-8 text-muted-foreground" />
          <p className="font-medium">لا توجد تقييمات بعد</p>
          <p className="text-sm text-muted-foreground">كن أول من يقيّم هذا المنتج.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {reviews.map((review) => (
            <div key={review.id} className="flex flex-col gap-2">
              <div className="flex items-start gap-3">
                <Avatar className="size-9">
                  {review.userAvatar && (
                    <AvatarImage src={mediaUrl(review.userAvatar)!} alt={review.userName} />
                  )}
                  <AvatarFallback>{review.userName.slice(0, 1).toUpperCase()}</AvatarFallback>
                </Avatar>

                <div className="flex flex-1 flex-col gap-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-medium">{review.userName}</span>
                    {review.verifiedPurchase && (
                      <Badge variant="secondary" className="text-[10px]">
                        <BadgeCheck className="size-3" />
                        مشترٍ موثّق
                      </Badge>
                    )}
                    <span className="text-xs text-muted-foreground">
                      {new Date(review.createdAt).toLocaleDateString("ar-EG")}
                    </span>
                  </div>
                  <StarRating value={review.rating} />
                  {review.comment && (
                    <p className="text-sm leading-6 text-muted-foreground">{review.comment}</p>
                  )}
                </div>

                {user?.role === "admin" && review.userId !== user.id && (
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    className="text-destructive"
                    onClick={() => removeReview(review.id, false)}
                    aria-label="حذف التقييم"
                  >
                    <Trash2 />
                  </Button>
                )}
              </div>
              <Separator />
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
