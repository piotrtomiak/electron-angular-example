const {notarize} = require("electron-notarize");

exports.default = async function notarizing(context) {
  const {electronPlatformName, appOutDir} = context;

  if (electronPlatformName !== "darwin") {
    return;
  }
  if (!process.env.APP_BUNDLE_ID
      || !process.env.APPLE_ID
      || !process.env.APPLE_ID_PASSWORD) {
    console.log("Skipping notarize, because APP_BUNDLE_ID, APPLE_ID or APPLE_ID_PASSWORD environment variable is not set.")
    return;
  }
  const appName = context.packager.appInfo.productFilename;

  return await notarize({
    appBundleId: process.env.APP_BUNDLE_ID,
    appPath: `${appOutDir}/${appName}.app`,
    appleId: process.env.APPLE_ID,
    appleIdPassword: process.env.APPLE_ID_PASSWORD,
  });
};
