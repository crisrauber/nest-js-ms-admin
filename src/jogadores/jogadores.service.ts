import { Injectable, Logger } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Jogador } from './interfaces/jogador.interface';

@Injectable()
export class JogadoresService {
  constructor(
    @InjectModel('Jogador') private readonly jogadorModel: Model<Jogador>,
  ) {}
  private readonly logger = new Logger(JogadoresService.name);

  async criarJogador(criarJogadorDto: Jogador): Promise<Jogador> {
    try {
      return await this.jogadorModel.create(criarJogadorDto);
    } catch (error) {
      this.logger.error(`error : ${JSON.stringify(error.message)}`);
      throw new RpcException(error.message);
    }
  }

  async atualizarJogador(_id: string, criarJogadorDto: Jogador): Promise<void> {
    try {
      await this.jogadorModel.updateOne({ _id }, criarJogadorDto);
    } catch (error) {
      this.logger.error(`error : ${JSON.stringify(error.message)}`);
      throw new RpcException(error.message);
    }
  }

  async consultarTodosJogadores(): Promise<Jogador[]> {
    return await this.jogadorModel.find();
  }

  async consultarJogadoresPeloId(id: string): Promise<Jogador> {
    try {
      const jogadorEncontrado = await this.jogadorModel.findById(id);
      return jogadorEncontrado;
    } catch (error) {
      this.logger.error(`error : ${JSON.stringify(error.message)}`);
      throw new RpcException(error.message);
    }
  }

  async deletarJogador(id: string): Promise<void> {
    try {
      await this.jogadorModel.deleteOne({ _id: id });
    } catch (error) {
      this.logger.error(`error : ${JSON.stringify(error.message)}`);
      throw new RpcException(error.message);
    }
  }
}
