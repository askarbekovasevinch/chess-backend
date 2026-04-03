import {Controller, Get, Post} from "@nestjs/common";
import {ApiTags} from "@nestjs/swagger";


@ApiTags('Temp')
@Controller('temp')

export class TempController {
    @Post()
    async create() {
        return {message: 'Hello World'};
    }

    @Get()
    async getAll() {
        return [{massage: 'Hello'}, {message: 'World'}];
    }
}