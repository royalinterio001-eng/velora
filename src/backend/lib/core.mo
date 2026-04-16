import Principal "mo:core/Principal";
import Time "mo:core/Time";
import Text "mo:core/Text";
import Types "../types/core";
import Common "../types/common";

module {
  // ── Constants ────────────────────────────────────────────────────────────────

  let NANOS_PER_DAY : Int = 86_400_000_000_000;
  let SUPER_LIKES_PER_DAY : Nat = 5;

  // ── Auto-reply bank (34 varied responses for demo profiles) ──────────────────

  public let autoReplies : [Text] = [
    "Hey! How are you doing? 😊",
    "Hi there! Lovely to hear from you!",
    "Hello! What a nice surprise to get your message!",
    "You seem really interesting! Tell me more about yourself?",
    "I love your profile! What do you do for fun?",
    "So what brings you to Velora? Looking for something special? ✨",
    "Tell me about your day!",
    "What's your favorite thing to do on weekends?",
    "I was hoping you'd message me! 🌟",
    "So happy you reached out!",
    "You've made my day better already 😊",
    "Wow, finally someone interesting! What are you passionate about?",
    "I've been waiting for a message like this 💫",
    "This is exciting! Tell me something surprising about yourself.",
    "Hey you! I noticed your profile and couldn't resist replying 😄",
    "Namaste! How's your day going so far?",
    "I love meeting new people. What's your story?",
    "You have great taste reaching out! What are your hobbies?",
    "Okay, you've got my attention 😉 Tell me more!",
    "Hi! I was just thinking about checking Velora and here you are!",
    "What a lovely message! Are you from around here?",
    "Tell me your favorite travel destination — mine is Goa! 🌴",
    "I'm a big fan of good conversations. Let's have one! ☕",
    "You seem like someone with great energy. Am I right? 😊",
    "Just saw your message and it made me smile instantly 🌸",
    "Hey! I love that you reached out. What kind of music are you into?",
    "So glad you messaged! What do you love most about your city?",
    "I'm always up for a good chat. What are you up to today?",
    "Your message just brightened up my afternoon! 🌟",
    "I'd love to know more about you. What are your passions?",
    "Hey there! Do you have a favorite cuisine? I'm a total foodie 🍛",
    "Great timing — I was just free! How are you?",
    "I feel like we could have really interesting conversations 😊",
    "Such a warm message! Tell me — tea or coffee person?",
  ];

  public func getAutoReply(msgCount : Nat) : Text {
    let idx = msgCount % autoReplies.size();
    autoReplies[idx];
  };

  // ── Profile helpers ──────────────────────────────────────────────────────────

  public func newProfile(
    principal : Common.UserId,
    input : Types.ProfileInput,
  ) : Types.ProfileInternal {
    let now = Time.now();
    let hasPhoto = input.photoKeys.size() > 0;
    let isComplete = input.name.size() > 0
      and input.age >= 18
      and input.bio.size() > 0
      and input.location.size() > 0
      and hasPhoto;
    {
      principal;
      var name = input.name;
      var age = input.age;
      var bio = input.bio;
      var gender = input.gender;
      var genderPreference = input.genderPreference;
      var interests = input.interests;
      var location = input.location;
      var height = input.height;
      var photoKeys = input.photoKeys;
      var profileComplete = isComplete;
      var superLikesRemaining = SUPER_LIKES_PER_DAY;
      var superLikesResetDay = now / NANOS_PER_DAY;
      var filters = {
        minAge = 18;
        maxAge = 99;
        interests = [];
        genderPref = input.genderPreference;
      };
      createdAt = now;
      var lastSeen = now;
      var isPremium = false;
      var subscriptionStatus = "free";
      var premiumActivatedAt = null;
      var upiPaymentRef = null;
      var profilePicKey = null : ?Text;
      var coverPicKey = null : ?Text;
      isDemo = false;
    };
  };

  public func newDemoProfile(
    demoUserId : Common.UserId,
    data : Types.DemoProfileData,
  ) : Types.ProfileInternal {
    let now = Time.now();
    // Encode photo URL strings as blobs (ExternalBlob = Blob)
    let photoKeys = data.photoUrls.map(
      func(url) { url.encodeUtf8() }
    );
    let firstUrl = if (data.photoUrls.size() > 0) ?data.photoUrls[0] else null;
    let secondUrl = if (data.photoUrls.size() > 1) ?data.photoUrls[1] else null;
    {
      principal = demoUserId;
      var name = data.name;
      var age = data.age;
      var bio = data.bio;
      var gender = data.gender;
      var genderPreference = null;
      var interests = data.interests;
      var location = data.location;
      var height = null;
      var photoKeys = photoKeys;
      var profileComplete = true;
      var superLikesRemaining = SUPER_LIKES_PER_DAY;
      var superLikesResetDay = now / NANOS_PER_DAY;
      var filters = {
        minAge = 18;
        maxAge = 99;
        interests = [];
        genderPref = null;
      };
      createdAt = now;
      var lastSeen = now;
      var isPremium = data.isPremium;
      var subscriptionStatus = if (data.isPremium) "premium" else "free";
      var premiumActivatedAt = null;
      var upiPaymentRef = null;
      var profilePicKey = firstUrl;
      var coverPicKey = secondUrl;
      isDemo = true;
    };
  };

  public func toPublicProfile(self : Types.ProfileInternal) : Types.Profile {
    {
      principal = self.principal;
      name = self.name;
      age = self.age;
      bio = self.bio;
      gender = self.gender;
      genderPreference = self.genderPreference;
      interests = self.interests;
      location = self.location;
      height = self.height;
      photoKeys = self.photoKeys;
      profileComplete = self.profileComplete;
      superLikesRemaining = self.superLikesRemaining;
      filters = self.filters;
      createdAt = self.createdAt;
      lastSeen = self.lastSeen;
      isPremium = self.isPremium;
      subscriptionStatus = self.subscriptionStatus;
      premiumActivatedAt = self.premiumActivatedAt;
      profilePicUrl = self.profilePicKey;
      coverPicUrl = self.coverPicKey;
      isDemo = self.isDemo;
    };
  };

  public func updateProfile(
    self : Types.ProfileInternal,
    input : Types.ProfileInput,
  ) {
    self.name := input.name;
    self.age := input.age;
    self.bio := input.bio;
    self.gender := input.gender;
    self.genderPreference := input.genderPreference;
    self.interests := input.interests;
    self.location := input.location;
    self.height := input.height;
    self.photoKeys := input.photoKeys;
    switch (input.profilePic) {
      case (?key) { self.profilePicKey := ?key };
      case null {};
    };
    switch (input.coverPic) {
      case (?key) { self.coverPicKey := ?key };
      case null {};
    };
    let hasPhoto = input.photoKeys.size() > 0;
    self.profileComplete := input.name.size() > 0
      and input.age >= 18
      and input.bio.size() > 0
      and input.location.size() > 0
      and hasPhoto;
  };

  public func updateLastSeen(self : Types.ProfileInternal) {
    self.lastSeen := Time.now();
  };

  public func resetSuperLikesIfNewDay(self : Types.ProfileInternal) {
    let today = Time.now() / NANOS_PER_DAY;
    if (today > self.superLikesResetDay) {
      self.superLikesRemaining := SUPER_LIKES_PER_DAY;
      self.superLikesResetDay := today;
    };
  };

  public func profileMatchesFilters(
    profile : Types.ProfileInternal,
    filters : Types.DiscoveryFilters,
  ) : Bool {
    // Age range check
    if (profile.age < filters.minAge or profile.age > filters.maxAge) {
      return false;
    };
    // Gender preference check
    switch (filters.genderPref) {
      case (?pref) {
        if (profile.gender != pref) { return false };
      };
      case null {};
    };
    // Interest overlap (optional filter — only apply if filter has interests)
    if (filters.interests.size() > 0) {
      let hasOverlap = filters.interests.any(func(fi : Text) : Bool {
        profile.interests.any(func(pi : Text) : Bool { pi == fi })
      });
      if (not hasOverlap) { return false };
    };
    true;
  };

  // ── Swipe helpers ────────────────────────────────────────────────────────────

  public func buildMatchId(a : Common.UserId, b : Common.UserId) : Common.MatchId {
    let ta = a.toText();
    let tb = b.toText();
    if (ta.less(tb)) {
      ta # ":" # tb;
    } else {
      tb # ":" # ta;
    };
  };

  public func isMutualLike(
    action : Types.SwipeAction,
    otherRecord : ?Types.SwipeRecord,
  ) : Bool {
    let callerLiked = switch (action) {
      case (#like or #superLike) true;
      case (#pass) false;
    };
    if (not callerLiked) { return false };
    switch (otherRecord) {
      case (?rec) {
        switch (rec.action) {
          case (#like or #superLike) true;
          case (#pass) false;
        };
      };
      case null false;
    };
  };

  // ── Message helpers ───────────────────────────────────────────────────────────

  public func toPublicMessage(self : Types.MessageInternal) : Types.Message {
    {
      id = self.id;
      matchId = self.matchId;
      sender = self.sender;
      text = self.text;
      sentAt = self.sentAt;
      readByRecipient = self.readByRecipient;
    };
  };

  public func isMatchParticipant(
    match : Types.Match,
    caller : Common.UserId,
  ) : Bool {
    Principal.equal(match.user1, caller) or Principal.equal(match.user2, caller);
  };
};
