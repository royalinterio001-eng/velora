import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export class ExternalBlob {
    getBytes(): Promise<Uint8Array<ArrayBuffer>>;
    getDirectURL(): string;
    static fromURL(url: string): ExternalBlob;
    static fromBytes(blob: Uint8Array<ArrayBuffer>): ExternalBlob;
    withUploadProgress(onProgress: (percentage: number) => void): ExternalBlob;
}
export type Timestamp = bigint;
export interface Match {
    createdAt: Timestamp;
    matchId: MatchId;
    user1: UserId;
    user2: UserId;
    superLiked: boolean;
}
export interface Profile {
    age: bigint;
    bio: string;
    height?: bigint;
    filters: DiscoveryFilters;
    photoKeys: Array<ExternalBlob>;
    profilePicUrl?: string;
    principal: UserId;
    interests: Array<string>;
    isPremium: boolean;
    coverPicUrl?: string;
    premiumActivatedAt?: bigint;
    name: string;
    createdAt: Timestamp;
    superLikesRemaining: bigint;
    isDemo: boolean;
    subscriptionStatus: string;
    genderPreference?: Gender;
    gender: Gender;
    profileComplete: boolean;
    lastSeen: Timestamp;
    location: string;
}
export type MatchId = string;
export interface DiscoveryPage {
    nextOffset?: bigint;
    profiles: Array<Profile>;
}
export type UserId = Principal;
export interface DiscoveryFilters {
    interests: Array<string>;
    minAge: bigint;
    genderPref?: Gender;
    maxAge: bigint;
}
export type MessageId = bigint;
export interface Message {
    id: MessageId;
    text: string;
    readByRecipient: boolean;
    sender: UserId;
    sentAt: Timestamp;
    matchId: MatchId;
}
export interface ProfileInput {
    age: bigint;
    bio: string;
    height?: bigint;
    photoKeys: Array<ExternalBlob>;
    interests: Array<string>;
    name: string;
    genderPreference?: Gender;
    gender: Gender;
    coverPic?: string;
    profilePic?: string;
    location: string;
}
export enum Gender {
    other = "other",
    female = "female",
    male = "male",
    nonBinary = "nonBinary"
}
export enum SwipeAction {
    like = "like",
    pass = "pass",
    superLike = "superLike"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    activatePremium(paymentRef: string): Promise<boolean>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    createProfile(input: ProfileInput): Promise<void>;
    getCallerUserRole(): Promise<UserRole>;
    getDemoProfile(demoKey: string): Promise<Profile | null>;
    getDemoProfileCount(): Promise<bigint>;
    getDiscoveryProfiles(offset: bigint, limit: bigint): Promise<DiscoveryPage>;
    getFilters(): Promise<DiscoveryFilters | null>;
    getMatch(targetPrincipal: UserId): Promise<Match | null>;
    getMatches(): Promise<Array<Match>>;
    getMessages(matchId: MatchId, offset: bigint, limit: bigint): Promise<Array<Message>>;
    getMyProfile(): Promise<Profile | null>;
    getPremiumStatus(): Promise<{
        isPremium: boolean;
        premiumActivatedAt?: bigint;
        subscriptionStatus: string;
    }>;
    getProfile(user: UserId): Promise<Profile | null>;
    isCallerAdmin(): Promise<boolean>;
    markMessagesRead(matchId: MatchId): Promise<void>;
    recordDemoSwipe(demoKey: string, action: SwipeAction): Promise<{
        matchId?: MatchId;
        matched: boolean;
    }>;
    recordSwipe(targetPrincipal: UserId, action: SwipeAction): Promise<{
        matchId?: MatchId;
        matched: boolean;
    }>;
    saveFilters(filters: DiscoveryFilters): Promise<void>;
    seedDemoProfiles(): Promise<string>;
    sendMessage(matchId: MatchId, text: string): Promise<Message>;
    updateProfile(input: ProfileInput): Promise<void>;
}
