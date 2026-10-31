import { pgTable, uuid, varchar, timestamp } from "drizzle-orm/pg-core";

export const submission = pgTable("submission", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id").notNull(),
  status: varchar("status", { length: 50 }).notNull().default("pending"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});