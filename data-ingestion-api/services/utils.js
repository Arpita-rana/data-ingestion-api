const priorityMap = {
  HIGH: 1,
  MEDIUM: 2,
  LOW: 3,
};

function getOverallStatus(statuses) {
  if (statuses.every((s) => s === "yet_to_start")) return "yet_to_start";
  if (statuses.every((s) => s === "completed")) return "completed";
  return "triggered";
}

module.exports = {
  priorityMap,
  getOverallStatus,
};
