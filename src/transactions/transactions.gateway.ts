import { WebSocketGateway, WebSocketServer, SubscribeMessage, MessageBody, ConnectedSocket, OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { TransactionsService } from './transactions.service';

@WebSocketGateway()
export class TransactionsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private users = new Map<string, Socket[]>();

  constructor(private readonly transactionsService: TransactionsService) {}

  handleConnection(client: Socket) {
    const userId = client.handshake.query.userId as string;
    
    if (!this.users.has(userId)) {
      this.users.set(userId, []);
    }

    const userConnections = this.users.get(userId);
    if (userConnections.length >= 3) {
      client.disconnect(true);
    } else {
      userConnections.push(client);
    }
  }

  handleDisconnect(client: Socket) {
    const userId = client.handshake.query.userId as string;
    const userConnections = this.users.get(userId);
    if (userConnections) {
      this.users.set(userId, userConnections.filter(conn => conn.id !== client.id));
    }
  }

  @SubscribeMessage('agregar-transaccion')
  async handleAddTransaction(@MessageBody() createTransactionDto: CreateTransactionDto) {
    const transaction = await this.transactionsService.create(createTransactionDto);
    this.server.emit('transaccion-agregada', transaction);
  }

  @SubscribeMessage('consultar-activos')
  async handleGetActiveTransactions(@ConnectedSocket() client: Socket) {
    const activeTransactions = await this.transactionsService.findActive();
    client.emit('activos-consultados', activeTransactions);
  }
}
