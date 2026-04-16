import { useActor } from "@caffeineai/core-infrastructure";
import { useInternetIdentity } from "@caffeineai/core-infrastructure";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  ExternalBlob,
  Gender,
  SwipeAction as SA,
  createActor,
} from "../backend";
import type { Profile } from "../backend.d";
import type { Match, Message, PremiumStatus, UserProfile } from "../types";

const IS_DEV = import.meta.env.VITE_DEV_MODE === "true";

// ---------------------------------------------------------------------------
// Mock data (only used when VITE_DEV_MODE=true)
// ---------------------------------------------------------------------------
const MOCK_PROFILES: UserProfile[] = [
  {
    id: "1",
    name: "Seraphina",
    age: 28,
    bio: "Passionate about art, architecture, and the finer things. Seeking someone who appreciates depth over surface.",
    occupation: "Architect",
    location: "New York, NY",
    photos: ["/assets/generated/velora-hero-profile.dim_900x1200.jpg"],
    interests: ["Fine Dining", "Opera", "Vintage Wine", "Travel"],
    isVerified: true,
    lastSeen: "2 hours ago",
    isPremium: false,
    subscriptionStatus: "free",
    profilePicUrl:
      "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=400&q=80",
    coverPicUrl:
      "https://images.unsplash.com/photo-1519125323398-675f0ddb6308?w=1200&q=80",
  },
  {
    id: "2",
    name: "Isabelle",
    age: 31,
    bio: "Art curator by day, jazz enthusiast by night. Looking for a partner who values culture and authenticity.",
    occupation: "Art Curator",
    location: "Paris, FR",
    photos: ["/assets/generated/velora-hero-profile.dim_900x1200.jpg"],
    interests: ["Contemporary Art", "Jazz", "French Cuisine", "Yoga"],
    isVerified: true,
    lastSeen: "1 hour ago",
    isPremium: true,
    subscriptionStatus: "premium",
    profilePicUrl:
      "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=400&q=80",
    coverPicUrl:
      "https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=1200&q=80",
  },
  {
    id: "3",
    name: "Valentina",
    age: 26,
    bio: "Founder of a sustainable fashion brand. Believe beauty and ethics can coexist.",
    occupation: "Entrepreneur",
    location: "Milan, IT",
    photos: ["/assets/generated/velora-hero-profile.dim_900x1200.jpg"],
    interests: [
      "Sustainable Fashion",
      "Pilates",
      "Photography",
      "Philanthropy",
    ],
    isVerified: false,
    lastSeen: "3 hours ago",
    isPremium: false,
    subscriptionStatus: "free",
    profilePicUrl:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&q=80",
    coverPicUrl:
      "https://images.unsplash.com/photo-1490750967868-88df5691cc45?w=1200&q=80",
  },
];

const MOCK_MATCHES: Match[] = [
  {
    id: "m1",
    userId: "me",
    matchedUserId: "1",
    matchedUser: MOCK_PROFILES[0],
    matchedAt: "2024-01-10T10:00:00Z",
    lastMessage: {
      id: "msg1",
      matchId: "m1",
      senderId: "me",
      content: "I'd love to hear more about your latest project.",
      sentAt: "2024-01-10T14:23:00Z",
      isRead: true,
    },
    isNew: false,
  },
  {
    id: "m2",
    userId: "me",
    matchedUserId: "2",
    matchedUser: MOCK_PROFILES[1],
    matchedAt: "2024-01-11T08:30:00Z",
    isNew: true,
  },
];

const MOCK_MESSAGES: Message[] = [
  {
    id: "msg1",
    matchId: "m1",
    senderId: "me",
    content: "I'd love to hear more about your latest project.",
    sentAt: "2024-01-10T14:23:00Z",
    isRead: true,
  },
  {
    id: "msg2",
    matchId: "m1",
    senderId: "1",
    content:
      "It's a cultural center in Brooklyn — designing spaces that breathe.",
    sentAt: "2024-01-10T14:45:00Z",
    isRead: true,
  },
  {
    id: "msg3",
    matchId: "m1",
    senderId: "me",
    content: "That sounds extraordinary. Would love to see the sketches.",
    sentAt: "2024-01-10T15:02:00Z",
    isRead: false,
  },
];

const MOCK_PREMIUM_STATUS: PremiumStatus = {
  isPremium: false,
  subscriptionStatus: "free",
  premiumActivatedAt: undefined,
};

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function mapBackendProfile(p: Profile): UserProfile {
  return {
    id: p.principal.toString(),
    name: p.name,
    age: Number(p.age),
    bio: p.bio,
    occupation: "",
    location: p.location,
    photos: p.photoKeys.map((k) => k.getDirectURL()),
    interests: p.interests,
    isVerified: p.isPremium,
    lastSeen: new Date(Number(p.lastSeen) / 1_000_000).toLocaleString(),
    isPremium: p.isPremium,
    subscriptionStatus: p.isPremium ? ("premium" as const) : ("free" as const),
    premiumActivatedAt: p.premiumActivatedAt
      ? Number(p.premiumActivatedAt) / 1_000_000
      : undefined,
  };
}

// ---------------------------------------------------------------------------
// Hooks
// ---------------------------------------------------------------------------

export function useGetCallerUserProfile() {
  const { actor, isFetching: actorFetching } = useActor(createActor);

  const query = useQuery<UserProfile | null>({
    queryKey: ["currentUserProfile"],
    queryFn: async () => {
      if (IS_DEV) {
        // Return a blank profile scaffold in dev mode so the edit form has something to work with
        return {
          id: "me",
          name: "",
          age: 25,
          bio: "",
          occupation: "",
          location: "",
          photos: [],
          interests: [],
          isVerified: false,
          lastSeen: "now",
          isPremium: false,
          subscriptionStatus: "free" as const,
          profilePicUrl: undefined,
          coverPicUrl: undefined,
        };
      }
      if (!actor) return null;
      const profile = await actor.getMyProfile();
      if (!profile) return null;
      return mapBackendProfile(profile);
    },
    enabled: IS_DEV ? true : !!actor && !actorFetching,
    retry: false,
  });

  return {
    ...query,
    isLoading: actorFetching || query.isLoading,
    isFetched: !!actor && query.isFetched,
  };
}

export function useDiscoveryProfiles() {
  const { actor, isFetching: actorFetching } = useActor(createActor);

  return useQuery<UserProfile[]>({
    queryKey: ["discoveryProfiles"],
    queryFn: async () => {
      if (IS_DEV) return MOCK_PROFILES;
      if (!actor) return [];
      const page = await actor.getDiscoveryProfiles(BigInt(0), BigInt(20));
      return page.profiles.map(mapBackendProfile);
    },
    enabled: IS_DEV ? !actorFetching : !!actor && !actorFetching,
    staleTime: 30_000,
  });
}

export function useMatches() {
  const { actor, isFetching: actorFetching } = useActor(createActor);

  return useQuery<Match[]>({
    queryKey: ["matches"],
    queryFn: async () => {
      if (IS_DEV) return MOCK_MATCHES;
      if (!actor) return [];
      const backendMatches = await actor.getMatches();
      // Map backend matches to frontend type — profile data requires separate fetch
      return backendMatches.map((m) => ({
        id: m.matchId,
        userId: m.user1.toString(),
        matchedUserId: m.user2.toString(),
        matchedUser: {
          id: m.user2.toString(),
          name: "Member",
          age: 0,
          bio: "",
          occupation: "",
          location: "",
          photos: [],
          interests: [],
          isVerified: false,
          lastSeen: "",
          isPremium: false,
          subscriptionStatus: "free" as const,
        },
        matchedAt: new Date(Number(m.createdAt) / 1_000_000).toISOString(),
        isNew: false,
      }));
    },
    enabled: IS_DEV ? !actorFetching : !!actor && !actorFetching,
    staleTime: 30_000,
  });
}

export function useMessages(matchId: string) {
  const { actor, isFetching: actorFetching } = useActor(createActor);

  return useQuery<Message[]>({
    queryKey: ["messages", matchId],
    queryFn: async () => {
      if (IS_DEV) return MOCK_MESSAGES.filter((m) => m.matchId === matchId);
      if (!actor) return [];
      const msgs = await actor.getMessages(matchId, BigInt(0), BigInt(100));
      return msgs.map((m) => ({
        id: m.id.toString(),
        matchId: m.matchId,
        senderId: m.sender.toString(),
        content: m.text,
        sentAt: new Date(Number(m.sentAt) / 1_000_000).toISOString(),
        isRead: m.readByRecipient,
      }));
    },
    enabled: IS_DEV
      ? !actorFetching && !!matchId
      : !!actor && !actorFetching && !!matchId,
    refetchInterval: 3000,
  });
}

export function useSendMessage() {
  const queryClient = useQueryClient();
  const { actor } = useActor(createActor);

  return useMutation({
    mutationFn: async ({
      matchId,
      content,
    }: {
      matchId: string;
      content: string;
    }) => {
      if (IS_DEV) {
        const newMsg: Message = {
          id: `msg-${Date.now()}`,
          matchId,
          senderId: "me",
          content,
          sentAt: new Date().toISOString(),
          isRead: false,
        };
        return newMsg;
      }
      if (!actor) throw new Error("Not connected");
      const sent = await actor.sendMessage(matchId, content);
      return {
        id: sent.id.toString(),
        matchId: sent.matchId,
        senderId: sent.sender.toString(),
        content: sent.text,
        sentAt: new Date(Number(sent.sentAt) / 1_000_000).toISOString(),
        isRead: sent.readByRecipient,
      } satisfies Message;
    },
    onSuccess: (newMsg) => {
      queryClient.setQueryData<Message[]>(
        ["messages", newMsg.matchId],
        (old) => [...(old ?? []), newMsg],
      );
    },
  });
}

export function useSwipeAction() {
  const queryClient = useQueryClient();
  const { actor } = useActor(createActor);

  return useMutation({
    mutationFn: async ({
      targetUserId,
      action,
    }: {
      targetUserId: string;
      action: "like" | "pass" | "superlike";
    }) => {
      if (IS_DEV) {
        const isMatch =
          action === "superlike"
            ? true
            : action === "like"
              ? Math.random() > 0.67
              : false;
        return { targetUserId, action, isMatch };
      }
      if (!actor) throw new Error("Not connected");
      // Map frontend action to backend SwipeAction enum
      const backendAction =
        action === "superlike"
          ? SA.superLike
          : action === "like"
            ? SA.like
            : SA.pass;
      const { Principal } = await import("@icp-sdk/core/principal");
      const targetPrincipal = Principal.fromText(targetUserId);
      const result = await actor.recordSwipe(targetPrincipal, backendAction);
      return {
        targetUserId,
        action,
        isMatch: result.matched,
      };
    },
    onSuccess: (result) => {
      queryClient.setQueryData<UserProfile[]>(["discoveryProfiles"], (old) =>
        (old ?? []).filter((p) => p.id !== result.targetUserId),
      );
    },
  });
}

export function useSaveProfile() {
  const queryClient = useQueryClient();
  const { actor } = useActor(createActor);

  return useMutation({
    mutationFn: async (
      profile: Partial<UserProfile> & {
        profilePic?: string;
        coverPic?: string;
      },
    ) => {
      if (IS_DEV) {
        // No-op in dev mode — mock data is in-memory only
        return profile;
      }
      if (!actor) throw new Error("Not connected");

      // Map frontend photos (URL strings) to ExternalBlob instances
      const photoKeys: ExternalBlob[] = (profile.photos ?? []).map((url) =>
        ExternalBlob.fromURL(url),
      );

      // Coerce gender string to enum, default to "other"
      const genderStr = (profile as { gender?: string }).gender ?? "other";
      const genderMap: Record<string, (typeof Gender)[keyof typeof Gender]> = {
        male: Gender.male,
        female: Gender.female,
        nonBinary: Gender.nonBinary,
        other: Gender.other,
      };
      const gender = genderMap[genderStr] ?? Gender.other;

      const genderPrefStr = (profile as { genderPreference?: string })
        .genderPreference;
      const genderPreference = genderPrefStr
        ? (genderMap[genderPrefStr] ?? undefined)
        : undefined;

      const input = {
        name: profile.name ?? "",
        age: BigInt(profile.age ?? 18),
        bio: profile.bio ?? "",
        location: profile.location ?? "",
        interests: profile.interests ?? [],
        photoKeys,
        gender,
        ...(genderPreference !== undefined ? { genderPreference } : {}),
        ...(profile.profilePic !== undefined
          ? { profilePic: profile.profilePic }
          : {}),
        ...(profile.coverPic !== undefined
          ? { coverPic: profile.coverPic }
          : {}),
      };

      // Determine whether to create or update based on whether profile exists
      const existing = await actor.getMyProfile();
      if (existing) {
        await actor.updateProfile(input);
      } else {
        await actor.createProfile(input);
      }

      return profile;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["currentUserProfile"] });
    },
  });
}

export function usePremiumStatus() {
  const { actor, isFetching: actorFetching } = useActor(createActor);

  return useQuery<PremiumStatus>({
    queryKey: ["premiumStatus"],
    queryFn: async () => {
      if (IS_DEV) return MOCK_PREMIUM_STATUS;
      if (!actor) return MOCK_PREMIUM_STATUS;
      const status = await actor.getPremiumStatus();
      return {
        isPremium: status.isPremium,
        subscriptionStatus: status.subscriptionStatus,
        premiumActivatedAt: status.premiumActivatedAt
          ? Number(status.premiumActivatedAt) / 1_000_000
          : undefined,
      };
    },
    enabled: IS_DEV ? true : !!actor && !actorFetching,
    staleTime: 60_000,
  });
}

export function useActivatePremium() {
  const queryClient = useQueryClient();
  const { actor } = useActor(createActor);

  return useMutation({
    mutationFn: async (paymentRef: string): Promise<boolean> => {
      if (IS_DEV) {
        // Simulate activation in dev mode
        await new Promise((r) => setTimeout(r, 800));
        return true;
      }
      if (!actor) throw new Error("Not connected");
      return actor.activatePremium(paymentRef);
    },
    onSuccess: (activated) => {
      if (activated) {
        queryClient.invalidateQueries({ queryKey: ["premiumStatus"] });
        queryClient.invalidateQueries({ queryKey: ["currentUserProfile"] });
      }
    },
  });
}

export function useCurrentIdentity() {
  const { identity } = useInternetIdentity();
  return {
    principal: identity?.getPrincipal().toString() ?? null,
    isAuthenticated: !!identity,
  };
}
