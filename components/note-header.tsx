"use client";

import { useState, useEffect, useContext } from "react";
import { format, parseISO } from "date-fns";
import { Input } from "./ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger } from "./ui/select";
import { SessionNotesContext } from "@/app/session-notes";


import Picker from "@emoji-mart/react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";
import { useMobileDetect } from "./mobile-detector";
import { ChevronLeft, Lock, ChevronUp } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";

export default function NoteHeader({
  sessionId,
  note,
  saveNote,
  canEdit,
}: {
  sessionId: string
  note: any;
  saveNote: (updates: Partial<typeof note>) => void;
  canEdit: boolean;
  }) {
  const supabase = createClient();
  const router = useRouter();
  const isMobile = useMobileDetect();
  const pathname = usePathname();
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [formattedDate, setFormattedDate] = useState("");
  const { refreshSessionNotes } = useContext(SessionNotesContext);
  const [isPublic, setPublic] = useState(note.public)

  useEffect(() => {
    setFormattedDate(
      format(parseISO(note.created_at), "MMMM d, yyyy 'at' h:mm a")
    );
  }, [note.created_at]);

  const handleEmojiSelect = (emojiObject: any) => {
    const newEmoji = emojiObject.native;
    saveNote({ emoji: newEmoji });
    setShowEmojiPicker(false);
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    saveNote({ title: e.target.value });
  };

  const handleVisibilityChange = async (value: string) => { 
    try {
      const visibility = value === "public" ? true : false;

      await supabase.rpc("update_note_public", {
        uuid_arg: note.id,
        session_arg: sessionId,
        public_arg: visibility
      });
      setPublic(visibility)

      await fetch("/revalidate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ slug: note.slug }),
      });
      refreshSessionNotes();
      router.refresh();
    }  catch (error) {
      console.error("Update failed:", error);
    }
  }

  return (
    <>
      {isMobile && pathname !== "/" && (
        <Link href="/">
          <button className="pt-2 flex items-center">
            <ChevronLeft className="w-5 h-5 text-[#e2a727]" />
            <span className="text-[#e2a727] text-base ml-1">Notes</span>
          </button>
        </Link>
      )}
      <div className="px-2 bg-[#1c1c1c] mb-4 relative">
        <div className="flex justify-center items-center">
          <p className="text-gray-400 text-xs">{formattedDate}</p>
          <Select value={isPublic ? "public" : "private"} onValueChange={handleVisibilityChange}>
            <SelectTrigger className="w-[12px] ml-2 outline-0 border-0 focus:outline-none focus:ring-0 ">
              {!isPublic && (
                <Badge className="text-xs justify-center items-center">
                  <Lock className="w-3 h-3 mr-1" />
                  Private
                </Badge>
              )}
              </SelectTrigger>
            <SelectContent>
              <SelectItem value="private">Private</SelectItem>
              <SelectItem value="public">Public</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center relative">
          {canEdit && !isPublic && !isMobile ? (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger
                  onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                  className="cursor-pointer mr-2"
                >
                  {note.emoji}
                </TooltipTrigger>
                <TooltipContent className="bg-[#1c1c1c] text-gray-400 border-none">
                  Select an emoji
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ) : (
            <span className="mr-2">{note.emoji}</span>
          )}
          {isPublic || !canEdit ? (
            <span className="text-2xl font-bold flex-grow py-2 leading-normal min-h-[50px]">
              {note.title}
            </span>
          ) : (
            <Input
              id="title"
              value={note.title}
              className="placeholder:text-gray-400 text-2xl font-bold flex-grow py-2 leading-normal min-h-[50px]"
              placeholder="Your title here..."
              onChange={handleTitleChange}
              autoFocus={!note.title}
            />
          )}
        </div>
        {showEmojiPicker && !isMobile && !isPublic && canEdit && (
          <div className="absolute top-full left-0 z-10">
            <Picker
              onEmojiSelect={handleEmojiSelect}
              autoFocus={true}
              searchPosition="top"
              onClickOutside={() => setShowEmojiPicker(false)}
            />
          </div>
        )}
      </div>
    </>
  );
}