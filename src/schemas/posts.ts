import { pgTable, serial, integer, varchar } from 'drizzle-orm/pg-core';
import { users } from "$schemas/users"
import { relations } from 'drizzle-orm';

export const posts = pgTable("Posts",
    {
        id: serial("id").primaryKey(),
        userId: integer("userId").notNull().references(() => users.id),
        data: varchar("data", { length: 255 }).notNull(),
    }
)

export const userRelation = relations(posts, ({ one }) => ({
    user: one(users, { fields: [posts.userId], references: [users.id] })
}))

export type Post = typeof posts.$inferSelect
export type NewPost = typeof posts.$inferInsert
