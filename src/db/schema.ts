import { relations } from "drizzle-orm";
import { pgTable, uuid, text, timestamp, uniqueIndex, varchar } from "drizzle-orm/pg-core";

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

export const videos = pgTable("videos", {
    id: uuid("id").primaryKey().defaultRandom(),
    title: text("title").notNull(),
    description: text("description"),
    userId: uuid("user_id")
        .references(() => users.id, {
            onDelete: "cascade",
        })
        .notNull(),
    categoryId: uuid("category").references(() => categories.id, { onDelete: "set null" }),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const videoRelations = relations(videos, ({ one }) => ({
    // videos can only have one user (uploader)
    user: one(users, {
        fields: [videos.userId],
        references: [users.id],
    }),
    // categories can only have one user
    categories: one(categories, {
        fields: [videos.categoryId],
        references: [categories.id]
    })
}));
