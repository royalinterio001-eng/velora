import Storage "mo:caffeineai-object-storage/Storage";
import Common "common";

module {
  // ── Gender ──────────────────────────────────────────────────────────────────
  public type Gender = {
    #male;
    #female;
    #nonBinary;
    #other;
  };

  // ── Swipe action ────────────────────────────────────────────────────────────
  public type SwipeAction = {
    #like;
    #pass;
    #superLike;
  };

  // ── Discovery filters (saved per user) ──────────────────────────────────────
  public type DiscoveryFilters = {
    minAge : Nat;
    maxAge : Nat;
    interests : [Text];
    genderPref : ?Gender;
  };

  // ── Profile (internal — contains mutable fields) ────────────────────────────
  public type ProfileInternal = {
    principal : Common.UserId;
    var name : Text;
    var age : Nat;
    var bio : Text;
    var gender : Gender;
    var genderPreference : ?Gender;
    var interests : [Text];
    var location : Text;
    var height : ?Nat;
    var photoKeys : [Storage.ExternalBlob];
    var profileComplete : Bool;
    var superLikesRemaining : Nat;
    var superLikesResetDay : Int;
    var filters : DiscoveryFilters;
    createdAt : Common.Timestamp;
    var lastSeen : Common.Timestamp;
    var isPremium : Bool;
    var subscriptionStatus : Text;
    var premiumActivatedAt : ?Int;
    var upiPaymentRef : ?Text;
    var profilePicKey : ?Text;
    var coverPicKey : ?Text;
    isDemo : Bool;
  };

  // ── Profile (public — shared-safe, no mutable fields) ───────────────────────
  public type Profile = {
    principal : Common.UserId;
    name : Text;
    age : Nat;
    bio : Text;
    gender : Gender;
    genderPreference : ?Gender;
    interests : [Text];
    location : Text;
    height : ?Nat;
    photoKeys : [Storage.ExternalBlob];
    profileComplete : Bool;
    superLikesRemaining : Nat;
    filters : DiscoveryFilters;
    createdAt : Common.Timestamp;
    lastSeen : Common.Timestamp;
    isPremium : Bool;
    subscriptionStatus : Text;
    premiumActivatedAt : ?Int;
    profilePicUrl : ?Text;
    coverPicUrl : ?Text;
    isDemo : Bool;
  };

  // ── Profile input (for create/update calls) ──────────────────────────────────
  public type ProfileInput = {
    name : Text;
    age : Nat;
    bio : Text;
    gender : Gender;
    genderPreference : ?Gender;
    interests : [Text];
    location : Text;
    height : ?Nat;
    photoKeys : [Storage.ExternalBlob];
    profilePic : ?Text;
    coverPic : ?Text;
  };

  // ── Swipe record ─────────────────────────────────────────────────────────────
  public type SwipeRecord = {
    from : Common.UserId;
    target : Common.UserId;
    action : SwipeAction;
    timestamp : Common.Timestamp;
  };

  // ── Match ────────────────────────────────────────────────────────────────────
  public type Match = {
    matchId : Common.MatchId;
    user1 : Common.UserId;
    user2 : Common.UserId;
    superLiked : Bool;
    createdAt : Common.Timestamp;
  };

  // ── Message (internal) ───────────────────────────────────────────────────────
  public type MessageInternal = {
    id : Common.MessageId;
    matchId : Common.MatchId;
    sender : Common.UserId;
    text : Text;
    sentAt : Common.Timestamp;
    var readByRecipient : Bool;
  };

  // ── Message (public) ─────────────────────────────────────────────────────────
  public type Message = {
    id : Common.MessageId;
    matchId : Common.MatchId;
    sender : Common.UserId;
    text : Text;
    sentAt : Common.Timestamp;
    readByRecipient : Bool;
  };

  // ── Discovery page result ────────────────────────────────────────────────────
  public type DiscoveryPage = {
    profiles : [Profile];
    nextOffset : ?Nat;
  };

  // ── Demo profile seed data ────────────────────────────────────────────────────
  public type DemoProfileData = {
    demoKey : Text;
    name : Text;
    age : Nat;
    bio : Text;
    gender : Gender;
    interests : [Text];
    location : Text;
    photoUrls : [Text];
    isPremium : Bool;
  };
};
