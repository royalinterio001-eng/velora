import Map "mo:core/Map";
import List "mo:core/List";
import AccessControl "mo:caffeineai-authorization/access-control";
import MixinAuthorization "mo:caffeineai-authorization/MixinAuthorization";
import MixinObjectStorage "mo:caffeineai-object-storage/Mixin";
import Types "types/core";
import Common "types/common";
import CoreApi "mixins/core-api";
import Migration "migration";

(with migration = Migration.run)
actor {
  // ── Authorization ────────────────────────────────────────────────────────────
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  // ── Object storage ───────────────────────────────────────────────────────────
  include MixinObjectStorage();

  // ── Core state ───────────────────────────────────────────────────────────────
  let profiles = Map.empty<Common.UserId, Types.ProfileInternal>();
  let demoProfiles = Map.empty<Text, Types.ProfileInternal>();
  let swipes = Map.empty<Text, Types.SwipeRecord>();
  let matches = Map.empty<Common.MatchId, Types.Match>();
  let messages = List.empty<Types.MessageInternal>();
  let nextMessageId = { var value : Nat = 0 };
  let demosSeeded = { var value : Bool = false };

  // ── Core API mixin ───────────────────────────────────────────────────────────
  include CoreApi(
    accessControlState,
    profiles,
    demoProfiles,
    swipes,
    matches,
    messages,
    nextMessageId,
    demosSeeded,
  );
};
