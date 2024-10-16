#!/bin/bash
set -e

# Navigate to the iOS directory where the Podfile is located
cd ios

# Append the use_modular_headers! to the Podfile if not already present
if ! grep -q "use_modular_headers!" Podfile; then
  echo "use_modular_headers!" >> Podfile
fi
