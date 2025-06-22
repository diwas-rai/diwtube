import { relations } from "drizzle-orm";
import {
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";
import {
  comments,
  subscriptions,
  videoReactions,
  videos,
  videoViews,
} from "../schema";

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
  comments: many(comments),
}));
