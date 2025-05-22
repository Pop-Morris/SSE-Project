/*
  Warnings:

  - Added the required column `category` to the `Workflow` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Workflow" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "category" TEXT NOT NULL DEFAULT 'order',
    "triggerEvent" TEXT NOT NULL,
    "conditionType" TEXT NOT NULL,
    "threshold" REAL NOT NULL,
    "actionType" TEXT NOT NULL,
    "actionValue" TEXT NOT NULL,
    "webhookId" INTEGER,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_Workflow" ("actionType", "actionValue", "conditionType", "createdAt", "id", "name", "threshold", "triggerEvent", "updatedAt", "webhookId", "category") 
SELECT "actionType", "actionValue", "conditionType", "createdAt", "id", "name", "threshold", "triggerEvent", "updatedAt", "webhookId", 'order' FROM "Workflow";
DROP TABLE "Workflow";
ALTER TABLE "new_Workflow" RENAME TO "Workflow";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
