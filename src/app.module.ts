import { Module } from '@nestjs/common';

import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

import { CategoriasModule } from './categorias/categorias.module';
import { JogadoresModule } from './jogadores/jogadores.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot(process.env.DATABASE_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }),
    CategoriasModule,
    JogadoresModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
