export interface UserProfile {
  id: string;
  name: string;
  age: number;
  bio: string;
  occupation: string;
  location: string;
  photos: string[];
  interests: string[];
  isVerified: boolean;
  lastSeen: string;
  isPremium: boolean;
  subscriptionStatus: "free" | "premium";
  premiumActivatedAt?: number;
  profilePicUrl?: string;
  coverPicUrl?: string;
}

export interface Match {
  id: string;
  userId: string;
  matchedUserId: string;
  matchedUser: UserProfile;
  matchedAt: string;
  lastMessage?: Message;
  isNew: boolean;
}

export interface Message {
  id: string;
  matchId: string;
  senderId: string;
  content: string;
  sentAt: string;
  isRead: boolean;
}

export interface DiscoveryFilters {
  minAge: number;
  maxAge: number;
  maxDistance: number;
  interests: string[];
  genderPref?: string;
}

export type SwipeAction = "like" | "pass" | "superlike";

export interface SwipeResult {
  action: SwipeAction;
  targetUserId: string;
  isMatch: boolean;
}

export interface PremiumStatus {
  isPremium: boolean;
  subscriptionStatus: string;
  premiumActivatedAt?: number;
}
