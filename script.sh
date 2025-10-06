#!/bin/bash

if [[ "$VERCEL_GIT_COMMIT_REF" == "main" ]]; then
  # Proceed with the build
  echo "Build can proceed"
  exit 1
else
  # Don't build
  echo "Build cancelled"
  exit 0
fi


# this script is used in vercel.json to conditionally allow builds only on the main branch