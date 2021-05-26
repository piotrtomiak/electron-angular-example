set -ev
PATH=$PATH:$(pwd)/../node_modules/.bin
BUILD_FOLDER=build/desktop
mkdirp ../$BUILD_FOLDER
cp package.json ../$BUILD_FOLDER
cp -f ../build-yarn.lock ../$BUILD_FOLDER/yarn.lock || echo "no build-yarn.lock"
ts-node -O {\"module\":\"CommonJS\"} ../scripts/combine-deps.ts ../$BUILD_FOLDER/package.json ./package.json ../app-backend/package.json

cat ../$BUILD_FOLDER/package.json | sed s/file:\\.\\./file:..\\/../g > ../$BUILD_FOLDER/package.json_ && mv ../$BUILD_FOLDER/package.json_ ../$BUILD_FOLDER/package.json
yarn run build
cp electron-builder.json ../$BUILD_FOLDER
cp -R ./resources ../$BUILD_FOLDER
cp ./icon.png ../$BUILD_FOLDER
cp -R dist/* ../$BUILD_FOLDER
cd ../$BUILD_FOLDER
yarn
cp -f yarn.lock ../../build-yarn.lock
cd ../..
ts-node -O {\"module\":\"CommonJS\"} scripts/patch-electron-notarize.ts
