#!/bin/bash
set -euo pipefail

ZIP_NAME="my_deployment_package.zip"
PKG_DIR="package"
FILES_TO_ADD=("lambda_function.py")

echo "Cleaning old build..."
rm -f "$ZIP_NAME"
rm -rf "$PKG_DIR"

echo "Installing dependencies for Lambda (Python 3.13, ARM64)..."
docker run --rm --platform linux/arm64 \
  --entrypoint /bin/bash \
  -v "$PWD":/mnt -w /mnt \
  public.ecr.aws/lambda/python:3.13 \
  -c "pip install --no-cache-dir -r requirements.txt -t $PKG_DIR/"

echo "Zipping dependencies..."
( cd "$PKG_DIR" && zip -r9 "../$ZIP_NAME" . -x '*.DS_Store' >/dev/null )

echo "Adding source files..."
for f in "${FILES_TO_ADD[@]}"; do
  [[ -f $f ]] && zip -g "$ZIP_NAME" "$f" >/dev/null || echo "⚠️  Skipping missing file: $f"
done

echo "Verifying pydantic_core architecture..."
find "$PKG_DIR" -name '*pydantic_core*.so' -exec file {} \; || echo "⚠️  pydantic_core .so not found!"

echo "Done: $ZIP_NAME"
