// backend/scheduledTasks.js
import cron from "node-cron";
import Battle from "./models/battle.model.js";

// Run every minute
cron.schedule("* * * * *", async () => {
  try {
    const now = new Date();
    const battles = await Battle.find({
      status: "pending",
      commencement: { $lte: now },
    });

    for (const battle of battles) {
      battle.status = "active";
      await battle.save();
      console.log(`Activated battle: ${battle.title}`);
    }
  } catch (error) {
    console.error("Error in battle activation cron:", error);
  }
});