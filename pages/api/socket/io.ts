import { Server as NetServer } from "http";
import { NextApiRequest } from "next";
import { Server as ServerIO } from "socket.io";

// Import your custom NextApiResponseServerIo type
import { NextApiResponseServerIo } from "@/types";

export const config = {
  api: {
    bodyParser: false,
  },
};

const ioHandler = (req: NextApiRequest, res: NextApiResponseServerIo) => {
  // Check if the Socket.IO server is already initialized
  if (!res.socket.server.io) {
    const path = "/api/socket/io";

    // Cast the server socket to the correct type
    const httpServer: NetServer = res.socket.server as unknown as NetServer;

    // Initialize the Socket.IO server
    const io = new ServerIO(httpServer, {
      path: path,
      addTrailingSlash: false,
    });

    // Assign the Socket.IO server to the response object
    res.socket.server.io = io;
  }

  // End the response
  res.end();
};

export default ioHandler;
