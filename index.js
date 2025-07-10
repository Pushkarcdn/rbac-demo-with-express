import app from "./app.js";
import { server } from "./src/configs/env.config.js";

app.listen(server.port, "0.0.0.0", (err) => {
  if (err) {
    console.error(
      `\nError starting the server on port ${server.port}:\n${err}\n`,
    );
    return;
  }

  console.info(`===========================================`);
  console.info(`======= Environment: ${process.env.NODE_ENV} ========`);
  console.info(`🚀 App listening on the port ${server.port}`);
  console.info(`===========================================`);
});
