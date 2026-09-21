export interface Review {
  id: string;
  rating: number;
  comment: string | null;
  createdAt: string;
  userId: string;
  userName: string;
  userAvatar: string | null;
  verifiedPurchase: boolean;
}

export interface MyReview {
  id: string;
  productId: string;
  userId: string;
  rating: number;
  comment: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface MyReviewState {
  review: MyReview | null;
  canReview: boolean;
}

export interface CreateReviewPayload {
  rating: number;
  comment?: string;
}
