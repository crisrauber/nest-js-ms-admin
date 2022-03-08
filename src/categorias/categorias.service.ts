import { Injectable, Logger } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Categoria } from './interfaces/categoria.interface';

@Injectable()
export class CategoriasService {
  constructor(
    @InjectModel('Categoria') private readonly categoriaModel: Model<Categoria>,
  ) {}

  private readonly logger = new Logger(CategoriasService.name);

  async criarCategoria(criarCategoriaDto: Categoria): Promise<Categoria> {
    try {
      return await this.categoriaModel.create(criarCategoriaDto);
    } catch (error) {
      this.logger.error(`error : ${JSON.stringify(error.message)}`);
      throw new RpcException(error.message);
    }
  }

  async consultarCategorias(): Promise<Categoria[]> {
    return await this.categoriaModel.find().populate('jogadores');
  }

  async consultarCategoriaPeloId(id: string): Promise<Categoria> {
    const categoria = await this.categoriaModel.findById(id);

    if (!categoria) {
      throw new RpcException('categoria não encontrada');
    }
    return categoria;
  }

  async atualizarCategoria(
    id: string,
    atualizarCategoria: Categoria,
  ): Promise<void> {
    await this.categoriaModel.updateOne({ _id: id }, atualizarCategoria);
  }
}
