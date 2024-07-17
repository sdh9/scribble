"use client";

import { useState } from "react";
import { Textarea } from "./ui/textarea";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import Editor from './ui/editor'
import { BalloonEditor, EventInfo } from "ckeditor5";

export default function NoteContent({
  note,
  saveNote,
  canEdit,
}: {
  note: any;
  saveNote: (updates: Partial<typeof note>) => void;
  canEdit: boolean;
}) {
  const [isEditing, setIsEditing] = useState(!note.content && canEdit);

  const handleChange = (event: EventInfo, editor: BalloonEditor) => {
    saveNote({ content: editor.getData() });
  };

  return (
    <div className="px-2">
      <Editor
        content={note.content}
        onChange={handleChange}
        onFocus={() => setIsEditing(true)}
        onBlur={() => setIsEditing(false)}
        isEditable={canEdit && !note.public}
      />
    </div>
  );
}