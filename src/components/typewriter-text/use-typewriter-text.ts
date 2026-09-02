import { useEffect, useState } from "react";
import {
  DELETING_SPEED_MS,
  PAUSE_AFTER_DELETED_MS,
  PAUSE_AFTER_TYPED_MS,
  TYPING_SPEED_MS,
} from "./typewriter-text.data";

export default function useTypewriterText(text: string) {
  const [length, setLength] = useState(0);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (!deleting && length === text.length) {
      const timeout = setTimeout(() => setDeleting(true), PAUSE_AFTER_TYPED_MS);
      return () => clearTimeout(timeout);
    }

    if (deleting && length === 0) {
      const timeout = setTimeout(
        () => setDeleting(false),
        PAUSE_AFTER_DELETED_MS,
      );
      return () => clearTimeout(timeout);
    }

    const timeout = setTimeout(
      () => setLength((current) => current + (deleting ? -1 : 1)),
      deleting ? DELETING_SPEED_MS : TYPING_SPEED_MS,
    );
    return () => clearTimeout(timeout);
  }, [length, deleting, text]);

  return { displayedText: text.slice(0, length) };
}
