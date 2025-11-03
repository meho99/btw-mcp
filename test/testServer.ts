import { AddressInfo } from "net";
import { Server } from "http";
import { createApp } from "../src/server";

const listenAsync = async (
  app: ReturnType<typeof createApp>,
  port: number = 0
): Promise<{ server: Server; port: number }> => {
  return new Promise((resolve, reject) => {
    const serverInstance = app.listen(port, () => {
      const address = serverInstance.address() as AddressInfo;
      resolve({ server: serverInstance, port: address.port });
    });

    serverInstance.on("error", reject);
  });
};

const closeAsync = async (server: Server): Promise<void> => {
  return new Promise((resolve, reject) => {
    server.close(err => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
};

export const createTestServer = async (): Promise<{
  port: number;
  close: () => Promise<void>;
}> => {
  const app = createApp();

  try {
    // Use port 0 for dynamic allocation - each server gets its own port
    const { server, port } = await listenAsync(app, 0);

    const close = async (): Promise<void> => {
      await closeAsync(server);
    };

    return { port, close };
  } catch (error) {
    throw new Error(`Server failed to start: ${error}`);
  }
};
