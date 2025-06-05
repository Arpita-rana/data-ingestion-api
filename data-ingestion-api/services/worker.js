const { queue, store } = require("./store");

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function processBatch(batch_id) {
  const batch = store.batches[batch_id];
  if (!batch) return;

  store.batches[batch_id].status = "triggered";

  // Log batch start
  console.log(`[⏳] Started processing batch: ${batch_id}`);
  console.log(`     → IDs: [${batch.ids.join(", ")}]`);
  console.log(`     → Priority: ${batch.priority}`);
  console.log(`     → Created At: ${new Date(batch.created_time).toISOString()}`);

  await delay(1000); // Simulate external API delay for batch

  store.batches[batch_id].status = "completed";

  // Log batch complete
  console.log(`[✅] Completed batch: ${batch_id}`);
  console.log(`     → IDs: [${batch.ids.join(", ")}]`);
  console.log(`     → Status: ${store.batches[batch_id].status}`);
  console.log("------------------------------------------------------");
}

async function startWorker() {
  while (true) {
    if (queue.length > 0) {
      // Sort queue by priority (lower number = higher priority) then by created_time
      queue.sort((a, b) =>
        a.priority === b.priority
          ? a.created_time - b.created_time
          : a.priority - b.priority
      );

      const job = queue.shift();

      console.log(`\n[⚙️] Fetching next batch from queue...`);
      console.log(`     → Selected Batch ID: ${job.batch_id}`);
      console.log(`     → Priority: ${job.priority}`);
      console.log(`     → Scheduled At: ${new Date(job.created_time).toISOString()}`);

      await processBatch(job.batch_id);

      console.log(`[⏱] Waiting for 5 seconds to respect rate limit...\n`);
      await delay(5000); // Enforce rate limit: 1 batch per 5 sec
    } else {
      await delay(1000); // Check queue again in 1 sec
    }
  }
}

module.exports = { startWorker };
