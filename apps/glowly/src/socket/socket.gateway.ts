import { Logger } from '@nestjs/common';
import {
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, WebSocket } from 'ws';

@WebSocketGateway({ transport: ['websocket'], secure: false })
export class SocketGateway implements OnGatewayInit {
  private logger: Logger = new Logger('SocketEventsGateway');
  private summaryClient: number = 0;

  @WebSocketServer()
  server: Server;

  public afterInit(server: any) {
    this.logger.log(`WebSocket Server initialized`);
  }

  handleConnection(client: WebSocket, ...args: any[]) {
    this.summaryClient++;
    this.logger.log(`===Client connected total: ${this.summaryClient}`);
  }

  handleDisconnect(client: WebSocket) {
    this.summaryClient--;
    this.logger.log(`===Client disconnected total: ${this.summaryClient}`);
  }

  @SubscribeMessage('message')
  handleMessage(client: any, payload: any): void {
    const { text, memberData } = payload;
    this.server.clients.forEach((c: any) => {
      if (c.readyState === WebSocket.OPEN) {
        c.send(
          JSON.stringify({
            event: 'message',
            text: text,
            memberData: memberData ?? null,
          }),
        );
      }
    });
  }
}
