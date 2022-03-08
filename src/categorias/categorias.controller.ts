import { Controller, Get, Logger } from '@nestjs/common';
import {
  Ctx,
  EventPattern,
  MessagePattern,
  Payload,
  RmqContext,
} from '@nestjs/microservices';
import { CategoriasService } from './categorias.service';
import { Categoria } from './interfaces/categoria.interface';

const ackErrors: string[] = ['E11000'];

@Controller('categorias')
export class CategoriasController {
  constructor(private readonly categoriasService: CategoriasService) {}

  logger = new Logger(CategoriasController.name);

  @EventPattern('criar-categoria')
  async criarCategoria(
    @Payload() categoria: Categoria,
    @Ctx() context: RmqContext,
  ) {
    const channel = context.getChannelRef();
    const originalMsg = context.getMessage();

    this.logger.log(`categoria: ${JSON.stringify(categoria)}`);

    try {
      await this.categoriasService.criarCategoria(categoria);

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

  @EventPattern('atualizar-categoria')
  async atualizarCategoria(@Payload() data: any, @Ctx() context: RmqContext) {
    const channel = context.getChannelRef();
    const originalMsg = context.getMessage();

    console.log('chamou o servico');

    this.logger.log(`data: ${JSON.stringify(data)}`);

    try {
      await this.categoriasService.atualizarCategoria(data.id, data.categoria);

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

  @MessagePattern('consultar-categorias')
  async consultarCategorias(
    @Payload() _id: string,
    @Ctx() context: RmqContext,
  ) {
    const channel = context.getChannelRef();
    const originalMsg = context.getMessage();

    try {
      if (_id) {
        return await this.categoriasService.consultarCategoriaPeloId(_id);
      } else {
        return await this.categoriasService.consultarCategorias();
      }
    } finally {
      await channel.ack(originalMsg);
    }
  }
}
