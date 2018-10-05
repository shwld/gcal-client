#!/bin/bash

PKG_VERSION=`node -pe 'require("./dist/package.json").version'`

echo "version: ${PKG_VERSION}"

electron-packager ./dist "gCalClient" \
  --overwrite \
  --platform=darwin \
  --arch=x64 \
  --electron-version=2.0.11 \
  --asar=true \
  --build-version=${PKG_VERSION} \
  --icon=./icon.icns \
  --app-bundle-id=net.shwld.gCalClient \
  --extend-info="extend.plist" \
  --helper-bundle-id=gCalClient \
  --protocol=gcal \
  --protocol-namegcal=
#   --osx-sign=true

zip -r -y ./"gCalClient-"${PKG_VERSION}-darwin-x64.zip ./"gCalClient"-darwin-x64/"gCalClient".app
