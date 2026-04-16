import AboutStep from "@/components/onboarding/AboutStep";
import BasicInfoStep from "@/components/onboarding/BasicInfoStep";
import InterestsStep from "@/components/onboarding/InterestsStep";
import LocationStep from "@/components/onboarding/LocationStep";
import type { UploadedPhoto } from "@/components/onboarding/PhotoUploadStep";
import ProfilePreviewStep from "@/components/onboarding/ProfilePreviewStep";
import WelcomeStep from "@/components/onboarding/WelcomeStep";
import { useGetCallerUserProfile, useSaveProfile } from "@/hooks/useBackend";
import { useObjectStorage } from "@/hooks/useObjectStorage";
import { cn } from "@/lib/utils";
import { useNavigate } from "@tanstack/react-router";
import { ChevronLeft, GripVertical, ImagePlus, Loader2, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

type Gender = "male" | "female" | "nonbinary" | "other";

interface FormErrors {
  [key: string]: string | undefined;
  name?: string;
  age?: string;
  gender?: string;
  genderPref?: string;
  bio?: string;
  interests?: string;
  photos?: string;
  location?: string;
}

const STEP_WELCOME = 0;
const STEP_BASIC = 1;
const STEP_ABOUT = 2;
const STEP_INTERESTS = 3;
const STEP_PHOTOS = 4;
const STEP_LOCATION = 5;
const STEP_PREVIEW = 6;
const TOTAL_STEPS = 7;
const PROGRESS_STEPS = [
  STEP_BASIC,
  STEP_ABOUT,
  STEP_INTERESTS,
  STEP_PHOTOS,
  STEP_LOCATION,
];
const MAX_PHOTOS = 6;
const SLOTS = MAX_PHOTOS;

// ---------------------------------------------------------------------------
// Photo upload step — wired to object-storage extension
// ---------------------------------------------------------------------------
interface PhotoStepProps {
  photos: UploadedPhoto[];
  onAdd: (photo: UploadedPhoto) => void;
  onRemove: (index: number) => void;
  onUpdateProgress: (
    i: number,
    progress: number,
    status: UploadedPhoto["status"],
  ) => void;
  errors: FormErrors;
  uploadFile: (
    file: File,
    onProgress?: (pct: number) => void,
  ) => Promise<{ directUrl: string }>;
}

function PhotoUploadStepInline({
  photos,
  onAdd,
  onRemove,
  onUpdateProgress,
  errors,
  uploadFile,
}: PhotoStepProps) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState<number | null>(null);

  const handleFiles = async (files: FileList | null) => {
    if (!files) return;
    const available = SLOTS - photos.length;
    const toProcess = Array.from(files)
      .slice(0, available)
      .filter((f) => f.type.startsWith("image/"));

    // Process one at a time to keep insert indices stable
    let currentLength = photos.length;
    for (const file of toProcess) {
      const previewUrl = URL.createObjectURL(file);
      const insertIndex = currentLength;
      currentLength += 1;

      onAdd({ previewUrl, name: file.name, progress: 0, status: "uploading" });

      try {
        const { directUrl } = await uploadFile(file, (pct) => {
          onUpdateProgress(insertIndex, pct, "uploading");
        });

        URL.revokeObjectURL(previewUrl);
        // Replace the uploading entry with the final CDN URL
        onRemove(insertIndex);
        onAdd({
          previewUrl: directUrl,
          name: file.name,
          progress: 100,
          status: "done",
        });
      } catch {
        onUpdateProgress(insertIndex, 0, "error");
        setTimeout(() => onRemove(insertIndex), 1500);
        URL.revokeObjectURL(previewUrl);
        currentLength -= 1;
        toast.error("Failed to upload photo. Please try again.");
      }
    }
  };

  const slots = Array.from({ length: SLOTS }, (_, i) => photos[i] ?? null);

  return (
    <motion.div
      initial={{ opacity: 0, y: 32 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
      className="space-y-4"
    >
      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        multiple
        className="sr-only"
        onChange={(e) => {
          handleFiles(e.target.files);
          e.target.value = "";
        }}
        data-ocid="onboard-photo-file-input"
      />

      <div className="grid grid-cols-3 gap-2.5">
        {slots.map((photo, i) => {
          const slotKey = photo ? `filled-${photo.name}-${i}` : `empty-${i}`;
          return (
            <motion.div key={slotKey} layout className="relative aspect-[3/4]">
              {photo ? (
                <div className="w-full h-full rounded-2xl overflow-hidden relative border border-border">
                  <img
                    src={photo.previewUrl}
                    alt={`Portrait ${i + 1}`}
                    className="w-full h-full object-cover"
                  />

                  {/* Upload progress overlay */}
                  <AnimatePresence>
                    {photo.status === "uploading" && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 bg-background/75 flex flex-col items-center justify-center gap-2"
                        data-ocid={`onboard-photo-uploading-${i}`}
                      >
                        <Loader2 className="w-6 h-6 text-primary animate-spin" />
                        <div className="w-2/3 h-1 bg-muted rounded-full overflow-hidden">
                          <motion.div
                            className="h-full gradient-gold rounded-full"
                            initial={{ width: 0 }}
                            animate={{ width: `${photo.progress}%` }}
                            transition={{ duration: 0.3 }}
                          />
                        </div>
                        <span className="text-[10px] text-muted-foreground">
                          {photo.progress}%
                        </span>
                      </motion.div>
                    )}
                    {photo.status === "error" && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 bg-destructive/20 flex items-center justify-center"
                      >
                        <span className="text-xs text-destructive font-semibold">
                          Failed
                        </span>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Primary badge */}
                  {i === 0 && (
                    <div className="absolute top-2 left-2 px-2 py-0.5 rounded-full gradient-gold text-primary-foreground text-[10px] font-display font-semibold">
                      Main
                    </div>
                  )}

                  {/* Remove */}
                  <button
                    type="button"
                    data-ocid={`onboard-remove-photo-${i}`}
                    onClick={() => onRemove(i)}
                    aria-label="Remove portrait"
                    className="absolute top-2 right-2 w-6 h-6 rounded-full bg-background/80 backdrop-blur-sm flex items-center justify-center border border-border hover:border-destructive/60 transition-smooth"
                  >
                    <X size={12} className="text-muted-foreground" />
                  </button>

                  <div className="absolute bottom-2 left-1/2 -translate-x-1/2">
                    <GripVertical size={14} className="text-foreground/40" />
                  </div>
                </div>
              ) : (
                <button
                  type="button"
                  data-ocid={
                    i === 0 ? "onboard-upload-primary" : `onboard-upload-${i}`
                  }
                  onClick={() => fileRef.current?.click()}
                  onDragOver={(e) => {
                    e.preventDefault();
                    setDragOver(i);
                  }}
                  onDragLeave={() => setDragOver(null)}
                  onDrop={(e) => {
                    e.preventDefault();
                    setDragOver(null);
                    handleFiles(e.dataTransfer.files);
                  }}
                  className={cn(
                    "w-full h-full rounded-2xl border-2 border-dashed flex flex-col items-center justify-center gap-2 transition-smooth group",
                    dragOver === i
                      ? "border-primary bg-card"
                      : "border-border bg-card/50 hover:border-primary/50 hover:bg-card",
                  )}
                >
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center transition-smooth gradient-gold-subtle border border-primary/20 group-hover:shadow-gold">
                    <ImagePlus size={16} className="text-primary" />
                  </div>
                  {i === 0 && (
                    <span className="text-[10px] text-muted-foreground font-body text-center leading-tight px-1">
                      Add main
                      <br />
                      portrait
                    </span>
                  )}
                </button>
              )}
            </motion.div>
          );
        })}
      </div>

      <div className="space-y-1">
        <p className="text-xs text-muted-foreground text-center font-body">
          {photos.length === 0
            ? "Add at least 1 portrait to continue"
            : `${photos.length} of ${SLOTS} portraits added`}
        </p>
        {errors.photos && (
          <p
            className="text-xs font-body text-primary/90 text-center"
            data-ocid="photos-field-error"
          >
            {errors.photos}
          </p>
        )}
      </div>
    </motion.div>
  );
}

// ---------------------------------------------------------------------------
// Main Onboarding Page
// ---------------------------------------------------------------------------
export default function OnboardingPage() {
  const navigate = useNavigate();
  const saveProfile = useSaveProfile();
  const { data: existingProfile, isFetched } = useGetCallerUserProfile();
  const { uploadFile } = useObjectStorage();

  const [step, setStep] = useState(STEP_WELCOME);
  const [errors, setErrors] = useState<FormErrors>({});

  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState<Gender | "">("");
  const [genderPref, setGenderPref] = useState<Gender | "">("");
  const [bio, setBio] = useState("");
  const [interests, setInterests] = useState<string[]>([]);
  const [photos, setPhotos] = useState<UploadedPhoto[]>([]);
  const [location, setLocation] = useState("");
  const [height, setHeight] = useState("170");

  // Skip onboarding if profile is already complete
  useEffect(() => {
    if (isFetched && existingProfile) {
      navigate({ to: "/discover" });
    }
  }, [isFetched, existingProfile, navigate]);

  const toggleInterest = (interest: string) => {
    setInterests((prev) =>
      prev.includes(interest)
        ? prev.filter((i) => i !== interest)
        : prev.length < 6
          ? [...prev, interest]
          : prev,
    );
  };

  const addPhoto = (photo: UploadedPhoto) => {
    setPhotos((prev) => [...prev, photo]);
  };

  const removePhoto = (index: number) => {
    setPhotos((prev) => prev.filter((_, i) => i !== index));
  };

  const updatePhotoProgress = (
    index: number,
    progress: number,
    status: UploadedPhoto["status"],
  ) => {
    setPhotos((prev) =>
      prev.map((p, i) => (i === index ? { ...p, progress, status } : p)),
    );
  };

  const validateStep = (): boolean => {
    const newErrors: FormErrors = {};
    switch (step) {
      case STEP_BASIC:
        if (!name.trim()) newErrors.name = "Please enter your name";
        else if (name.trim().length < 2)
          newErrors.name = "Name must be at least 2 characters";
        if (!age) newErrors.age = "Please enter your age";
        else if (Number(age) < 18) newErrors.age = "You must be at least 18";
        else if (Number(age) > 80) newErrors.age = "Please enter a valid age";
        break;
      case STEP_ABOUT:
        if (!gender) newErrors.gender = "Please select your gender";
        if (!genderPref) newErrors.genderPref = "Please select your preference";
        break;
      case STEP_INTERESTS:
        if (interests.length < 3)
          newErrors.interests = "Select at least 3 interests";
        break;
      case STEP_PHOTOS: {
        const uploading = photos.filter((p) => p.status === "uploading").length;
        if (photos.length === 0) newErrors.photos = "Add at least 1 photo";
        else if (uploading > 0)
          newErrors.photos = "Please wait for uploads to finish";
        break;
      }
      case STEP_LOCATION:
        if (!location.trim()) newErrors.location = "Please enter your location";
        break;
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const goNext = () => {
    if (step === STEP_WELCOME) {
      setStep(STEP_BASIC);
      return;
    }
    if (!validateStep()) return;
    setErrors({});
    setStep((s) => s + 1);
  };

  const goBack = () => {
    setErrors({});
    setStep((s) => s - 1);
  };

  const handleComplete = async () => {
    try {
      await saveProfile.mutateAsync({
        name,
        age: Number(age),
        bio,
        interests,
        photos: photos
          .filter((p) => p.status === "done")
          .map((p) => p.previewUrl),
        location,
        isVerified: false,
        lastSeen: "Just now",
        occupation: "",
        isPremium: false,
        subscriptionStatus: "free",
      });
      toast.success("Welcome to Velora!", {
        description:
          "Your profile is live. Time to discover extraordinary people.",
      });
      navigate({ to: "/discover" });
    } catch {
      toast.error("Something went wrong", { description: "Please try again." });
    }
  };

  const progressIndex = step - 1;
  const showProgress = step >= STEP_BASIC && step <= STEP_LOCATION;
  const showBack = step > STEP_WELCOME && step <= STEP_LOCATION;

  return (
    <div className="min-h-screen bg-background flex flex-col overflow-hidden">
      {step !== STEP_WELCOME && (
        <div className="sticky top-0 z-10 bg-background/95 backdrop-blur-sm px-5 pt-safe">
          <div className="flex items-center justify-between py-4">
            <button
              type="button"
              data-ocid="onboard-back"
              onClick={goBack}
              className={cn(
                "w-10 h-10 rounded-full bg-card border border-border flex items-center justify-center",
                "text-muted-foreground hover:text-foreground hover:border-border/80 transition-smooth",
                !showBack && "invisible pointer-events-none",
              )}
            >
              <ChevronLeft size={20} />
            </button>

            <span className="font-display text-lg font-bold tracking-tight">
              <span className="text-foreground">Vel</span>
              <span className="text-gradient-gold">ora</span>
            </span>

            <span
              className={cn(
                "text-sm text-muted-foreground font-body tabular-nums",
                step >= STEP_PREVIEW && "invisible",
              )}
            >
              {step} of {TOTAL_STEPS - 2}
            </span>
          </div>

          {showProgress && (
            <div className="flex gap-1.5 pb-2">
              {PROGRESS_STEPS.map((stepIdx, i) => (
                <motion.div
                  key={stepIdx}
                  className="h-1 flex-1 rounded-full overflow-hidden bg-muted"
                  layout
                >
                  <motion.div
                    className="h-full gradient-gold rounded-full"
                    initial={{ width: 0 }}
                    animate={{
                      width: i <= progressIndex ? "100%" : "0%",
                    }}
                    transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
                  />
                </motion.div>
              ))}
            </div>
          )}
        </div>
      )}

      {step !== STEP_WELCOME && step !== STEP_PREVIEW && (
        <div className="px-6 pt-6 pb-4">
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25 }}
            >
              <h2 className="font-display text-2xl font-bold text-foreground">
                {step === STEP_BASIC && "Let's get started"}
                {step === STEP_ABOUT && "About you"}
                {step === STEP_INTERESTS && "Your interests"}
                {step === STEP_PHOTOS && "Add your photos"}
                {step === STEP_LOCATION && "Almost there"}
              </h2>
              <p className="text-sm text-muted-foreground font-body mt-1">
                {step === STEP_BASIC && "Tell us a bit about yourself"}
                {step === STEP_ABOUT && "Help us find your ideal match"}
                {step === STEP_INTERESTS && "Select 3 to 6 things you love"}
                {step === STEP_PHOTOS && "Great photos get 3× more connections"}
                {step === STEP_LOCATION && "Where are you based?"}
              </p>
            </motion.div>
          </AnimatePresence>
        </div>
      )}

      <div
        className={cn(
          "flex-1 overflow-y-auto",
          step === STEP_WELCOME ? "" : "px-6 pb-32",
        )}
      >
        <AnimatePresence mode="wait">
          {step === STEP_WELCOME && (
            <WelcomeStep key="welcome" onNext={goNext} />
          )}
          {step === STEP_BASIC && (
            <BasicInfoStep
              key="basic"
              name={name}
              age={age}
              onChangeName={setName}
              onChangeAge={setAge}
              errors={errors}
            />
          )}
          {step === STEP_ABOUT && (
            <AboutStep
              key="about"
              gender={gender}
              genderPref={genderPref}
              bio={bio}
              onChangeGender={setGender}
              onChangeGenderPref={setGenderPref}
              onChangeBio={setBio}
              errors={errors}
            />
          )}
          {step === STEP_INTERESTS && (
            <InterestsStep
              key="interests"
              selected={interests}
              onToggle={toggleInterest}
              errors={errors}
            />
          )}
          {step === STEP_PHOTOS && (
            <PhotoUploadStepInline
              key="photos"
              photos={photos}
              onAdd={addPhoto}
              onRemove={removePhoto}
              onUpdateProgress={updatePhotoProgress}
              errors={errors}
              uploadFile={uploadFile}
            />
          )}
          {step === STEP_LOCATION && (
            <LocationStep
              key="location"
              location={location}
              height={height}
              onChangeLocation={setLocation}
              onChangeHeight={setHeight}
              errors={errors}
            />
          )}
          {step === STEP_PREVIEW && (
            <div key="preview" className="px-6 pt-6 pb-10">
              <ProfilePreviewStep
                name={name}
                age={age}
                bio={bio}
                location={location}
                interests={interests}
                photos={photos}
                onStartDiscovering={handleComplete}
                isLoading={saveProfile.isPending}
              />
            </div>
          )}
        </AnimatePresence>
      </div>

      {step !== STEP_WELCOME && step !== STEP_PREVIEW && (
        <div className="fixed bottom-0 left-0 right-0 px-6 pb-8 pt-4 bg-gradient-to-t from-background via-background/95 to-transparent">
          <motion.button
            type="button"
            data-ocid="onboard-next"
            onClick={goNext}
            whileTap={{ scale: 0.97 }}
            className="w-full h-14 rounded-2xl gradient-gold text-primary-foreground font-display font-semibold text-lg shadow-gold border-0 action-btn flex items-center justify-center gap-2"
          >
            {step === STEP_LOCATION ? "Review Profile" : "Continue"}
          </motion.button>
        </div>
      )}
    </div>
  );
}
