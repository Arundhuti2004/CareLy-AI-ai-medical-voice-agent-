import { integer, pgTable, varchar , text, json  } from "drizzle-orm/pg-core";

export const usersTable = pgTable("users", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: varchar({ length: 255 }).notNull(),
  email: varchar({ length: 255 }).notNull().unique(),
  credits:integer()
});


export const sessionsChatTable = pgTable("sessionsChatTable", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  sessionId: varchar().notNull(),
  notes: text(),
  selectedDoctor:json(),
  conversation: json(),
  report: json(),
  CreatedBy: varchar().references(() => usersTable.email),
  CreateOn: varchar(),
});
