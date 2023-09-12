import yaml

raw = """
RUN_PRE_JOB_OP: ⏳ running pre-job operation...
PRE_JOB_OP_FAILED: ❌ pre-job operation failed - Re-run script...
RUN_IN_PROCESS: 🏃‍♀️ running script...
RUNNING_PYTHON_JOB: "🏃‍♀️ running python job: "
RUN_COMPLETE: 🤙 python script run successful
MISSING_RESULTS: 👽 no result found
JOB_IN_QUEUE: "🎠 queuing python job: "
RESULTS_RETURNED: 🔔 new results - check DEBUG
STANDBY: 🐢 awaiting a new job
BUILDING_TOPOLOGY: 🔨 building flow chart...
SERVER_ONLINE: 🏁 node server online
SERVER_OFFLINE: 🛑 node server offline - run `node server.js` in your terminal
NO_RUNS_YET: ⛷️ No runs yet
MAXIMUM_RUNTIME_EXCEEDED: ⏰ maximum runtime exceeded
COLLECTING_PIP_DEPENDENCIES: 📦 collecting pip dependencies...
INSTALLING_PACKAGES: ✨ installing missing packages...
IMPORTING_NODE_FUNCTIONS: 📦 importing node functions...
IMPORTING_NODE_FUNCTIONS_FAILED: ❌ importing node functions failed
"""

STATUS_CODES = yaml.load(raw, Loader=yaml.Loader)
