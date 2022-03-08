import { Controller, Get, Logger } from '@nestjs/common';
import {
  Ctx,
  EventPattern,
  MessagePattern,
  Payload,
  RmqContext,
} from '@nestjs/microservices';
import { JogadoresService } from './jogadores.service';
import { Jogador } from './interfaces/jogador.interface';

const ackErrors: string[] = ['E11000'];

@Controller('jogadores')
export class JogadoresController {
  constructor(private readonly jogadoresService: JogadoresService) {}

  logger = new Logger(JogadoresController.name);

  @EventPattern('criar-jogador')
  async criarJogador(@Payload() jogador: Jogador, @Ctx() context: RmqContext) {
    const channel = context.getChannelRef();
    const originalMsg = context.getMessage();

    this.logger.log(`categoria: ${JSON.stringify(jogador)}`);

    try {
      await this.jogadoresService.criarJogador(jogador);

      await channel.ack(originalMsg);
    } catch (error) {
      this.logger.log(error.message);

      const filterAckError = ackErrors.filter(async (ackError) =>
        error.message.includes(ackError),
      );

      if (filterAckError) {
        await channel.ack(originalMsg);
      }
    }
  }

  @EventPattern('atualizar-jogador')
  async atualizarJogador(@Payload() data: any, @Ctx() context: RmqContext) {
    const channel = context.getChannelRef();
    const originalMsg = context.getMessage();

    this.logger.log(`data: ${JSON.stringify(data)}`);
    this.logger.log(`id: ${JSON.stringify(data.id)}`);
    this.logger.log(`data: ${JSON.stringify(data.jogador)}`);

    try {
      await this.jogadoresService.atualizarJogador(data.id, data.jogador);

      await channel.ack(originalMsg);
    } catch (error) {
      this.logger.log(error.message);

      const filterAckError = ackErrors.filter(async (ackError) =>
        error.message.includes(ackError),
      );

      if (filterAckError) {
        await channel.ack(originalMsg);
      }
    }
  }

  @MessagePattern('consultar-jogadores')
  async consultarJogadors(@Payload() _id: string, @Ctx() context: RmqContext) {
    const channel = context.getChannelRef();
    const originalMsg = context.getMessage();

    try {
      if (_id) {
        return await this.jogadoresService.consultarJogadoresPeloId(_id);
      } else {
        return await this.jogadoresService.consultarTodosJogadores();
      }
    } finally {
      await channel.ack(originalMsg);
    }
  }

  @EventPattern('deletar-jogador')
  async atualizarDeletar(@Payload() _id: string, @Ctx() context: RmqContext) {
    const channel = context.getChannelRef();
    const originalMsg = context.getMessage();

    try {
      await this.jogadoresService.deletarJogador(_id);

      await channel.ack(originalMsg);
    } catch (error) {
      this.logger.log(error.message);

      const filterAckError = ackErrors.filter(async (ackError) =>
        error.message.includes(ackError),
      );

      if (filterAckError) {
        await channel.ack(originalMsg);
      }
    }
  }
}
