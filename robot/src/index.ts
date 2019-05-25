import { IncomingMessage, ServerResponse } from "http";

export default (_req: IncomingMessage, res: ServerResponse) => {
  res.end('Hello world');
}