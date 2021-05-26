set -ev

#Mark link targets

#app-common
cd app-common
yarn link
cd ../

#app-backend
cd app-backend
yarn link
cd ..

#Configure links
cd app-backend
yarn link app-common
cd ..

cd app-frontend
yarn link app-common
cd ..

cd app-electron
yarn link app-common
yarn link app-backend
cd ..
