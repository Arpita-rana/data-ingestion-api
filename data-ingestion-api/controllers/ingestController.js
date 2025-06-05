const { v4: uuidv4 } = require("uuid");
const { store, queue } = require("../services/store");
const { priorityMap, getOverallStatus } = require("../services/utils");

exports.ingestData = (req, res) => {
  const { ids, priority } = req.body;
  const ingestion_id = uuidv4();
  const created_time = Date.now();
  const batches = [];

  for (let i = 0; i < ids.length; i += 3) {
    const batch_ids = ids.slice(i, i + 3);
    const batch_id = uuidv4();

    store.batches[batch_id] = {
      batch_id,
      ids: batch_ids,
      status: "yet_to_start",
      priority,
      ingestion_id,
      created_time,
    };

    batches.push(batch_id);
    queue.push({
      priority: priorityMap[priority],
      created_time,
      batch_id,
    });
  }

  store.ingestions[ingestion_id] = { batches, created_time };
  res.json({ ingestion_id });
};

exports.getStatus = (req, res) => {
  const ingestion_id = req.params.ingestion_id;
  const ingestion = store.ingestions[ingestion_id];

  if (!ingestion) {
    return res.status(404).json({ error: "Invalid ingestion_id" });
  }

  const batchDetails = ingestion.batches.map((batch_id) => {
    const b = store.batches[batch_id];
    return {
      batch_id,
      ids: b.ids,
      status: b.status,
    };
  });

  const overallStatus = getOverallStatus(batchDetails.map(b => b.status));

  res.json({
    ingestion_id,
    status: overallStatus,
    batches: batchDetails,
  });
};
