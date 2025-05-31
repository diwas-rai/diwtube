import { relations } from "drizzle-orm";
import {
    integer,
    pgEnum,
    pgTable,
    primaryKey,
    text,
    timestamp,
    uniqueIndex,
    uuid,
    varchar,
} from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema, createUpdateSchema } from "drizzle-zod";
// use text instead of varchar for fields where unsure of length
export const users = pgTable(
    "users",
    {
        id: uuid("id").primaryKey().defaultRandom(),
        clerkId: text("clerk_id").unique().notNull(),
        name: varchar("name", { length: 255 }).notNull(),
        imageUrl: text("image_url").notNull(),
        createdAt: timestamp("created_at").defaultNow().notNull(),
        updatedAt: timestamp("updated_at").defaultNow().notNull(),
    },
    // index clerkId to query faster
    (t) => [uniqueIndex("clerk_id_idx").on(t.clerkId)]
);

export const userRelations = relations(users, ({ many }) => ({
    videos: many(videos), // user can have many videos
    videoViews: many(videoViews), // user can have many video views
    videoReactions: many(videoReactions), // user can have many video reactions
    subscriptions: many(subscriptions, {
        relationName: "subscription_viewer_id_fkey",
    }),
    subscribers: many(subscriptions, {
        relationName: "subscription_creator_id_fkey",
    }),
}));

export const categories = pgTable(
    "categories",
    {
        id: uuid("id").primaryKey().defaultRandom(),
        name: text("name").notNull().unique(),
        description: text("description"),
        createdAt: timestamp("created_at").defaultNow().notNull(),
        updatedAt: timestamp("updated_at").defaultNow().notNull(),
    },
    (t) => [uniqueIndex("name_idx").on(t.name)]
);

export const categoriesRelations = relations(categories, ({ many }) => ({
    videos: many(videos), // categories can have many videos
}));

export const videoVisibility = pgEnum("video_visibility", ["private", "public"]);

export const videos = pgTable("videos", {
    id: uuid("id").primaryKey().defaultRandom(),
    title: text("title").notNull(),
    description: text("description"),
    muxStatus: text("mux_status"),
    muxAssetId: text("mux_asset_id").unique(),
    muxUploadId: text("mux_upload_id").unique(),
    muxPlaybackId: text("mux_playback_id").unique(),
    muxTrackId: text("mux_track_id").unique(),
    muxTrackStatus: text("mux_track_status"),
    thumbnailUrl: text("thumbnail_url"),
    thumbnailKey: text("thumbnail_key"),
    previewUrl: text("preview_url"),
    previewKey: text("preview_key"),
    duration: integer("duration").default(0).notNull(),
    visibility: videoVisibility("visibility").default("private").notNull(),
    userId: uuid("user_id")
        .references(() => users.id, {
            onDelete: "cascade",
        })
        .notNull(),
    categoryId: uuid("category_id").references(() => categories.id, { onDelete: "set null" }),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const videoInsertSchema = createInsertSchema(videos);
export const videoUpdateSchema = createUpdateSchema(videos);
export const videoSelectSchema = createSelectSchema(videos);

export const videoRelations = relations(videos, ({ one, many }) => ({
    // videos can only have one user (uploader)
    user: one(users, {
        fields: [videos.userId],
        references: [users.id],
    }),
    // videos can only have one category
    category: one(categories, {
        fields: [videos.categoryId],
        references: [categories.id],
    }),
    // videos can have many views
    videoViews: many(videoViews),
    // video can have many reactions
    videoReactions: many(videoReactions),
}));

export const videoViews = pgTable(
    "video_views",
    {
        userId: uuid("user_id")
            .references(() => users.id, { onDelete: "cascade" })
            .notNull(),
        videoId: uuid("video_id")
            .references(() => videos.id, { onDelete: "cascade" })
            .notNull(),
        createdAt: timestamp("created_at").defaultNow().notNull(),
        updatedAt: timestamp("updated_at").defaultNow().notNull(),
    },
    (t) => [
        primaryKey({
            name: "video_views_pk",
            columns: [t.userId, t.videoId],
        }),
    ]
);

export const videoViewRelations = relations(videoViews, ({ one }) => ({
    user: one(users, {
        fields: [videoViews.userId],
        references: [users.id],
    }),
    video: one(videos, {
        fields: [videoViews.videoId],
        references: [videos.id],
    }),
}));

export const videoViewSelectSchema = createSelectSchema(videoViews);
export const videoViewInsertSchema = createInsertSchema(videoViews);
export const videoViewUpdateSchema = createUpdateSchema(videoViews);

export const videoReactionType = pgEnum("video_reaction_type", ["like", "dislike"]);

export const videoReactions = pgTable(
    "video_reactions",
    {
        userId: uuid("user_id")
            .references(() => users.id, { onDelete: "cascade" })
            .notNull(),
        videoId: uuid("video_id")
            .references(() => videos.id, { onDelete: "cascade" })
            .notNull(),
        reaction: videoReactionType("reaction"),
        createdAt: timestamp("created_at").defaultNow().notNull(),
        updatedAt: timestamp("updated_at").defaultNow().notNull(),
    },
    (t) => [primaryKey({ name: "video_reactions_pk", columns: [t.userId, t.videoId] })]
);

export const videoReactionRelations = relations(videoReactions, ({ one }) => ({
    user: one(users, {
        fields: [videoReactions.userId],
        references: [users.id],
    }),
    video: one(videos, {
        fields: [videoReactions.videoId],
        references: [videos.id],
    }),
}));

export const videoReactionSelectSchema = createSelectSchema(videoReactions);
export const videoReactionInsertSchema = createInsertSchema(videoReactions);
export const videoReactionUpdateSchema = createUpdateSchema(videoReactions);

export const subscriptions = pgTable(
    "subscriptions",
    {
        viewerId: uuid("user_id")
            .references(() => users.id, { onDelete: "cascade" })
            .notNull(),
        creatorId: uuid("creator_id")
            .references(() => users.id, { onDelete: "cascade" })
            .notNull(),
        createdAt: timestamp("created_at").defaultNow().notNull(),
        updatedAt: timestamp("updated_at").defaultNow().notNull(),
    },
    (t) => [
        primaryKey({
            name: "susbcriptions_pk",
            columns: [t.viewerId, t.creatorId],
        }),
    ]
);

export const subscriptionRelations = relations(subscriptions, ({ one }) => ({
    viewerId: one(users, {
        fields: [subscriptions.viewerId],
        references: [users.id],
        relationName: "subscription_viewer_id_fkey",
    }),
    creatorId: one(users, {
        fields: [subscriptions.creatorId],
        references: [users.id],
        relationName: "subscription_creator_id_fkey",
    }),
}));
