import { int, mysqlEnum, mysqlTable, text, timestamp, varchar, json, decimal } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * User scenarios - stores user-modified calculation scenarios
 * Each user can have multiple scenarios for different companies
 */
export const userScenarios = mysqlTable("user_scenarios", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  companyName: varchar("companyName", { length: 255 }).notNull(),
  scenarioName: varchar("scenarioName", { length: 255 }).notNull(),
  description: text("description"),
  /** JSON blob containing all modified values */
  modifications: json("modifications"),
  /** Calculated total annual value based on modifications */
  totalAnnualValue: decimal("totalAnnualValue", { precision: 15, scale: 2 }),
  /** Status of the scenario */
  status: mysqlEnum("status", ["draft", "active", "archived"]).default("draft").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type UserScenario = typeof userScenarios.$inferSelect;
export type InsertUserScenario = typeof userScenarios.$inferInsert;

/**
 * Use case modifications - stores individual use case parameter changes
 */
export const useCaseModifications = mysqlTable("use_case_modifications", {
  id: int("id").autoincrement().primaryKey(),
  scenarioId: int("scenarioId").notNull(),
  useCaseId: varchar("useCaseId", { length: 50 }).notNull(),
  useCaseName: varchar("useCaseName", { length: 255 }).notNull(),
  /** JSON blob containing modified parameters */
  parameters: json("parameters"),
  /** Original values for comparison */
  originalValues: json("originalValues"),
  /** Calculated benefit after modifications */
  calculatedBenefit: decimal("calculatedBenefit", { precision: 15, scale: 2 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type UseCaseModification = typeof useCaseModifications.$inferSelect;
export type InsertUseCaseModification = typeof useCaseModifications.$inferInsert;

/**
 * Shared reports - stores generated shareable reports
 */
export const sharedReports = mysqlTable("shared_reports", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  scenarioId: int("scenarioId"),
  companyName: varchar("companyName", { length: 255 }),
  /** Unique share token for public access */
  shareToken: varchar("shareToken", { length: 64 }).notNull().unique(),
  /** Report type: company, portfolio, comparison */
  reportType: mysqlEnum("reportType", ["company", "portfolio", "comparison"]).notNull(),
  /** JSON blob containing report configuration */
  reportConfig: json("reportConfig"),
  /** Expiration date for the share link */
  expiresAt: timestamp("expiresAt"),
  /** View count for analytics */
  viewCount: int("viewCount").default(0).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type SharedReport = typeof sharedReports.$inferSelect;
export type InsertSharedReport = typeof sharedReports.$inferInsert;

/**
 * User activity log - tracks user interactions for analytics
 */
export const userActivityLog = mysqlTable("user_activity_log", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId"),
  sessionId: varchar("sessionId", { length: 64 }),
  action: varchar("action", { length: 100 }).notNull(),
  /** JSON blob containing action details */
  details: json("details"),
  companyName: varchar("companyName", { length: 255 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type UserActivityLog = typeof userActivityLog.$inferSelect;
export type InsertUserActivityLog = typeof userActivityLog.$inferInsert;
