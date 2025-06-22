"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { videoUpdateSchema } from "@/db/schema";
import { snakeCaseToTitle } from "@/lib/utils";
import { THUMBNAIL_FALLBACK } from "@/modules/videos/constants";
import { VideoPlayer } from "@/modules/videos/ui/components/video-player";
import { trpc } from "@/trpc/client";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  CopyCheckIcon,
  CopyIcon,
  Globe2Icon,
  ImagePlusIcon,
  Loader2Icon,
  LockIcon,
  MoreVerticalIcon,
  RefreshCwIcon,
  RotateCcwIcon,
  SparklesIcon,
  TrashIcon,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Suspense, useState } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { ThumbnailGenerateModal } from "../components/thumbnail-generate-modal copy";
import { ThumbnailUploadModal } from "../components/thumbnail-upload-modal";

interface FormSectionProps {
  videoId: string;
}

export const FormSection = ({ videoId }: FormSectionProps) => {
  return (
    <Suspense fallback={<FormSectionSkeleton />}>
      <ErrorBoundary fallback={<p>Error...</p>}>
        <FormSectionSuspense videoId={videoId} />
      </ErrorBoundary>
    </Suspense>
  );
};

const FormSectionSkeleton = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <Skeleton className="h-6 w-40" />
          <Skeleton className="mt-2 h-4 w-60" />
        </div>
        <div className="flex items-center gap-x-2">
          <Skeleton className="h-10 w-20" />
          <Skeleton className="h-10 w-10" />
        </div>
      </div>

      {/* Form Fields */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
        <div className="space-y-8 lg:col-span-3">
          {/* Title Field */}
          <div>
            <Skeleton className="h-5 w-20" />
            <Skeleton className="mt-2 h-10 w-full" />
          </div>

          {/* Description Field */}
          <div>
            <Skeleton className="h-5 w-28" />
            <Skeleton className="mt-2 h-24 w-full" />
          </div>

          {/* Thumbnail Field */}
          <div>
            <Skeleton className="h-5 w-28" />
            <Skeleton className="mt-2 h-[84px] w-[153px]" />
          </div>

          {/* Category Field */}
          <div>
            <Skeleton className="h-5 w-28" />
            <Skeleton className="mt-2 h-10 w-full" />
          </div>
        </div>

        <div className="flex flex-col gap-y-8 lg:col-span-2">
          {/* Video Preview */}
          <Skeleton className="aspect-video w-full" />

          {/* Video Link */}
          <div>
            <Skeleton className="h-5 w-28" />
            <Skeleton className="mt-2 h-6 w-full" />
          </div>

          {/* Video Status */}
          <div>
            <Skeleton className="h-5 w-28" />
            <Skeleton className="mt-2 h-6 w-40" />
          </div>

          {/* Subtitles Status */}
          <div>
            <Skeleton className="h-5 w-28" />
            <Skeleton className="mt-2 h-6 w-40" />
          </div>

          {/* Visibility */}
          <div>
            <Skeleton className="h-5 w-28" />
            <Skeleton className="mt-2 h-10 w-full" />
          </div>
        </div>
      </div>
    </div>
  );
};

export const FormSectionSuspense = ({ videoId }: FormSectionProps) => {
  const router = useRouter();
  const utils = trpc.useUtils();
  const [video] = trpc.studio.getOne.useSuspenseQuery({ id: videoId });
  const [categories] = trpc.categories.getMany.useSuspenseQuery();
  const [thumbnailModalOpen, setThumbnailModalOpen] = useState(false);
  const [thumbnailGenerateModalOpen, setThumbnailGenerateModalOpen] =
    useState(false);

  const revalidate = trpc.videos.revalidate.useMutation({
    onSuccess: () => {
      utils.studio.getMany.invalidate();
      utils.studio.getOne.invalidate({ id: videoId });
      toast.success("Video revalidated");
    },
    onError: () => {
      toast.error("Something went wrong");
    },
  });

  const update = trpc.videos.update.useMutation({
    onSuccess: () => {
      utils.studio.getMany.invalidate();
      utils.studio.getOne.invalidate({ id: videoId });
      toast.success("Updated successfully!");
    },
    onError: () => {
      toast.error("Something went wrong");
    },
  });

  const remove = trpc.videos.remove.useMutation({
    onSuccess: () => {
      utils.studio.getMany.invalidate();
      router.push("/studio");
      toast.success("Video removed");
    },
    onError: () => {
      toast.error("Something went wrong");
    },
  });

  const generateDescription = trpc.videos.generateDescription.useMutation({
    onSuccess: () => {
      toast.success("Background job started", {
        description: (
          <span className="text-gray-500">This may take some time</span>
        ),
      });
    },
    onError: () => {
      toast.error("Something went wrong");
    },
  });

  const generateTitle = trpc.videos.generateTitle.useMutation({
    onSuccess: () => {
      toast.success("Background job started", {
        description: (
          <span className="text-gray-500">This may take some time</span>
        ),
      });
    },
    onError: () => {
      toast.error("Something went wrong");
    },
  });

  const restoreThumbnail = trpc.videos.restoreThumbnail.useMutation({
    onSuccess: () => {
      utils.studio.getMany.invalidate();
      utils.studio.getOne.invalidate({ id: videoId });
      toast.success("Thumbnail restored");
    },
    onError: () => {
      toast.error("Something went wrong");
    },
  });

  const form = useForm<z.infer<typeof videoUpdateSchema>>({
    resolver: zodResolver(videoUpdateSchema),
    defaultValues: video,
  });

  const onSubmit = (data: z.infer<typeof videoUpdateSchema>) => {
    update.mutate(data);
  };

  const fullUrl = `${process.env.NEXT_PUBLIC_URL}/videos/${videoId}`;

  const [isCopied, setIsCopied] = useState(false);
  const onCopy = async () => {
    await navigator.clipboard.writeText(fullUrl);

    setIsCopied(true);

    setTimeout(() => {
      setIsCopied(false);
    }, 2000);
  };

  return (
    <>
      <ThumbnailGenerateModal
        open={thumbnailGenerateModalOpen}
        onOpenChange={setThumbnailGenerateModalOpen}
        videoId={videoId}
      />
      <ThumbnailUploadModal
        open={thumbnailModalOpen}
        onOpenChange={setThumbnailModalOpen}
        videoId={videoId}
      />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">Video details</h1>
              <p className="text-xs text-muted-foreground">
                Manage your video details
              </p>
            </div>
            <div className="flex items-center gap-x-2">
              {/* TODO: toggle permissions for this save button*/}
              <Button type="submit" disabled={update.isPending}>
                {update.isPending ? "Saving..." : "Save"}
              </Button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <MoreVerticalIcon />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem
                    onClick={() => remove.mutate({ id: videoId })}
                    disabled={remove.isPending}
                  >
                    {remove.isPending ? (
                      <>
                        <Loader2Icon className="mr-2 size-4 animate-spin" />
                        Deleting...
                      </>
                    ) : (
                      <>
                        <TrashIcon className="mr-2 size-4" />
                        Delete
                      </>
                    )}
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => revalidate.mutate({ id: videoId })}
                    disabled={revalidate.isPending}
                  >
                    {revalidate.isPending ? (
                      <>
                        <Loader2Icon className="mr-2 size-4 animate-spin" />
                        Revalidating...
                      </>
                    ) : (
                      <>
                        <RefreshCwIcon className="mr-2 size-4" />
                        Revalidate
                      </>
                    )}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
            <div className="space-y-8 lg:col-span-3">
              {/* Title */}
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center">
                      <FormLabel>
                        <div className="flex items-center gap-x-2">Title</div>
                      </FormLabel>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              size="icon"
                              type="button"
                              variant="outline"
                              className="right-1 border-none shadow-none"
                              onClick={() =>
                                generateTitle.mutate({ id: videoId })
                              }
                              disabled={
                                generateTitle.isPending || !video.muxTrackId
                              }
                            >
                              {generateTitle.isPending ? (
                                <Loader2Icon className="animate-spin" />
                              ) : (
                                <SparklesIcon />
                              )}
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>AI-generated</TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="Add a title to your video"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Description */}
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center">
                      <FormLabel>Description</FormLabel>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              size="icon"
                              type="button"
                              variant="outline"
                              className="right-1 border-none shadow-none"
                              onClick={() =>
                                generateDescription.mutate({ id: videoId })
                              }
                              disabled={
                                generateDescription.isPending ||
                                !video.muxTrackId
                              }
                            >
                              {generateDescription.isPending ? (
                                <Loader2Icon className="animate-spin" />
                              ) : (
                                <SparklesIcon />
                              )}
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>AI-generated</TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                    <FormControl>
                      <Textarea
                        {...field}
                        value={field.value ?? ""}
                        rows={10}
                        className="resize-none pr-10"
                        placeholder="Add a description to your video"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Thumbnail */}
              <FormField
                name="thumbnailUrl"
                control={form.control}
                render={() => (
                  <FormItem>
                    <FormLabel>Thumbnail</FormLabel>
                    <FormControl>
                      <div className="group relative h-[84px] w-[153px] border border-dashed border-neutral-400 p-0.5">
                        <Image
                          fill
                          alt="thumbnail"
                          src={video.thumbnailUrl ?? THUMBNAIL_FALLBACK}
                        />
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              type="button"
                              size="icon"
                              className="absolute right-1 top-1 size-7 rounded-full bg-black/50 opacity-100 duration-300 hover:bg-black/50 group-hover:opacity-100 md:opacity-0"
                            >
                              <MoreVerticalIcon className="text-white" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="start" side="right">
                            <DropdownMenuItem
                              onClick={() => setThumbnailModalOpen(true)}
                            >
                              <ImagePlusIcon className="mr-1 size-4" />
                              Change
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() =>
                                setThumbnailGenerateModalOpen(true)
                              }
                            >
                              <SparklesIcon className="mr-1 size-4" />
                              AI-generated
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() =>
                                restoreThumbnail.mutate({ id: videoId })
                              }
                            >
                              <RotateCcwIcon className="mr-1 size-4" />
                              Restore
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </FormControl>
                  </FormItem>
                )}
              />

              {/* Category */}
              <FormField
                control={form.control}
                name="categoryId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value ?? undefined}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category.id} value={category.id}>
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="flex flex-col gap-y-8 lg:col-span-2">
              <div className="flex h-fit flex-col gap-4 overflow-hidden rounded-xl bg-[#f9f9f9]">
                {/* Video Preview */}
                <div className="relative aspect-video overflow-hidden">
                  <VideoPlayer
                    playbackId={video.muxPlaybackId}
                    thumbnailUrl={video.thumbnailUrl}
                  />
                </div>

                {/* Link to video */}
                <div className="flex flex-col gap-y-6 p-4">
                  <div className="flex items-center justify-between gap-x-2">
                    <div className="flex flex-col gap-y-1">
                      <p className="text-xs text-muted-foreground">
                        Video link
                      </p>
                      <div className="flex items-center gap-x-2">
                        <Link href={`/videos/${video.id}`}>
                          <p className="line-clamp-1 text-sm text-blue-500">
                            {fullUrl}
                          </p>
                        </Link>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="shrink-0"
                          onClick={onCopy}
                          disabled={isCopied}
                        >
                          {isCopied ? <CopyCheckIcon /> : <CopyIcon />}
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* Video Status */}
                  <div className="flex items-center justify-between">
                    <div className="flex flex-col gap-y-1">
                      <p className="text-xs text-muted-foreground">
                        Video status
                      </p>
                      <p className="text-sm">
                        {snakeCaseToTitle(video.muxStatus ?? "Preparing")}
                      </p>
                    </div>
                  </div>

                  {/* Subtitles Status */}
                  <div className="flex items-center justify-between">
                    <div className="flex flex-col gap-y-1">
                      <p className="text-xs text-muted-foreground">
                        Subtitles status
                      </p>
                      <p className="text-sm">
                        {snakeCaseToTitle(
                          video.muxTrackStatus ?? "No subtitles"
                        )}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Visiblity */}
              <FormField
                control={form.control}
                name="visibility"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Visibility</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value ?? undefined}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select visibility" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="public">
                          <div className="flex items-center">
                            <Globe2Icon className="mr-2 size-4" />
                            Public
                          </div>
                        </SelectItem>
                        <SelectItem value="private">
                          <div className="flex items-center">
                            <LockIcon className="mr-2 size-4" />
                            Private
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
        </form>
      </Form>
    </>
  );
};
