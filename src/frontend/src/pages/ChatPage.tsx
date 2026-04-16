import ChatBubble from "@/components/chat/ChatBubble";
import MessageInput from "@/components/chat/MessageInput";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { useMatches, useMessages, useSendMessage } from "@/hooks/useBackend";
import { cn } from "@/lib/utils";
import type { Message } from "@/types";
import { useNavigate, useParams } from "@tanstack/react-router";
import { format } from "date-fns";
import { ChevronLeft, MoreVertical, Sparkles, UserMinus } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";

// Icebreaker prompts for empty chat
const ICEBREAKERS = [
  "Say hello! 👋",
  "What brings you to Velora?",
  "What's your perfect weekend?",
  "Name one hidden talent ✨",
  "Dream travel destination?",
];

function TimeCluster({ time }: { time: string }) {
  return (
    <div className="flex justify-center my-3">
      <span className="text-[10px] text-muted-foreground/70 bg-muted/20 px-3 py-1 rounded-full font-mono tracking-wide">
        {time}
      </span>
    </div>
  );
}

function EmptyChatState({
  onIcebreaker,
}: { onIcebreaker: (text: string) => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      data-ocid="empty-chat"
      className="flex flex-col items-center justify-center gap-5 text-center py-12 px-6"
    >
      <div className="relative">
        <motion.div
          animate={{ opacity: [0.4, 0.8, 0.4] }}
          transition={{ duration: 2.5, repeat: Number.POSITIVE_INFINITY }}
          className="absolute inset-0 rounded-full gradient-gold blur-lg opacity-30"
        />
        <div className="relative w-20 h-20 rounded-full gradient-gold-subtle border border-primary/20 flex items-center justify-center">
          <Sparkles
            size={32}
            className="text-primary"
            style={{ filter: "drop-shadow(0 0 8px oklch(0.68 0.2 50 / 0.5))" }}
          />
        </div>
      </div>
      <div className="space-y-1.5">
        <p className="font-display text-base font-semibold text-foreground">
          It's a match! ✨
        </p>
        <p className="text-sm text-muted-foreground font-body">
          Start the conversation
        </p>
      </div>

      {/* Icebreaker chips */}
      <div className="flex flex-wrap gap-2 justify-center max-w-[280px]">
        {ICEBREAKERS.map((prompt) => (
          <button
            key={prompt}
            type="button"
            data-ocid={`icebreaker-${prompt.slice(0, 10)}`}
            onClick={() => onIcebreaker(prompt)}
            className="px-3.5 py-2 rounded-2xl text-[12px] font-medium font-body bg-card border border-border/60 text-foreground hover:border-primary/50 hover:bg-primary/10 hover:text-primary transition-smooth action-btn"
          >
            {prompt}
          </button>
        ))}
      </div>
    </motion.div>
  );
}

function buildMessageClusters(messages: Message[]) {
  const clusters: {
    messages: Message[];
    showClusterTime: boolean;
    clusterTime: string;
  }[] = [];
  let currentCluster: Message[] = [];
  let prevTime = 0;

  for (const msg of messages) {
    const msgTime = new Date(msg.sentAt).getTime();
    const gapMinutes = (msgTime - prevTime) / 60000;
    const isNewCluster = gapMinutes > 5 || currentCluster.length === 0;

    if (isNewCluster && currentCluster.length > 0) {
      clusters.push({
        messages: currentCluster,
        showClusterTime: true,
        clusterTime: format(new Date(currentCluster[0].sentAt), "h:mm a"),
      });
      currentCluster = [];
    }
    currentCluster.push(msg);
    prevTime = msgTime;
  }
  if (currentCluster.length > 0) {
    clusters.push({
      messages: currentCluster,
      showClusterTime: clusters.length > 0,
      clusterTime: format(new Date(currentCluster[0].sentAt), "h:mm a"),
    });
  }
  return clusters;
}

export default function ChatPage() {
  const { matchId } = useParams({ from: "/matches/$matchId" });
  const navigate = useNavigate();
  const { data: matches = [] } = useMatches();
  const { data: messages = [], isLoading } = useMessages(matchId);
  const sendMessage = useSendMessage();
  const [showMenu, setShowMenu] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  const match = matches.find((m) => m.id === matchId);
  const user = match?.matchedUser;
  const clusters = buildMessageClusters(messages);

  const messageCount = messages.length;
  // biome-ignore lint/correctness/useExhaustiveDependencies: scroll on new message count
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messageCount]);

  const handleSend = async (text: string) => {
    await sendMessage.mutateAsync({ matchId, content: text });
  };

  const handleIcebreaker = (text: string) => {
    handleSend(text);
  };

  return (
    <div className="flex flex-col h-screen bg-background" data-ocid="chat-page">
      {/* Chat header */}
      <header className="flex items-center gap-3 px-4 py-3 bg-card border-b border-border/60 sticky top-0 z-40 backdrop-blur-xl">
        <button
          type="button"
          data-ocid="chat-back"
          onClick={() => navigate({ to: "/matches" })}
          className="text-muted-foreground hover:text-foreground transition-smooth -ml-1 p-1 rounded-xl hover:bg-muted/40 active:scale-95"
          aria-label="Back to matches"
        >
          <ChevronLeft size={22} />
        </button>

        {user ? (
          <>
            {/* Avatar with online dot */}
            <div className="relative flex-shrink-0">
              <Avatar className="w-10 h-10 border-2 border-border/60">
                <AvatarImage
                  src={user.photos[0]}
                  alt={user.name}
                  className="object-cover"
                />
                <AvatarFallback className="bg-card text-foreground font-display font-bold">
                  {user.name[0]}
                </AvatarFallback>
              </Avatar>
              {/* Online indicator */}
              <span
                data-ocid="online-indicator"
                className="absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-card bg-online"
              />
            </div>

            {/* Name + status */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="font-display font-semibold text-foreground text-[15px] truncate">
                  {user.name}
                </span>
                {user.isVerified && (
                  <Sparkles size={12} className="text-primary flex-shrink-0" />
                )}
              </div>
              <p className="text-[11px] text-muted-foreground flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full flex-shrink-0 inline-block bg-online" />
                Active now
              </p>
            </div>

            {/* Options menu */}
            <div className="relative">
              <button
                type="button"
                data-ocid="chat-menu-btn"
                onClick={() => setShowMenu((v) => !v)}
                className="p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted/40 transition-smooth"
                aria-label="More options"
              >
                <MoreVertical size={18} />
              </button>
              <AnimatePresence>
                {showMenu && (
                  <>
                    <div
                      className="fixed inset-0 z-40"
                      role="button"
                      tabIndex={-1}
                      aria-label="Close menu"
                      onClick={() => setShowMenu(false)}
                      onKeyDown={(e) =>
                        e.key === "Escape" && setShowMenu(false)
                      }
                    />
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95, y: -8 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95, y: -8 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 top-10 z-50 w-44 rounded-2xl bg-card border border-border/60 shadow-elevated overflow-hidden"
                    >
                      <button
                        type="button"
                        data-ocid="unmatch-btn"
                        onClick={() => {
                          setShowMenu(false);
                          navigate({ to: "/matches" });
                        }}
                        className="w-full flex items-center gap-3 px-4 py-3.5 text-sm text-destructive hover:bg-destructive/10 transition-smooth font-medium"
                      >
                        <UserMinus size={15} />
                        Unmatch
                      </button>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>
          </>
        ) : (
          <div className="flex items-center gap-3 flex-1">
            <Skeleton className="w-10 h-10 rounded-full bg-muted/40" />
            <div className="space-y-1.5">
              <Skeleton className="h-3.5 w-24 rounded-full bg-muted/40" />
              <Skeleton className="h-2.5 w-16 rounded-full bg-muted/30" />
            </div>
          </div>
        )}
      </header>

      {/* Messages area */}
      <div
        className="flex-1 overflow-y-auto px-4 py-4"
        data-ocid="messages-area"
      >
        {isLoading ? (
          <div className="space-y-4 pt-2">
            {[
              { w: "w-48", align: "justify-start" },
              { w: "w-36", align: "justify-end" },
              { w: "w-56", align: "justify-start" },
              { w: "w-32", align: "justify-end" },
            ].map((item, i) => (
              // biome-ignore lint/suspicious/noArrayIndexKey: static skeleton
              <div key={i} className={cn("flex", item.align)}>
                <Skeleton
                  className={cn("h-10 rounded-2xl bg-muted/40", item.w)}
                />
              </div>
            ))}
          </div>
        ) : messages.length === 0 ? (
          <EmptyChatState onIcebreaker={handleIcebreaker} />
        ) : (
          <div className="space-y-1">
            {clusters.map((cluster, ci) => (
              // biome-ignore lint/suspicious/noArrayIndexKey: cluster index is stable
              <div key={ci}>
                {cluster.showClusterTime && (
                  <TimeCluster time={cluster.clusterTime} />
                )}
                <div className="space-y-1">
                  {cluster.messages.map((msg, mi) => {
                    const isMe = msg.senderId === "me";
                    const isLastInCluster = mi === cluster.messages.length - 1;
                    return (
                      <ChatBubble
                        key={msg.id}
                        message={msg}
                        isMe={isMe}
                        showTimestamp={false}
                        isLastInCluster={isLastInCluster}
                      />
                    );
                  })}
                </div>
              </div>
            ))}
            {/* Sending indicator */}
            {sendMessage.isPending && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex justify-end pr-1"
              >
                <div className="flex gap-1 items-center px-4 py-2.5 rounded-2xl rounded-br-sm bg-primary/30">
                  {[0, 1, 2].map((i) => (
                    <motion.div
                      key={i}
                      className="w-1.5 h-1.5 rounded-full bg-primary"
                      animate={{ y: [0, -4, 0] }}
                      transition={{
                        duration: 0.6,
                        delay: i * 0.15,
                        repeat: Number.POSITIVE_INFINITY,
                      }}
                    />
                  ))}
                </div>
              </motion.div>
            )}
            <div ref={bottomRef} className="h-2" />
          </div>
        )}
      </div>

      {/* Message input — fixed at bottom */}
      <MessageInput
        onSend={handleSend}
        isPending={sendMessage.isPending}
        disabled={!match}
      />
    </div>
  );
}
