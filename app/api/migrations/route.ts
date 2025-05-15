import { NextRequest, NextResponse } from "next/server";
import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import * as schema from "@/database/schema";
import fs from "fs";
import path from "path";

export const dynamic = "force-dynamic";

// Simple migration function to help apply SQL migrations
export async function GET(req: NextRequest) {
  try {
    const authHeader = req.headers.get("authorization");
    if (!authHeader || authHeader !== `Bearer ${process.env.MIGRATIONS_SECRET}`) {
      return new NextResponse(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
      });
    }

    const sql = neon(process.env.DATABASE_URL!);
    const db = drizzle(sql, { schema });

    // Get all migration files
    const migrationsDir = path.join(process.cwd(), "migrations");
    const migrationFiles = fs
      .readdirSync(migrationsDir)
      .filter((file) => file.endsWith(".sql") && !file.includes("_"))
      .sort();

    const results = [];
    
    // Apply each migration
    for (const file of migrationFiles) {
      const filePath = path.join(migrationsDir, file);
      const migration = fs.readFileSync(filePath, "utf8");
      
      try {
        // Use template literals for SQL execution
        await sql`${migration}`;
        results.push({ file, status: "success" });
      } catch (error: any) {
        results.push({ 
          file, 
          status: "error", 
          message: error.message 
        });
      }
    }

    return NextResponse.json({ 
      success: true, 
      message: "Migrations applied", 
      results 
    });
    
  } catch (error: any) {
    console.error("Migration error:", error);
    return NextResponse.json({ 
      success: false, 
      error: error.message 
    }, { 
      status: 500 
    });
  }
} 