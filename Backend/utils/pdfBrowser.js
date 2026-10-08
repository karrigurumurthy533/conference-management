const fs = require("fs");
const path = require("path");
const chromium = require("@sparticuz/chromium");

let browser = null;
let launchingBrowser = null;
let puppeteer = null;

/* =========================================================
   LOAD PUPPETEER-CORE
   puppeteer-core is ESM
========================================================= */

const loadPuppeteer = async () => {
  if (puppeteer) {
    return puppeteer;
  }

  const puppeteerModule = await import("puppeteer-core");

  puppeteer =
    puppeteerModule.default ||
    puppeteerModule;

  return puppeteer;
};

/* =========================================================
   FIND LOCAL CHROME ON WINDOWS
========================================================= */

const getWindowsChromePath = () => {
  const possiblePaths = [
    // Google Chrome - normal installation
    path.join(
      process.env.PROGRAMFILES || "C:\\Program Files",
      "Google",
      "Chrome",
      "Application",
      "chrome.exe"
    ),

    // Google Chrome - x86 installation
    path.join(
      process.env["PROGRAMFILES(X86)"] ||
        "C:\\Program Files (x86)",
      "Google",
      "Chrome",
      "Application",
      "chrome.exe"
    ),

    // Google Chrome - current Windows user
    path.join(
      process.env.LOCALAPPDATA || "",
      "Google",
      "Chrome",
      "Application",
      "chrome.exe"
    ),

    // Microsoft Edge fallback
    path.join(
      process.env.PROGRAMFILES || "C:\\Program Files",
      "Microsoft",
      "Edge",
      "Application",
      "msedge.exe"
    ),

    // Microsoft Edge x86 fallback
    path.join(
      process.env["PROGRAMFILES(X86)"] ||
        "C:\\Program Files (x86)",
      "Microsoft",
      "Edge",
      "Application",
      "msedge.exe"
    ),
  ];

  for (const executablePath of possiblePaths) {
    if (
      executablePath &&
      fs.existsSync(executablePath)
    ) {
      return executablePath;
    }
  }

  return null;
};

/* =========================================================
   GET EXECUTABLE PATH
========================================================= */

const getExecutablePath = async () => {
  /*
   * -------------------------------------------------------
   * LOCAL WINDOWS DEVELOPMENT
   * -------------------------------------------------------
   */

  if (process.platform === "win32") {
    // Allow manual override from .env
    if (
      process.env.PUPPETEER_EXECUTABLE_PATH &&
      fs.existsSync(
        process.env.PUPPETEER_EXECUTABLE_PATH
      )
    ) {
      console.log(
        "Using Puppeteer executable from environment:",
        process.env.PUPPETEER_EXECUTABLE_PATH
      );

      return process.env.PUPPETEER_EXECUTABLE_PATH;
    }

    const chromePath = getWindowsChromePath();

    if (chromePath) {
      console.log(
        "Using local browser:",
        chromePath
      );

      return chromePath;
    }

    throw new Error(
      [
        "Google Chrome / Microsoft Edge was not found on Windows.",
        "",
        "Install Google Chrome or set:",
        "PUPPETEER_EXECUTABLE_PATH=C:\\\\Program Files\\\\Google\\\\Chrome\\\\Application\\\\chrome.exe",
      ].join("\n")
    );
  }

  /*
   * -------------------------------------------------------
   * LINUX / AWS / SERVERLESS
   * -------------------------------------------------------
   */

  const chromiumPath =
    await chromium.executablePath();

  if (
    !chromiumPath ||
    !fs.existsSync(chromiumPath)
  ) {
    throw new Error(
      `Chromium executable was not found at: ${chromiumPath}`
    );
  }

  console.log(
    "Using @sparticuz/chromium:",
    chromiumPath
  );

  return chromiumPath;
};

/* =========================================================
   GET BROWSER / REUSE BROWSER
========================================================= */

const getBrowser = async () => {
  // -------------------------------------------------------
  // Already running browser
  // -------------------------------------------------------

  if (
    browser &&
    browser.connected
  ) {
    return browser;
  }

  // -------------------------------------------------------
  // Prevent multiple simultaneous launches
  // -------------------------------------------------------

  if (launchingBrowser) {
    return launchingBrowser;
  }

  // -------------------------------------------------------
  // Launch browser
  // -------------------------------------------------------

  launchingBrowser = (async () => {
    try {
      const puppeteerInstance =
        await loadPuppeteer();

      const executablePath =
        await getExecutablePath();

      /*
       * ---------------------------------------------------
       * WINDOWS LOCAL DEVELOPMENT
       * ---------------------------------------------------
       */

      if (process.platform === "win32") {
        browser =
          await puppeteerInstance.launch({
            executablePath,

            headless: true,

            args: [
              "--no-sandbox",
              "--disable-setuid-sandbox",
              "--disable-dev-shm-usage",
              "--disable-gpu",
              "--disable-software-rasterizer",
            ],

            defaultViewport: {
              width: 1280,
              height: 900,
              deviceScaleFactor: 1,
            },
          });
      }

      /*
       * ---------------------------------------------------
       * LINUX / AWS / SERVERLESS
       * ---------------------------------------------------
       */

      else {
        browser =
          await puppeteerInstance.launch({
            executablePath,

            args: [
              ...chromium.args,

              "--no-sandbox",
              "--disable-setuid-sandbox",
              "--disable-dev-shm-usage",
              "--disable-gpu",
            ],

            defaultViewport:
              chromium.defaultViewport,

            headless:
              chromium.headless,
          });
      }

      // ---------------------------------------------------
      // Browser disconnected
      // ---------------------------------------------------

      browser.on(
        "disconnected",
        () => {
          browser = null;
        }
      );

      console.log(
        "Puppeteer browser launched successfully"
      );

      return browser;
    } catch (error) {
      browser = null;

      console.error(
        "Puppeteer browser launch failed:",
        error
      );

      throw error;
    } finally {
      launchingBrowser = null;
    }
  })();

  return launchingBrowser;
};

/* =========================================================
   EXPORT
========================================================= */

module.exports = {
  getBrowser,
};