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
        updatedAt: timestamp("created_at").defaultNow().notNull(),
    },
    // index clerkId to query faster
    (t) => [uniqueIndex("clerk_id_idx").on(t.clerkId)]
);
