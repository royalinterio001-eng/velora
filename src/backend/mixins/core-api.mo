import Map "mo:core/Map";
import List "mo:core/List";
import Nat "mo:core/Nat";
import Text "mo:core/Text";
import Principal "mo:core/Principal";
import Time "mo:core/Time";
import Runtime "mo:core/Runtime";
import Blob "mo:core/Blob";
import AccessControl "mo:caffeineai-authorization/access-control";
import Types "../types/core";
import Common "../types/common";
import CoreLib "../lib/core";
import DemoData "../data/demoProfiles";

// Core API mixin — exposes all Velora profile, swipe, match, message, and discovery endpoints.
mixin (
  accessControlState : AccessControl.AccessControlState,
  profiles : Map.Map<Common.UserId, Types.ProfileInternal>,
  demoProfiles : Map.Map<Text, Types.ProfileInternal>,
  swipes : Map.Map<Text, Types.SwipeRecord>,
  matches : Map.Map<Common.MatchId, Types.Match>,
  messages : List.List<Types.MessageInternal>,
  nextMessageId : { var value : Nat },
  demosSeeded : { var value : Bool },
) {

  // ── Auth guard (rejects anonymous callers) ───────────────────────────────────

  func requireAuth(caller : Principal) {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: must be logged in");
    };
  };

  // Swipe key: "from:target"
  func swipeKey(from : Common.UserId, target : Common.UserId) : Text {
    from.toText() # ":" # target.toText();
  };

  // Demo profile swipe key uses Text key for demo side
  func demoSwipeKey(fromUserId : Common.UserId, demoKey : Text) : Text {
    fromUserId.toText() # ":demo:" # demoKey;
  };

  // ── Demo profile seeding ─────────────────────────────────────────────────────

  // Generates a deterministic synthetic Principal for demo profiles.
  // Each demo gets a unique 2-byte opaque principal: [0x04, idx].
  // 0x04 is the "opaque" self-authenticating type byte used for derived principals.
  func makeDemoPrincipal(idx : Nat) : Principal {
    let bytes : [Nat8] = [0x04, idx.toNat8()];
    Blob.fromArray(bytes).fromBlob();
  };

  public shared ({ caller }) func seedDemoProfiles() : async Text {
    requireAuth(caller);
    if (demosSeeded.value) {
      return "Already seeded";
    };
    var i = 0;
    for (data in DemoData.profiles.values()) {
      i += 1;
      let demoUserId = makeDemoPrincipal(i);
      let p = CoreLib.newDemoProfile(demoUserId, data);
      demoProfiles.add(data.demoKey, p);
    };
    demosSeeded.value := true;
    "Seeded " # i.toText() # " demo profiles";
  };

  public query func getDemoProfileCount() : async Nat {
    demoProfiles.size();
  };

  // ── Profile ──────────────────────────────────────────────────────────────────

  public shared ({ caller }) func createProfile(input : Types.ProfileInput) : async () {
    requireAuth(caller);
    switch (profiles.get(caller)) {
      case (?_) { Runtime.trap("Profile already exists — use updateProfile") };
      case null {
        let p = CoreLib.newProfile(caller, input);
        profiles.add(caller, p);
      };
    };
  };

  public shared ({ caller }) func updateProfile(input : Types.ProfileInput) : async () {
    requireAuth(caller);
    switch (profiles.get(caller)) {
      case (?p) {
        p.updateProfile(input);
        p.updateLastSeen();
      };
      case null {
        let p = CoreLib.newProfile(caller, input);
        profiles.add(caller, p);
      };
    };
  };

  public query ({ caller }) func getMyProfile() : async ?Types.Profile {
    switch (profiles.get(caller)) {
      case (?p) ?p.toPublicProfile();
      case null null;
    };
  };

  public query ({ caller }) func getProfile(user : Common.UserId) : async ?Types.Profile {
    switch (profiles.get(user)) {
      case (?p) ?p.toPublicProfile();
      case null null;
    };
  };

  // Get demo profile by its text key (for chat UI lookup)
  public query func getDemoProfile(demoKey : Text) : async ?Types.Profile {
    switch (demoProfiles.get(demoKey)) {
      case (?p) ?p.toPublicProfile();
      case null null;
    };
  };

  // ── Discovery ────────────────────────────────────────────────────────────────

  public query ({ caller }) func getDiscoveryProfiles(
    offset : Nat,
    limit : Nat,
  ) : async Types.DiscoveryPage {
    // Get caller's filters (defaults if no profile)
    let filters : Types.DiscoveryFilters = switch (profiles.get(caller)) {
      case (?p) p.filters;
      case null { { minAge = 18; maxAge = 99; interests = []; genderPref = null } };
    };

    // Build candidate list — real profiles first
    let candidates = List.empty<Types.Profile>();
    for ((uid, p) in profiles.entries()) {
      if (not Principal.equal(uid, caller)) {
        if (p.profileComplete) {
          let sk = swipeKey(caller, uid);
          let alreadySwiped = swipes.containsKey(sk);
          if (not alreadySwiped) {
            if (CoreLib.profileMatchesFilters(p, filters)) {
              candidates.add(p.toPublicProfile());
            };
          };
        };
      };
    };

    // Add demo profiles to the candidate pool
    for ((dKey, p) in demoProfiles.entries()) {
      let dsk = demoSwipeKey(caller, dKey);
      let alreadySwiped = swipes.containsKey(dsk);
      if (not alreadySwiped) {
        if (CoreLib.profileMatchesFilters(p, filters)) {
          candidates.add(p.toPublicProfile());
        };
      };
    };

    let total = candidates.size();
    if (offset >= total) {
      return { profiles = []; nextOffset = null };
    };

    let end = Nat.min(offset + limit, total);
    let page = candidates.sliceToArray(offset, end);
    let nextOffset = if (end < total) ?end else null;

    { profiles = page; nextOffset };
  };

  // ── Swipe ────────────────────────────────────────────────────────────────────

  public shared ({ caller }) func recordSwipe(
    targetPrincipal : Common.UserId,
    action : Types.SwipeAction,
  ) : async { matched : Bool; matchId : ?Common.MatchId } {
    requireAuth(caller);

    if (Principal.equal(caller, targetPrincipal)) {
      Runtime.trap("Cannot swipe on yourself");
    };

    // Handle super like daily limit
    switch (action) {
      case (#superLike) {
        switch (profiles.get(caller)) {
          case (?p) {
            p.resetSuperLikesIfNewDay();
            if (p.superLikesRemaining == 0) {
              Runtime.trap("Daily super like limit reached");
            };
            p.superLikesRemaining -= 1;
          };
          case null { Runtime.trap("Profile not found") };
        };
      };
      case _ {};
    };

    let sk = swipeKey(caller, targetPrincipal);
    let swipeRecord : Types.SwipeRecord = {
      from = caller;
      target = targetPrincipal;
      action;
      timestamp = Time.now();
    };
    swipes.add(sk, swipeRecord);

    // Update last seen
    switch (profiles.get(caller)) {
      case (?p) p.updateLastSeen();
      case null {};
    };

    // Check for mutual like → create match
    let reverseKey = swipeKey(targetPrincipal, caller);
    let otherSwipe = swipes.get(reverseKey);

    if (CoreLib.isMutualLike(action, otherSwipe)) {
      let matchId = CoreLib.buildMatchId(caller, targetPrincipal);
      if (not matches.containsKey(matchId)) {
        let callerSuperLiked = switch (action) { case (#superLike) true; case _ false };
        let otherSuperLiked = switch (otherSwipe) {
          case (?r) (switch (r.action) { case (#superLike) true; case _ false });
          case null false;
        };
        let isSuperLiked = callerSuperLiked or otherSuperLiked;
        let newMatch : Types.Match = {
          matchId;
          user1 = caller;
          user2 = targetPrincipal;
          superLiked = isSuperLiked;
          createdAt = Time.now();
        };
        matches.add(matchId, newMatch);
      };
      return { matched = true; matchId = ?matchId };
    };

    { matched = false; matchId = null };
  };

  // Swipe on a demo profile — always creates a match (demo profiles always like back)
  public shared ({ caller }) func recordDemoSwipe(
    demoKey : Text,
    action : Types.SwipeAction,
  ) : async { matched : Bool; matchId : ?Common.MatchId } {
    requireAuth(caller);

    let demoProfile = switch (demoProfiles.get(demoKey)) {
      case (?p) p;
      case null { Runtime.trap("Demo profile not found: " # demoKey) };
    };

    // Handle super like daily limit
    switch (action) {
      case (#superLike) {
        switch (profiles.get(caller)) {
          case (?p) {
            p.resetSuperLikesIfNewDay();
            if (p.superLikesRemaining == 0) {
              Runtime.trap("Daily super like limit reached");
            };
            p.superLikesRemaining -= 1;
          };
          case null { Runtime.trap("Profile not found") };
        };
      };
      case _ {};
    };

    let sk = demoSwipeKey(caller, demoKey);
    let swipeRecord : Types.SwipeRecord = {
      from = caller;
      target = demoProfile.principal;
      action;
      timestamp = Time.now();
    };
    swipes.add(sk, swipeRecord);

    // Update last seen
    switch (profiles.get(caller)) {
      case (?p) p.updateLastSeen();
      case null {};
    };

    // If caller liked or super-liked, always match (demo always likes back)
    let callerLiked = switch (action) {
      case (#like or #superLike) true;
      case (#pass) false;
    };

    if (callerLiked) {
      let matchId = CoreLib.buildMatchId(caller, demoProfile.principal);
      if (not matches.containsKey(matchId)) {
        let isSuperLiked = switch (action) { case (#superLike) true; case _ false };
        let newMatch : Types.Match = {
          matchId;
          user1 = caller;
          user2 = demoProfile.principal;
          superLiked = isSuperLiked;
          createdAt = Time.now();
        };
        matches.add(matchId, newMatch);
      };
      return { matched = true; matchId = ?matchId };
    };

    { matched = false; matchId = null };
  };

  // ── Matches ──────────────────────────────────────────────────────────────────

  public query ({ caller }) func getMatches() : async [Types.Match] {
    let result = List.empty<Types.Match>();
    for ((_, m) in matches.entries()) {
      if (CoreLib.isMatchParticipant(m, caller)) {
        result.add(m);
      };
    };
    result.toArray();
  };

  public query ({ caller }) func getMatch(
    targetPrincipal : Common.UserId,
  ) : async ?Types.Match {
    let matchId = CoreLib.buildMatchId(caller, targetPrincipal);
    matches.get(matchId);
  };

  // ── Messaging ────────────────────────────────────────────────────────────────

  public shared ({ caller }) func sendMessage(
    matchId : Common.MatchId,
    text : Text,
  ) : async Types.Message {
    requireAuth(caller);

    let match = switch (matches.get(matchId)) {
      case (?m) m;
      case null { Runtime.trap("Match not found") };
    };

    if (not CoreLib.isMatchParticipant(match, caller)) {
      Runtime.trap("Unauthorized: not a participant of this match");
    };

    if (text.size() == 0) {
      Runtime.trap("Message text cannot be empty");
    };

    let msgId = nextMessageId.value;
    nextMessageId.value += 1;

    let msg : Types.MessageInternal = {
      id = msgId;
      matchId;
      sender = caller;
      text;
      sentAt = Time.now();
      var readByRecipient = false;
    };
    messages.add(msg);

    // Determine if the other party in this match is a demo profile
    let otherPrincipal = if (Principal.equal(match.user1, caller)) match.user2 else match.user1;
    let isDemoRecipient = demoProfiles.any(func(_ : Text, p : Types.ProfileInternal) : Bool {
      Principal.equal(p.principal, otherPrincipal)
    });

    if (isDemoRecipient) {
      // Count existing messages in this match to pick a varied reply
      let matchMsgCount = messages.filter(func(m : Types.MessageInternal) : Bool {
        m.matchId == matchId
      }).size();
      let replyText = CoreLib.getAutoReply(matchMsgCount);

      let replyId = nextMessageId.value;
      nextMessageId.value += 1;

      let reply : Types.MessageInternal = {
        id = replyId;
        matchId;
        sender = otherPrincipal;
        text = replyText;
        sentAt = Time.now();
        var readByRecipient = false;
      };
      messages.add(reply);
    };

    msg.toPublicMessage();
  };

  public query ({ caller }) func getMessages(
    matchId : Common.MatchId,
    offset : Nat,
    limit : Nat,
  ) : async [Types.Message] {
    let match = switch (matches.get(matchId)) {
      case (?m) m;
      case null { Runtime.trap("Match not found") };
    };

    if (not CoreLib.isMatchParticipant(match, caller)) {
      Runtime.trap("Unauthorized: not a participant of this match");
    };

    let filtered = messages.filter(func(m : Types.MessageInternal) : Bool {
      m.matchId == matchId
    });

    let total = filtered.size();
    if (offset >= total) { return [] };

    let end = Nat.min(offset + limit, total);
    let page = filtered.sliceToArray(offset, end);
    page.map<Types.MessageInternal, Types.Message>(CoreLib.toPublicMessage);
  };

  public shared ({ caller }) func markMessagesRead(matchId : Common.MatchId) : async () {
    requireAuth(caller);

    let match = switch (matches.get(matchId)) {
      case (?m) m;
      case null { Runtime.trap("Match not found") };
    };

    if (not CoreLib.isMatchParticipant(match, caller)) {
      Runtime.trap("Unauthorized: not a participant of this match");
    };

    messages.mapInPlace(func(m : Types.MessageInternal) : Types.MessageInternal {
      if (m.matchId == matchId and not Principal.equal(m.sender, caller)) {
        m.readByRecipient := true;
      };
      m;
    });
  };

  // ── Filters ──────────────────────────────────────────────────────────────────

  public shared ({ caller }) func saveFilters(filters : Types.DiscoveryFilters) : async () {
    requireAuth(caller);
    switch (profiles.get(caller)) {
      case (?p) { p.filters := filters };
      case null { Runtime.trap("Create a profile first") };
    };
  };

  public query ({ caller }) func getFilters() : async ?Types.DiscoveryFilters {
    switch (profiles.get(caller)) {
      case (?p) ?p.filters;
      case null null;
    };
  };

  // ── Premium subscription ─────────────────────────────────────────────────────

  public shared ({ caller }) func activatePremium(paymentRef : Text) : async Bool {
    requireAuth(caller);
    switch (profiles.get(caller)) {
      case (?p) {
        p.isPremium := true;
        p.subscriptionStatus := "premium";
        p.premiumActivatedAt := ?Time.now();
        p.upiPaymentRef := ?paymentRef;
        true;
      };
      case null { Runtime.trap("Create a profile first") };
    };
  };

  public query ({ caller }) func getPremiumStatus() : async {
    isPremium : Bool;
    subscriptionStatus : Text;
    premiumActivatedAt : ?Int;
  } {
    switch (profiles.get(caller)) {
      case (?p) {
        {
          isPremium = p.isPremium;
          subscriptionStatus = p.subscriptionStatus;
          premiumActivatedAt = p.premiumActivatedAt;
        };
      };
      case null {
        {
          isPremium = false;
          subscriptionStatus = "free";
          premiumActivatedAt = null;
        };
      };
    };
  };
};
