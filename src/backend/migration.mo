import Map "mo:core/Map";
import List "mo:core/List";
import Storage "mo:caffeineai-object-storage/Storage";
import Types "types/core";
import Common "types/common";

module {
  // ── Old types (copied from previous version of types/core.mo) ───────────────
  type OldGender = { #male; #female; #nonBinary; #other };
  type OldDiscoveryFilters = {
    minAge : Nat;
    maxAge : Nat;
    interests : [Text];
    genderPref : ?OldGender;
  };
  type OldProfileInternal = {
    principal : Common.UserId;
    var name : Text;
    var age : Nat;
    var bio : Text;
    var gender : OldGender;
    var genderPreference : ?OldGender;
    var interests : [Text];
    var location : Text;
    var height : ?Nat;
    var photoKeys : [Storage.ExternalBlob];
    var profileComplete : Bool;
    var superLikesRemaining : Nat;
    var superLikesResetDay : Int;
    var filters : OldDiscoveryFilters;
    createdAt : Common.Timestamp;
    var lastSeen : Common.Timestamp;
    var isPremium : Bool;
    var subscriptionStatus : Text;
    var premiumActivatedAt : ?Int;
    var upiPaymentRef : ?Text;
  };

  type OldSwipeRecord = {
    from : Common.UserId;
    target : Common.UserId;
    action : { #like; #pass; #superLike };
    timestamp : Common.Timestamp;
  };

  type OldMatch = {
    matchId : Common.MatchId;
    user1 : Common.UserId;
    user2 : Common.UserId;
    superLiked : Bool;
    createdAt : Common.Timestamp;
  };

  type OldMessageInternal = {
    id : Common.MessageId;
    matchId : Common.MatchId;
    sender : Common.UserId;
    text : Text;
    sentAt : Common.Timestamp;
    var readByRecipient : Bool;
  };

  // ── Old actor state ─────────────────────────────────────────────────────────
  type OldActor = {
    profiles : Map.Map<Common.UserId, OldProfileInternal>;
    swipes : Map.Map<Text, OldSwipeRecord>;
    matches : Map.Map<Common.MatchId, OldMatch>;
    messages : List.List<OldMessageInternal>;
    nextMessageId : { var value : Nat };
  };

  // ── New actor state ─────────────────────────────────────────────────────────
  type NewActor = {
    profiles : Map.Map<Common.UserId, Types.ProfileInternal>;
    demoProfiles : Map.Map<Text, Types.ProfileInternal>;
    swipes : Map.Map<Text, Types.SwipeRecord>;
    matches : Map.Map<Common.MatchId, Types.Match>;
    messages : List.List<Types.MessageInternal>;
    nextMessageId : { var value : Nat };
    demosSeeded : { var value : Bool };
  };

  public func run(old : OldActor) : NewActor {
    let profiles = old.profiles.map<Common.UserId, OldProfileInternal, Types.ProfileInternal>(
      func(_id, p) {
        {
          principal = p.principal;
          var name = p.name;
          var age = p.age;
          var bio = p.bio;
          var gender = p.gender;
          var genderPreference = p.genderPreference;
          var interests = p.interests;
          var location = p.location;
          var height = p.height;
          var photoKeys = p.photoKeys;
          var profileComplete = p.profileComplete;
          var superLikesRemaining = p.superLikesRemaining;
          var superLikesResetDay = p.superLikesResetDay;
          var filters = p.filters;
          createdAt = p.createdAt;
          var lastSeen = p.lastSeen;
          var isPremium = p.isPremium;
          var subscriptionStatus = p.subscriptionStatus;
          var premiumActivatedAt = p.premiumActivatedAt;
          var upiPaymentRef = p.upiPaymentRef;
          var profilePicKey = null : ?Text;
          var coverPicKey = null : ?Text;
          isDemo = false;
        }
      }
    );
    {
      profiles;
      demoProfiles = Map.empty<Text, Types.ProfileInternal>();
      swipes = old.swipes;
      matches = old.matches;
      messages = old.messages;
      nextMessageId = old.nextMessageId;
      demosSeeded = { var value = false };
    };
  };
};
