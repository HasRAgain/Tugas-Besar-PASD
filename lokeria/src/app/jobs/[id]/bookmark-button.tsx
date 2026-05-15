"use client";

import { Button } from "@/components/ui/button";
import { Bookmark, BookmarkCheck } from "lucide-react";
import { toggleBookmark } from "@/actions/bookmarks";
import { useState, useTransition } from "react";
import { toast } from "sonner";

interface BookmarkButtonProps {
  jobId: string;
  isBookmarked: boolean;
  isAuthenticated: boolean;
}

export function BookmarkButton({
  jobId,
  isBookmarked,
  isAuthenticated,
}: BookmarkButtonProps) {
  const [bookmarked, setBookmarked] = useState(isBookmarked);
  const [isPending, startTransition] = useTransition();

  const handleClick = () => {
    if (!isAuthenticated) {
      toast.error("Please sign in to bookmark jobs.");
      return;
    }
    startTransition(async () => {
      const result = await toggleBookmark(jobId);
      if (result.error) {
        toast.error(result.error);
      } else {
        setBookmarked(result.bookmarked ?? false);
        toast.success(result.bookmarked ? "Job saved!" : "Bookmark removed.");
      }
    });
  };

  return (
    <Button
      variant="outline"
      className="w-full gap-2"
      onClick={handleClick}
      disabled={isPending}
    >
      {bookmarked ? (
        <>
          <BookmarkCheck className="h-4 w-4 text-primary" />
          Saved
        </>
      ) : (
        <>
          <Bookmark className="h-4 w-4" />
          Save Job
        </>
      )}
    </Button>
  );
}
