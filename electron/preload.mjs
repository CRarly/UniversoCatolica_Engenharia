import { contextBridge } from "electron";

contextBridge.exposeInMainWorld("desktopEnv", {
  isDesktop: true,
  platform: process.platform,
});

