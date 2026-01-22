/**
 * Use Cases Router - handles scenario management and report generation
 */

import { z } from "zod";
import { router, protectedProcedure, publicProcedure } from "./_core/trpc";
import { getDb } from "./db";
import { userScenarios, useCaseModifications, sharedReports, userActivityLog } from "../drizzle/schema";
import { eq, and, desc } from "drizzle-orm";
import { nanoid } from "nanoid";

// Scenario modification schema
const modificationSchema = z.object({
  useCaseId: z.string(),
  field: z.string(),
  originalValue: z.number(),
  modifiedValue: z.number(),
  timestamp: z.number(),
});

export const useCasesRouter = router({
  // Get all scenarios for the current user
  getScenarios: protectedProcedure.query(async ({ ctx }) => {
    const db = await getDb();
    if (!db) return [];
    
    const scenarios = await db
      .select()
      .from(userScenarios)
      .where(eq(userScenarios.userId, ctx.user.id))
      .orderBy(desc(userScenarios.updatedAt));
    
    return scenarios;
  }),

  // Get a specific scenario by ID
  getScenario: protectedProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) return null;
      
      const [scenario] = await db
        .select()
        .from(userScenarios)
        .where(and(
          eq(userScenarios.id, input.id),
          eq(userScenarios.userId, ctx.user.id)
        ));
      
      if (!scenario) return null;
      
      // Get modifications for this scenario
      const modifications = await db
        .select()
        .from(useCaseModifications)
        .where(eq(useCaseModifications.scenarioId, scenario.id));
      
      return { ...scenario, modifications };
    }),

  // Create a new scenario
  createScenario: protectedProcedure
    .input(z.object({
      companyName: z.string(),
      scenarioName: z.string(),
      description: z.string().optional(),
      modifications: z.array(modificationSchema).optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");
      
      const result = await db.insert(userScenarios).values({
        userId: ctx.user.id,
        companyName: input.companyName,
        scenarioName: input.scenarioName,
        description: input.description || null,
        modifications: input.modifications || [],
        status: "draft",
      });
      
      return { id: result[0].insertId };
    }),

  // Update a scenario
  updateScenario: protectedProcedure
    .input(z.object({
      id: z.number(),
      scenarioName: z.string().optional(),
      description: z.string().optional(),
      modifications: z.array(modificationSchema).optional(),
      totalAnnualValue: z.number().optional(),
      status: z.enum(["draft", "active", "archived"]).optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");
      
      const updateData: Record<string, unknown> = {};
      if (input.scenarioName) updateData.scenarioName = input.scenarioName;
      if (input.description !== undefined) updateData.description = input.description;
      if (input.modifications) updateData.modifications = input.modifications;
      if (input.totalAnnualValue !== undefined) updateData.totalAnnualValue = input.totalAnnualValue.toString();
      if (input.status) updateData.status = input.status;
      
      await db
        .update(userScenarios)
        .set(updateData)
        .where(and(
          eq(userScenarios.id, input.id),
          eq(userScenarios.userId, ctx.user.id)
        ));
      
      return { success: true };
    }),

  // Delete a scenario
  deleteScenario: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");
      
      // Delete modifications first
      await db
        .delete(useCaseModifications)
        .where(eq(useCaseModifications.scenarioId, input.id));
      
      // Delete the scenario
      await db
        .delete(userScenarios)
        .where(and(
          eq(userScenarios.id, input.id),
          eq(userScenarios.userId, ctx.user.id)
        ));
      
      return { success: true };
    }),

  // Create a shareable report
  createReport: protectedProcedure
    .input(z.object({
      scenarioId: z.number().optional(),
      companyName: z.string().optional(),
      reportType: z.enum(["company", "portfolio", "comparison"]),
      reportConfig: z.record(z.string(), z.unknown()).optional(),
      expiresInDays: z.number().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");
      
      const shareToken = nanoid();
      const expiresAt = input.expiresInDays 
        ? new Date(Date.now() + input.expiresInDays * 24 * 60 * 60 * 1000)
        : null;
      
      await db.insert(sharedReports).values({
        userId: ctx.user.id,
        scenarioId: input.scenarioId || null,
        companyName: input.companyName || null,
        shareToken,
        reportType: input.reportType,
        reportConfig: input.reportConfig || {},
        expiresAt,
      });
      
      return { shareToken };
    }),

  // Get a shared report by token (public access)
  getSharedReport: publicProcedure
    .input(z.object({ token: z.string() }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) return null;
      
      const [report] = await db
        .select()
        .from(sharedReports)
        .where(eq(sharedReports.shareToken, input.token));
      
      if (!report) return null;
      
      // Check expiration
      if (report.expiresAt && new Date(report.expiresAt) < new Date()) {
        return null;
      }
      
      // Increment view count
      await db
        .update(sharedReports)
        .set({ viewCount: report.viewCount + 1 })
        .where(eq(sharedReports.id, report.id));
      
      return report;
    }),

  // Log user activity
  logActivity: protectedProcedure
    .input(z.object({
      action: z.string(),
      details: z.record(z.string(), z.unknown()).optional(),
      companyName: z.string().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) return { success: false };
      
      await db.insert(userActivityLog).values({
        userId: ctx.user.id,
        action: input.action,
        details: input.details || {},
        companyName: input.companyName || null,
      });
      
      return { success: true };
    }),
});
