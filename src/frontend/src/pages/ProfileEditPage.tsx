import InterestTags from "@/components/profile/InterestTags";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";
import { useGetCallerUserProfile, useSaveProfile } from "@/hooks/useBackend";
import { useObjectStorage } from "@/hooks/useObjectStorage";
import type { UserProfile } from "@/types";
import { useNavigate } from "@tanstack/react-router";
import {
  Camera,
  ChevronLeft,
  ImagePlus,
  Loader2,
  Pencil,
  Ruler,
  User,
  X,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

const GENDER_OPTIONS = ["Woman", "Man", "Non-binary", "Other"] as const;
const ALL_INTERESTS = [
  "Fine Dining",
  "Opera",
  "Jazz",
  "Vintage Wine",
  "Travel",
  "Contemporary Art",
  "French Cuisine",
  "Yoga",
  "Pilates",
  "Sustainable Fashion",
  "Philanthropy",
  "Photography",
  "Film",
  "Sailing",
  "Tennis",
  "Golf",
  "Literature",
  "Architecture",
  "Wellness",
  "Hiking",
  "Cooking",
  "Skiing",
];
const MAX_PHOTOS = 6;

type GenderOption = (typeof GENDER_OPTIONS)[number];

interface PhotoEntry {
  url: string;
  isUploading: boolean;
  progress: number;
}

interface PicState {
  url: string;
  isUploading: boolean;
  progress: number;
}

function SectionHeader({ label }: { label: string }) {
  return (
    <h2 className="text-xs font-bold text-primary uppercase tracking-widest mb-3">
      {label}
    </h2>
  );
}

function FieldGroup({
  label,
  htmlFor,
  children,
}: { label: string; htmlFor: string; children: React.ReactNode }) {
  return (
    <div className="space-y-2">
      <Label htmlFor={htmlFor} className="text-foreground font-body text-sm">
        {label}
      </Label>
      {children}
    </div>
  );
}

export default function ProfileEditPage() {
  const navigate = useNavigate();
  const { data: profile } = useGetCallerUserProfile();
  const saveProfile = useSaveProfile();
  const { uploadFile } = useObjectStorage();

  // Photo grid input
  const photoFileRef = useRef<HTMLInputElement>(null);
  // Cover pic input
  const coverFileRef = useRef<HTMLInputElement>(null);
  // Profile pic input
  const profilePicFileRef = useRef<HTMLInputElement>(null);

  const [name, setName] = useState("");
  const [age, setAge] = useState(25);
  const [bio, setBio] = useState("");
  const [location, setLocation] = useState("");
  const [height, setHeight] = useState(170);
  const [gender, setGender] = useState<GenderOption>("Woman");
  const [genderPref, setGenderPref] = useState<GenderOption>("Man");
  const [interests, setInterests] = useState<string[]>([]);
  const [photos, setPhotos] = useState<PhotoEntry[]>([]);

  const [profilePic, setProfilePic] = useState<PicState | null>(null);
  const [coverPic, setCoverPic] = useState<PicState | null>(null);

  // Sync form from loaded profile
  // biome-ignore lint/correctness/useExhaustiveDependencies: intentional sync on profile load
  useEffect(() => {
    if (!profile) return;
    setName(profile.name ?? "");
    if (profile.age) setAge(profile.age);
    setBio(profile.bio ?? "");
    setLocation(profile.location ?? "");
    setInterests(profile.interests ?? []);
    if (profile.photos?.length) {
      setPhotos(
        profile.photos.map((url) => ({
          url,
          isUploading: false,
          progress: 100,
        })),
      );
    }
    if (profile.profilePicUrl) {
      setProfilePic({
        url: profile.profilePicUrl,
        isUploading: false,
        progress: 100,
      });
    }
    if (profile.coverPicUrl) {
      setCoverPic({
        url: profile.coverPicUrl,
        isUploading: false,
        progress: 100,
      });
    }
  }, [profile?.name]);

  const handleInterestToggle = (interest: string) => {
    setInterests((prev) =>
      prev.includes(interest)
        ? prev.filter((i) => i !== interest)
        : [...prev, interest],
    );
  };

  const handleRemovePhoto = (index: number) => {
    setPhotos((prev) => {
      const next = [...prev];
      const removed = next.splice(index, 1)[0];
      if (removed.url.startsWith("blob:")) URL.revokeObjectURL(removed.url);
      return next;
    });
  };

  const handleAddPhoto = () => {
    if (photos.length >= MAX_PHOTOS) {
      toast.info(`Maximum ${MAX_PHOTOS} photos allowed`);
      return;
    }
    photoFileRef.current?.click();
  };

  const handlePhotoFileChange = async (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const files = Array.from(e.target.files ?? []);
    if (!files.length) return;
    e.target.value = "";

    const available = MAX_PHOTOS - photos.length;
    const toProcess = files
      .slice(0, available)
      .filter((f) => f.type.startsWith("image/"));

    let currentLength = photos.length;
    for (const file of toProcess) {
      const previewUrl = URL.createObjectURL(file);
      const idx = currentLength;
      currentLength += 1;

      setPhotos((prev) => [
        ...prev,
        { url: previewUrl, isUploading: true, progress: 0 },
      ]);

      try {
        const { directUrl } = await uploadFile(file, (pct) => {
          setPhotos((prev) =>
            prev.map((p, i) => (i === idx ? { ...p, progress: pct } : p)),
          );
        });
        setPhotos((prev) =>
          prev.map((p, i) =>
            i === idx
              ? { url: directUrl, isUploading: false, progress: 100 }
              : p,
          ),
        );
        URL.revokeObjectURL(previewUrl);
      } catch {
        setPhotos((prev) => prev.filter((_, i) => i !== idx));
        URL.revokeObjectURL(previewUrl);
        currentLength -= 1;
        toast.error("Upload failed. Please try again.");
      }
    }
  };

  const handleCoverFileChange = async (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = e.target.files?.[0];
    if (!file || !file.type.startsWith("image/")) return;
    e.target.value = "";

    const previewUrl = URL.createObjectURL(file);
    setCoverPic({ url: previewUrl, isUploading: true, progress: 0 });

    try {
      const { directUrl } = await uploadFile(file, (pct) => {
        setCoverPic((prev) => (prev ? { ...prev, progress: pct } : null));
      });
      URL.revokeObjectURL(previewUrl);
      setCoverPic({ url: directUrl, isUploading: false, progress: 100 });
    } catch {
      URL.revokeObjectURL(previewUrl);
      setCoverPic(null);
      toast.error("Cover photo upload failed. Please try again.");
    }
  };

  const handleProfilePicFileChange = async (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = e.target.files?.[0];
    if (!file || !file.type.startsWith("image/")) return;
    e.target.value = "";

    const previewUrl = URL.createObjectURL(file);
    setProfilePic({ url: previewUrl, isUploading: true, progress: 0 });

    try {
      const { directUrl } = await uploadFile(file, (pct) => {
        setProfilePic((prev) => (prev ? { ...prev, progress: pct } : null));
      });
      URL.revokeObjectURL(previewUrl);
      setProfilePic({ url: directUrl, isUploading: false, progress: 100 });
    } catch {
      URL.revokeObjectURL(previewUrl);
      setProfilePic(null);
      toast.error("Profile photo upload failed. Please try again.");
    }
  };

  const handleSave = async () => {
    const uploadingCount = photos.filter((p) => p.isUploading).length;
    const coverUploading = coverPic?.isUploading ?? false;
    const picUploading = profilePic?.isUploading ?? false;
    if (uploadingCount > 0 || coverUploading || picUploading) {
      toast.info("Please wait for photos to finish uploading");
      return;
    }

    const update: Partial<UserProfile> & {
      profilePic?: string;
      coverPic?: string;
    } = {
      name,
      age,
      bio,
      location,
      interests,
      photos: photos.map((p) => p.url),
      ...(profilePic ? { profilePic: profilePic.url } : {}),
      ...(coverPic ? { coverPic: coverPic.url } : {}),
    };
    await saveProfile.mutateAsync(update);
    toast.success("Profile updated ✨");
    navigate({ to: "/profile" });
  };

  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const slots = Array.from({ length: MAX_PHOTOS }, (_, i) => photos[i] ?? null);

  return (
    <div className="min-h-screen bg-background">
      {/* Hidden file inputs */}
      <input
        ref={photoFileRef}
        type="file"
        accept="image/*"
        multiple
        className="sr-only"
        onChange={handlePhotoFileChange}
        data-ocid="edit-photo-file-input"
      />
      <input
        ref={coverFileRef}
        type="file"
        accept="image/*"
        className="sr-only"
        onChange={handleCoverFileChange}
        data-ocid="cover-photo-file-input"
      />
      <input
        ref={profilePicFileRef}
        type="file"
        accept="image/*"
        className="sr-only"
        onChange={handleProfilePicFileChange}
        data-ocid="profile-pic-file-input"
      />

      {/* Header */}
      <header className="sticky top-0 z-40 flex items-center h-16 px-4 border-b border-border bg-card/90 backdrop-blur-xl">
        <button
          type="button"
          data-ocid="edit-back"
          onClick={() => navigate({ to: "/profile" })}
          className="text-muted-foreground hover:text-foreground transition-smooth mr-3"
          aria-label="Go back"
        >
          <ChevronLeft size={24} />
        </button>
        <h1 className="font-display font-bold text-foreground text-lg flex-1">
          Edit Profile
        </h1>
        <Button
          data-ocid="save-profile"
          onClick={handleSave}
          disabled={saveProfile.isPending}
          className="h-9 px-5 rounded-xl gradient-gold text-primary-foreground font-semibold border-0 text-sm shadow-gold action-btn"
        >
          {saveProfile.isPending ? "Saving..." : "Save"}
        </Button>
      </header>

      <div className="pb-20">
        {/* ── Cover Photo ── */}
        <div className="relative w-full" style={{ height: 180 }}>
          {coverPic ? (
            <img
              src={coverPic.url}
              alt="Cover"
              className="w-full h-full object-cover"
            />
          ) : (
            <div
              className="w-full h-full"
              style={{
                background:
                  "linear-gradient(135deg, oklch(0.18 0.02 50) 0%, oklch(0.22 0.06 50) 40%, oklch(0.28 0.12 50) 100%)",
              }}
            />
          )}

          {/* Upload progress overlay for cover */}
          <AnimatePresence>
            {coverPic?.isUploading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-background/75 flex flex-col items-center justify-center gap-2"
                data-ocid="cover-uploading"
              >
                <Loader2 className="w-6 h-6 text-primary animate-spin" />
                <div className="w-1/3 h-1 bg-muted rounded-full overflow-hidden">
                  <motion.div
                    className="h-full gradient-gold rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${coverPic.progress}%` }}
                    transition={{ duration: 0.3 }}
                  />
                </div>
                <span className="text-xs text-muted-foreground">
                  {coverPic.progress}%
                </span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Cover edit button */}
          <button
            type="button"
            data-ocid="upload-cover-photo"
            aria-label="Upload cover photo"
            onClick={() => coverFileRef.current?.click()}
            className="absolute bottom-3 right-3 flex items-center gap-1.5 px-3 py-2 rounded-xl bg-black/60 backdrop-blur-sm text-foreground hover:bg-black/80 transition-smooth text-xs font-medium"
          >
            <Camera size={13} className="text-primary" />
            {coverPic ? "Change Cover" : "Add Cover Photo"}
          </button>
        </div>

        {/* ── Profile Pic ── */}
        <div className="flex items-end gap-4 px-5 -mt-12 mb-6">
          <div className="relative flex-shrink-0">
            <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-background bg-card flex items-center justify-center">
              {profilePic ? (
                <img
                  src={profilePic.url}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="font-display text-2xl font-bold text-primary">
                  {initials || (
                    <User size={28} className="text-muted-foreground" />
                  )}
                </span>
              )}
              {/* Uploading overlay */}
              <AnimatePresence>
                {profilePic?.isUploading && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 bg-background/75 rounded-full flex items-center justify-center"
                    data-ocid="profile-pic-uploading"
                  >
                    <Loader2 className="w-5 h-5 text-primary animate-spin" />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Edit overlay button */}
            <button
              type="button"
              data-ocid="upload-profile-pic"
              aria-label="Upload profile picture"
              onClick={() => profilePicFileRef.current?.click()}
              className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full gradient-gold border-2 border-background flex items-center justify-center shadow-gold action-btn"
            >
              <Pencil size={12} className="text-primary-foreground" />
            </button>
          </div>

          <div className="flex-1 pb-1 pt-14">
            <p className="text-xs text-muted-foreground font-body">
              Profile picture is shown on your card and in matches
            </p>
          </div>
        </div>

        <div className="px-5 space-y-7">
          {/* Photos section */}
          <div>
            <SectionHeader label="Photos" />
            <ul
              data-ocid="edit-photo-grid"
              className="grid grid-cols-3 gap-1.5 list-none p-0 m-0"
              aria-label="Profile photos"
            >
              {slots.map((photo, i) => {
                const key = photo
                  ? `photo-${i}-${photo.url.slice(-8)}`
                  : `slot-${i}`;
                const isFirst = i === 0;

                return (
                  <motion.li
                    key={key}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.05, duration: 0.25 }}
                    className={`relative rounded-2xl overflow-hidden bg-card border border-border aspect-square ${isFirst ? "col-span-2 row-span-2" : ""}`}
                  >
                    {photo ? (
                      <>
                        <img
                          src={photo.url}
                          alt={`Profile shot ${i + 1}`}
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                        <AnimatePresence>
                          {photo.isUploading && (
                            <motion.div
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              exit={{ opacity: 0 }}
                              className="absolute inset-0 bg-background/75 flex flex-col items-center justify-center gap-2"
                              data-ocid={`photo-uploading-${i}`}
                            >
                              <Loader2 className="w-6 h-6 text-primary animate-spin" />
                              <div className="w-3/4 h-1 bg-muted rounded-full overflow-hidden">
                                <motion.div
                                  className="h-full gradient-gold rounded-full"
                                  initial={{ width: 0 }}
                                  animate={{ width: `${photo.progress}%` }}
                                  transition={{ duration: 0.3 }}
                                />
                              </div>
                              <span className="text-[10px] text-muted-foreground font-body">
                                {photo.progress}%
                              </span>
                            </motion.div>
                          )}
                        </AnimatePresence>
                        <button
                          type="button"
                          onClick={() => handleRemovePhoto(i)}
                          data-ocid={`remove-photo-${i}`}
                          aria-label={`Remove photo ${i + 1}`}
                          className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/60 flex items-center justify-center text-foreground hover:bg-destructive transition-smooth action-btn"
                        >
                          <X size={13} />
                        </button>
                        {isFirst && (
                          <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded-full bg-black/40 text-[10px] text-foreground/80 font-medium backdrop-blur-sm">
                            Main
                          </div>
                        )}
                      </>
                    ) : (
                      <button
                        type="button"
                        onClick={handleAddPhoto}
                        data-ocid={
                          i === 0 ? "add-photo-primary" : `add-photo-${i}`
                        }
                        aria-label="Add photo"
                        className="w-full h-full flex flex-col items-center justify-center gap-2 border-2 border-dashed border-primary/30 rounded-2xl hover:border-primary/60 hover:bg-primary/5 transition-smooth group"
                      >
                        <div className="w-10 h-10 rounded-full gradient-gold-subtle border border-primary/30 flex items-center justify-center group-hover:border-primary/50 transition-smooth">
                          <ImagePlus size={16} className="text-primary" />
                        </div>
                        {isFirst && (
                          <span className="text-[11px] text-muted-foreground font-body">
                            Add main
                          </span>
                        )}
                      </button>
                    )}
                  </motion.li>
                );
              })}
            </ul>
            <p className="text-xs text-muted-foreground mt-2 text-center">
              Add up to {MAX_PHOTOS} photos · First photo is your main profile
              shot
            </p>
          </div>

          {/* Basic info */}
          <div className="p-4 rounded-2xl bg-card border border-border space-y-4">
            <SectionHeader label="Basic Info" />

            <FieldGroup label="Display Name" htmlFor="edit-name">
              <Input
                id="edit-name"
                data-ocid="edit-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
                className="h-12 rounded-xl bg-background border-border text-foreground focus:border-primary"
              />
            </FieldGroup>

            <FieldGroup label="Age" htmlFor="edit-age">
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">
                    {age} years old
                  </span>
                  <span className="text-sm text-primary font-bold">{age}</span>
                </div>
                <Slider
                  data-ocid="edit-age-slider"
                  value={[age]}
                  onValueChange={([v]) => setAge(v)}
                  min={18}
                  max={80}
                  step={1}
                  className="[&_[role=slider]]:bg-primary [&_[role=slider]]:border-primary/20 [&_[role=slider]]:shadow-gold"
                />
              </div>
            </FieldGroup>

            <FieldGroup label="Location" htmlFor="edit-location">
              <Input
                id="edit-location"
                data-ocid="edit-location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="City, Country"
                className="h-12 rounded-xl bg-background border-border text-foreground focus:border-primary"
              />
            </FieldGroup>
          </div>

          {/* Bio */}
          <div className="p-4 rounded-2xl bg-card border border-border space-y-4">
            <SectionHeader label="About You" />
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <User size={14} className="text-primary" />
                <Label
                  htmlFor="edit-bio"
                  className="text-foreground font-body text-sm"
                >
                  Bio
                </Label>
              </div>
              <Textarea
                id="edit-bio"
                data-ocid="edit-bio"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Share what makes you extraordinary..."
                rows={4}
                maxLength={200}
                className="rounded-xl bg-background border-border text-foreground resize-none focus:border-primary"
              />
              <p className="text-xs text-muted-foreground text-right">
                {bio.length}/200
              </p>
            </div>
          </div>

          {/* Height */}
          <div className="p-4 rounded-2xl bg-card border border-border">
            <SectionHeader label="Height" />
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2 text-muted-foreground text-sm">
                  <Ruler size={14} className="text-primary" />
                  Height
                </div>
                <span className="text-primary font-bold text-sm">
                  {height} cm
                  <span className="text-muted-foreground font-normal ml-1.5 text-xs">
                    ({Math.floor(height / 30.48)}′
                    {Math.round((height % 30.48) / 2.54)}″)
                  </span>
                </span>
              </div>
              <Slider
                data-ocid="edit-height-slider"
                value={[height]}
                onValueChange={([v]) => setHeight(v)}
                min={140}
                max={220}
                step={1}
                className="[&_[role=slider]]:bg-primary [&_[role=slider]]:border-primary/20 [&_[role=slider]]:shadow-gold"
              />
            </div>
          </div>

          {/* Gender */}
          <div className="p-4 rounded-2xl bg-card border border-border space-y-4">
            <SectionHeader label="Identity & Preference" />

            <div className="space-y-2">
              <Label className="text-foreground font-body text-sm">
                I am a...
              </Label>
              <div className="grid grid-cols-2 gap-2">
                {GENDER_OPTIONS.map((g) => (
                  <button
                    key={g}
                    type="button"
                    data-ocid={`gender-${g.toLowerCase()}`}
                    onClick={() => setGender(g)}
                    className={`py-3 rounded-xl text-sm font-body transition-smooth border ${
                      gender === g
                        ? "gradient-gold text-primary-foreground border-primary/40 shadow-gold"
                        : "bg-background border-border text-muted-foreground hover:border-primary/30 hover:text-foreground"
                    }`}
                  >
                    {g}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-foreground font-body text-sm">
                Interested in...
              </Label>
              <div className="grid grid-cols-2 gap-2">
                {GENDER_OPTIONS.map((g) => (
                  <button
                    key={g}
                    type="button"
                    data-ocid={`pref-${g.toLowerCase()}`}
                    onClick={() => setGenderPref(g)}
                    className={`py-3 rounded-xl text-sm font-body transition-smooth border ${
                      genderPref === g
                        ? "gradient-gold text-primary-foreground border-primary/40 shadow-gold"
                        : "bg-background border-border text-muted-foreground hover:border-primary/30 hover:text-foreground"
                    }`}
                  >
                    {g}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Interests */}
          <div className="p-4 rounded-2xl bg-card border border-border">
            <SectionHeader label="Interests" />
            <p className="text-xs text-muted-foreground mb-3">
              Select interests to show on your profile ({interests.length}{" "}
              selected)
            </p>
            <InterestTags
              interests={ALL_INTERESTS}
              selectable
              selected={interests}
              onToggle={handleInterestToggle}
            />
          </div>

          {/* Save CTA */}
          <Button
            data-ocid="save-profile-bottom"
            onClick={handleSave}
            disabled={saveProfile.isPending}
            className="w-full h-14 rounded-2xl gradient-gold text-primary-foreground font-bold text-base border-0 shadow-gold action-btn"
          >
            {saveProfile.isPending ? "Saving changes..." : "Save Profile"}
          </Button>
        </div>
      </div>
    </div>
  );
}
