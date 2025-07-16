#!/bin/bash
cd /home/kavia/workspace/code-generation/digital-id-management-dashboard-6cdc8ceb/digital_id_frontend
npm run build
EXIT_CODE=$?
if [ $EXIT_CODE -ne 0 ]; then
   exit 1
fi

