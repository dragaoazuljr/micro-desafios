import { Controller, Logger } from '@nestjs/common';
import { Ctx, EventPattern, MessagePattern, Payload, RmqContext } from '@nestjs/microservices';
import { DesafiosService } from './desafios.service';
import { Desafio } from './interfaces/desafio.interface';

@Controller('desafios')
export class DesafiosController {

    private logger = new Logger(DesafiosController.name);
    ackErrors = ['E11000'];
    
    constructor(
        private readonly _desafiosSerivce: DesafiosService
    ){}

    @EventPattern('criar-desafio')
    async criarDesafio(
        @Payload() desafio: Desafio,
        @Ctx() context: RmqContext
    ){
        let channel = context.getChannelRef();
        let message = context.getMessage();

        try{
            await this._desafiosSerivce.criarDesafio(desafio);
            await channel.ack(message);
        } catch(error) {
            this.logger.error(`error: ${error.mesage}`);
            this.validateErrorMessageToClearQueue(error, channel, message);
        }
    }

    @MessagePattern('consultar-desafios-jogador')
    async consultarDesafioPorJogador(
        @Payload() _id:  any,
        @Ctx() context: RmqContext
    ) {
        const channel = context.getChannelRef();
        const message = context.getMessage();

        try{
            return this._desafiosSerivce.consultarDesafiosPorJogador(_id);
        } finally {
            channel.ack(message);
        }
    }

    @MessagePattern('consultar-desafios')
    async consultarDesafio(
        @Payload() _id: string,
        @Ctx() context: RmqContext
    ) {
        const channel = context.getChannelRef();
        const message = context.getMessage();

        try {
            return await this._desafiosSerivce.consultarDesafios(_id)
        } finally {
            channel.ack(message)
        }
    }

    @EventPattern('atualizar-desafio')
    async atualizarDesafio(
        @Payload() data: any,
        @Ctx() context: RmqContext
    ){
        const channel = context.getChannelRef();
        const message = context.getMessage()
        try{
            await this._desafiosSerivce.atualizarDesafio(data._id, data.desafio)
            await channel.ack(message);
        } catch(error) {
            this.logger.error(`error: ${error.message}`);
            this.validateErrorMessageToClearQueue(error, channel, message);
        }
    }

    @EventPattern('apagar-desafio')
    async apagarDesafio(
        @Payload() _id: string,
        @Ctx() context: RmqContext
    ){
        const channel = context.getChannelRef();
        const message = context.getMessage();

        try{
            await this._desafiosSerivce.apagarDesafios(_id);
            await channel.ack(message);
        } catch(error) {
            this.logger.error(`error: ${error.message}`);
        }
    }

    @EventPattern('atribuir-desafio-partida')
    async atualizarDesafioPartida(
        @Payload() data: any,
        @Ctx() context: RmqContext
    ){
        const channel = context.getChannelRef();
        const message = context.getMessage();

        try{
            await this._desafiosSerivce.atualizarDesafioPartida(data._id, data.desafio)
            await channel.ack(message);
        } catch (error){
            this.logger.error(`error: ${error.message}`);
            this.validateErrorMessageToClearQueue(error, channel, message);
        }
    }

    @MessagePattern('consultar-desafios-realizados')
    async consultarDesafiosRealizados (
        @Payload() data: any,
        @Ctx() context: RmqContext
    ) {
        const channel = context.getChannelRef();
        const message = context.getMessage();

        try {
            const {idCategoria, dataRef} = data;

            if(dataRef){
                return await this._desafiosSerivce.consultarDesafiosRealizadosPelaData(idCategoria, dataRef);
            } else {
                return await this._desafiosSerivce.consultarDesafiosRealizados(idCategoria);
            }
        } finally {
            channel.ack(message)
        }
    }

    validateErrorMessageToClearQueue(error: any, channel, message) {
        this.ackErrors.map(async err => {
            if(error.message.includes(err)){
                await channel.ack(message);
            }
        })
    }
}
