
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TransactionsGateway } from './transactions.gateway';
import { TransactionsService } from './transactions.service';
import { Transaction } from './entities/transaction.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Transaction])],
  providers: [TransactionsGateway, TransactionsService],
})
export class TransactionsModule {}
