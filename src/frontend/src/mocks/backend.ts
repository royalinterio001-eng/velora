import type { backendInterface } from "../backend.d";
import { Gender, SwipeAction, UserRole } from "../backend";

// Mock Principal-like object
const makePrincipal = (id: string) => ({ toText: () => id, toString: () => id, toUint8Array: () => new Uint8Array(), compareTo: () => 'eq' as const, isAnonymous: () => false, _isPrincipal: true }) as any;

const mockUserId1 = makePrincipal("rdmx6-jaaaa-aaaaa-aaadq-cai");
const mockUserId2 = makePrincipal("rrkah-fqaaa-aaaaa-aaaaq-cai");
const mockUserId3 = makePrincipal("r7inp-6aaaa-aaaaa-aaabq-cai");

const makePhotoBlob = (url: string) => ({
  getDirectURL: () => url,
  getBytes: async () => new Uint8Array(),
  withUploadProgress: function() { return this; },
} as any);

const PHOTO_URLS = [
  "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=600&q=80",
  "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=600&q=80",
  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&q=80",
  "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=600&q=80",
  "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=600&q=80",
];

const COVER_URLS = [
  "https://images.unsplash.com/photo-1519125323398-675f0ddb6308?w=1200&q=80",
  "https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=1200&q=80",
  "https://images.unsplash.com/photo-1490750967868-88df5691cc45?w=1200&q=80",
];

const mockFilters = {
  interests: ["Travel", "Photography"],
  minAge: BigInt(22),
  maxAge: BigInt(35),
  genderPref: Gender.female,
};

const mockProfiles = [
  {
    age: BigInt(26),
    bio: "Adventure seeker & coffee addict. Looking for someone to explore hidden gems with 🌍",
    height: BigInt(168),
    filters: mockFilters,
    photoKeys: [makePhotoBlob(PHOTO_URLS[0]), makePhotoBlob(PHOTO_URLS[1])],
    principal: mockUserId1,
    interests: ["Travel", "Photography", "Yoga", "Art"],
    isPremium: false,
    subscriptionStatus: "free",
    premiumActivatedAt: undefined,
    name: "Sophia Laurent",
    createdAt: BigInt(Date.now() - 86400000),
    superLikesRemaining: BigInt(3),
    genderPreference: Gender.male,
    gender: Gender.female,
    profileComplete: true,
    lastSeen: BigInt(Date.now() - 3600000),
    location: "Paris, France",
    profilePicUrl: PHOTO_URLS[0],
    coverPicUrl: COVER_URLS[0],
  },
  {
    age: BigInt(29),
    bio: "Model, traveler and bookworm. Fluent in 3 languages — let's find our fourth ✨",
    height: BigInt(172),
    filters: mockFilters,
    photoKeys: [makePhotoBlob(PHOTO_URLS[2]), makePhotoBlob(PHOTO_URLS[3])],
    principal: mockUserId2,
    interests: ["Books", "Languages", "Fashion", "Hiking"],
    isPremium: true,
    subscriptionStatus: "premium",
    premiumActivatedAt: BigInt(Date.now() - 604800000),
    name: "Isabella Chen",
    createdAt: BigInt(Date.now() - 172800000),
    superLikesRemaining: BigInt(5),
    genderPreference: Gender.male,
    gender: Gender.female,
    profileComplete: true,
    lastSeen: BigInt(Date.now() - 7200000),
    location: "New York, USA",
    profilePicUrl: PHOTO_URLS[2],
    coverPicUrl: COVER_URLS[1],
  },
  {
    age: BigInt(24),
    bio: "Dancer. Free spirit. Sunset chaser 🌅 Ask me about my last adventure.",
    height: BigInt(165),
    filters: mockFilters,
    photoKeys: [makePhotoBlob(PHOTO_URLS[4])],
    principal: mockUserId3,
    interests: ["Dancing", "Music", "Fitness", "Travel"],
    isPremium: false,
    subscriptionStatus: "free",
    premiumActivatedAt: undefined,
    name: "Mia Rossi",
    createdAt: BigInt(Date.now() - 259200000),
    superLikesRemaining: BigInt(3),
    genderPreference: Gender.male,
    gender: Gender.female,
    profileComplete: true,
    lastSeen: BigInt(Date.now() - 1800000),
    location: "Milan, Italy",
    profilePicUrl: PHOTO_URLS[4],
    coverPicUrl: COVER_URLS[2],
  },
];

const mockMatches = [
  {
    createdAt: BigInt(Date.now() - 3600000),
    matchId: "match-1",
    user1: mockUserId1,
    user2: mockUserId2,
    superLiked: false,
  },
  {
    createdAt: BigInt(Date.now() - 86400000),
    matchId: "match-2",
    user1: mockUserId1,
    user2: mockUserId3,
    superLiked: true,
  },
];

const mockMessages = [
  {
    id: BigInt(1),
    text: "Hey! I love your travel photos 😍",
    readByRecipient: true,
    sender: mockUserId2,
    sentAt: BigInt(Date.now() - 7200000),
    matchId: "match-1",
  },
  {
    id: BigInt(2),
    text: "Thank you! Just got back from Bali 🌴",
    readByRecipient: true,
    sender: mockUserId1,
    sentAt: BigInt(Date.now() - 6000000),
    matchId: "match-1",
  },
  {
    id: BigInt(3),
    text: "That sounds amazing! Would love to hear all about it ✨",
    readByRecipient: false,
    sender: mockUserId2,
    sentAt: BigInt(Date.now() - 3600000),
    matchId: "match-1",
  },
];

export const mockBackend: backendInterface = {
  assignCallerUserRole: async () => undefined,
  createProfile: async () => undefined,
  getCallerUserRole: async () => UserRole.user,
  getDiscoveryProfiles: async (offset, limit) => ({
    profiles: mockProfiles.slice(Number(offset), Number(offset) + Number(limit)),
    nextOffset: undefined,
  }),
  getFilters: async () => mockFilters,
  getMatch: async () => mockMatches[0],
  getMatches: async () => mockMatches,
  getMessages: async (matchId) => mockMessages.filter(m => m.matchId === matchId),
  getMyProfile: async () => ({
    age: BigInt(28),
    bio: "Living life to the fullest. Premium taste, great vibes 🔥",
    height: BigInt(180),
    filters: mockFilters,
    photoKeys: [makePhotoBlob(PHOTO_URLS[0])],
    principal: mockUserId1,
    interests: ["Travel", "Wine", "Art", "Fitness"],
    isPremium: false,
    subscriptionStatus: "free",
    premiumActivatedAt: undefined,
    name: "Alex Mercer",
    createdAt: BigInt(Date.now() - 604800000),
    superLikesRemaining: BigInt(3),
    genderPreference: Gender.female,
    gender: Gender.male,
    profileComplete: true,
    lastSeen: BigInt(Date.now()),
    location: "London, UK",
    profilePicUrl: PHOTO_URLS[0],
    coverPicUrl: COVER_URLS[0],
  }),
  getProfile: async () => mockProfiles[0],
  isCallerAdmin: async () => false,
  markMessagesRead: async () => undefined,
  recordSwipe: async () => ({ matched: false }),
  saveFilters: async () => undefined,
  sendMessage: async (matchId, text) => ({
    id: BigInt(Date.now()),
    text,
    readByRecipient: false,
    sender: mockUserId1,
    sentAt: BigInt(Date.now()),
    matchId,
  }),
  updateProfile: async () => undefined,
  activatePremium: async (_paymentRef: string) => true,
  getPremiumStatus: async () => ({
    isPremium: false,
    subscriptionStatus: "free",
    premiumActivatedAt: undefined,
  }),
};
