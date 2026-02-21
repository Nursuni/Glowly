import { Logger } from '@nestjs/common';
import {
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
} from '@nestjs/websockets';

@WebSocketGateway({ transport: ['websocket'], secure: false })
export class SocketGateway implements OnGatewayInit {
  private logger: Logger = new Logger('SocketEventsGateway');
  private summaryClient: number = 0;
  public afterInit(server: any) {
    this.logger.log(
      `WebSocker Server initialized total: ${this.summaryClient}`,
    );
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
  handleMessage(client: any, payload: any): string {
    return 'Hello world!';
  }
}
