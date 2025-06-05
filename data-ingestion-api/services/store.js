const store = {
  ingestions: {},
  batches: {},
};

const queue = []; // [{ priority, created_time, batch_id }]

module.exports = { store, queue };
