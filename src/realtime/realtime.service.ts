import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';

@WebSocketGateway({ namespace: '/data' })
export class MyWebSocketGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() server: Server;

  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);

    client.emit('initialData', { message: 'Hello from the server!' });

    const interval = setInterval(() => {
      client.emit('dataUpdate', { timestamp: new Date() });
    }, 30000);

    client.on('disconnect', () => {
      console.log(`Client disconnected: ${client.id}`);
      clearInterval(interval);
    });
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
  }
}
