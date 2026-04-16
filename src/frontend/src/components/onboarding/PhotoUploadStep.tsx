import { cn } from "@/lib/utils";
import { GripVertical, ImagePlus, Loader2, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useRef, useState } from "react";

export interface UploadedPhoto {
  fileBytes?: Uint8Array;
  previewUrl: string;
  name: string;
  progress: number;
  status: "uploading" | "done" | "error";
}

interface PhotoUploadStepProps {
  photos: UploadedPhoto[];
  onAdd: (photo: UploadedPhoto) => void;
  onRemove: (index: number) => void;
  onReorder: (from: number, to: number) => void;
  onUpdateProgress: (
    index: number,
    progress: number,
    status: UploadedPhoto["status"],
  ) => void;
  errors: Record<string, string | undefined>;
}

const SLOTS = 6;

export default function PhotoUploadStep({
  photos,
  onAdd,
  onRemove,
  errors,
}: PhotoUploadStepProps) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState<number | null>(null);

  const handleFiles = async (files: FileList | null) => {
    if (!files) return;
    const available = SLOTS - photos.length;
    const toProcess = Array.from(files).slice(0, available);

    for (const file of toProcess) {
      if (!file.type.startsWith("image/")) continue;
      const previewUrl = URL.createObjectURL(file);
      const fileBytes = new Uint8Array(await file.arrayBuffer());

      onAdd({
        fileBytes,
        previewUrl,
        name: file.name,
        progress: 100,
        status: "done",
      });
    }
  };

  const slots = Array.from({ length: SLOTS }, (_, i) => photos[i] ?? null);

  return (
    <motion.div
      key="photos"
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
        onChange={(e) => handleFiles(e.target.files)}
        data-ocid="photo-file-input"
      />

      <div className="grid grid-cols-3 gap-2.5">
        {slots.map((photo, i) => {
          const slotKey = photo ? `filled-${photo.name}-${i}` : `empty-${i}`;
          return (
            <motion.div key={slotKey} layout className="relative aspect-[3/4]">
              {photo ? (
                <div
                  className={cn(
                    "w-full h-full rounded-2xl overflow-hidden relative shadow-card",
                    "border border-border",
                  )}
                >
                  <img
                    src={photo.previewUrl}
                    alt={`Portrait slot ${i + 1}`}
                    className="w-full h-full object-cover"
                  />

                  {/* Upload progress overlay */}
                  <AnimatePresence>
                    {photo.status === "uploading" && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 bg-background/70 flex flex-col items-center justify-center gap-2"
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
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Primary badge */}
                  {i === 0 && (
                    <div className="absolute top-2 left-2 px-2 py-0.5 rounded-full gradient-gold text-primary-foreground text-[10px] font-display font-semibold">
                      Main
                    </div>
                  )}

                  {/* Remove button */}
                  <button
                    type="button"
                    data-ocid={`remove-photo-${i}`}
                    onClick={() => onRemove(i)}
                    aria-label="Remove this portrait"
                    className="absolute top-2 right-2 w-6 h-6 rounded-full bg-background/80 backdrop-blur-sm flex items-center justify-center border border-border hover:border-destructive/60 transition-smooth"
                  >
                    <X size={12} className="text-muted-foreground" />
                  </button>

                  {/* Drag handle */}
                  <div className="absolute bottom-2 left-1/2 -translate-x-1/2">
                    <GripVertical size={14} className="text-foreground/40" />
                  </div>
                </div>
              ) : (
                <button
                  type="button"
                  data-ocid={
                    i === 0 ? "upload-photo-primary" : `upload-photo-${i}`
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
                    "w-full h-full rounded-2xl border-2 border-dashed flex flex-col items-center justify-center gap-2",
                    "transition-smooth group",
                    dragOver === i
                      ? "border-primary bg-card"
                      : "border-border bg-card/50 hover:border-primary/50 hover:bg-card",
                  )}
                >
                  <div
                    className={cn(
                      "w-9 h-9 rounded-xl flex items-center justify-center transition-smooth",
                      "gradient-gold-subtle border border-primary/20 group-hover:shadow-gold",
                    )}
                  >
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
          <p className="text-xs font-body text-primary/90 text-center">
            {errors.photos}
          </p>
        )}
      </div>
    </motion.div>
  );
}
