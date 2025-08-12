"use client";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import { useState } from "react";
import { PlaylistCreateModal } from "../components/playlist-create-modal";
import { PlaylistsSection } from "../sections/playlists-section";

export const PlaylistsView = () => {
  const [PlaylistCreateModalOpen, setPlaylistCreateModalOpen] = useState(false);

  return (
    <div className="mx-auto mb-10 flex max-w-[2400px] flex-col gap-y-6 px-4 pt-2.5">
      <PlaylistCreateModal
        open={PlaylistCreateModalOpen}
        onOpenChange={setPlaylistCreateModalOpen}
      />
      <div className="flex items-center justify-between">
        <div>
          <div className="flex flex-row items-center gap-1">
            <h1 className="text-3xl font-bold">Playlists</h1>
          </div>
        </div>
        <Button
          variant="outline"
          size="icon"
          className="rounded-full"
          onClick={() => {
            setPlaylistCreateModalOpen(true);
          }}
        >
          {<PlusIcon />}
        </Button>
      </div>
      <PlaylistsSection />
    </div>
  );
};
