import { Controller, Logger } from '@nestjs/common';
import { Ctx, EventPattern, Payload, RmqContext } from '@nestjs/microservices';
import { Partida } from './interfaces/partidas.interface';
import { PartidasService } from './partidas.service';

@Controller('partidas')
export class PartidasController {

    private logger = new Logger(PartidasController.name);
    ackErrors = ['E11000'];

    constructor(
        private readonly _partidasService: PartidasService
    ){}

    @EventPattern('criar-partida')
    async criarPartida(
        @Payload() partida: Partida,
        @Ctx() context: RmqContext
    ) {
        const channel = context.getChannelRef();
        const message = context.getMessage();

        try {
            await this._partidasService.criarPartida(partida)
            await channel.ack(message);
        } catch (error) {
            this.logger.error(error.message);
            this.validateErrorMessageToClearQueue(error, channel, message);
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
