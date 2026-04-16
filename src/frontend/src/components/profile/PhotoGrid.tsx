import { cn } from "@/lib/utils";
import { Plus, X } from "lucide-react";
import { motion } from "motion/react";

interface PhotoGridProps {
  photos: string[];
  editable?: boolean;
  onAdd?: () => void;
  onRemove?: (index: number) => void;
  maxPhotos?: number;
}

export default function PhotoGrid({
  photos,
  editable = false,
  onAdd,
  onRemove,
  maxPhotos = 6,
}: PhotoGridProps) {
  const slots = Array.from({ length: maxPhotos }, (_, i) => photos[i] ?? null);
  const showAddButton = editable && photos.length < maxPhotos;

  return (
    <ul
      data-ocid="photo-grid"
      className="grid grid-cols-3 gap-1.5 list-none p-0 m-0"
      aria-label="Profile photos"
    >
      {slots.map((photo, i) => {
        if (!photo && !showAddButton && i >= photos.length) return null;
        const photoId = photo ? `photo-${photo.slice(-8)}-${i}` : `slot-${i}`;

        return (
          <motion.li
            key={photoId}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.06, duration: 0.3 }}
            className={cn(
              "relative rounded-2xl overflow-hidden bg-card border border-border aspect-square",
              i === 0 ? "col-span-2 row-span-2" : "",
            )}
          >
            {photo ? (
              <>
                <img
                  src={photo}
                  alt={`Profile shot ${i + 1}`}
                  className="w-full h-full object-cover transition-smooth hover:scale-[1.03]"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
                {editable && (
                  <button
                    type="button"
                    onClick={() => onRemove?.(i)}
                    data-ocid={`remove-photo-${i}`}
                    aria-label={`Remove shot ${i + 1}`}
                    className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/60 flex items-center justify-center text-white hover:bg-destructive transition-smooth action-btn"
                  >
                    <X size={13} />
                  </button>
                )}
                {i === 0 && (
                  <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded-full bg-black/40 text-[10px] text-white/80 font-medium backdrop-blur-sm">
                    Main
                  </div>
                )}
              </>
            ) : editable && showAddButton && i === photos.length ? (
              <button
                type="button"
                onClick={onAdd}
                data-ocid="add-photo-btn"
                aria-label="Add new shot"
                className="w-full h-full flex flex-col items-center justify-center gap-2 border-2 border-dashed border-primary/30 rounded-2xl hover:border-primary/60 hover:bg-primary/5 transition-smooth group"
              >
                <div className="w-10 h-10 rounded-full gradient-gold-subtle border border-primary/30 flex items-center justify-center group-hover:border-primary/50 transition-smooth">
                  <Plus size={18} className="text-primary" />
                </div>
                <span className="text-[11px] text-muted-foreground font-body">
                  Add
                </span>
              </button>
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <Plus size={16} className="text-muted-foreground/30" />
              </div>
            )}
          </motion.li>
        );
      })}
    </ul>
  );
}
