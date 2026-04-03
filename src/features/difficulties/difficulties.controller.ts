import {Controller, Get, Post, Put, Delete, Body, Param, ParseIntPipe, UseGuards} from '@nestjs/common';
import {ApiTags, ApiBearerAuth} from '@nestjs/swagger';
import {AuthGuard} from '@nestjs/passport';
import {DifficultiesService} from './difficulties.service';
import {CreateDifficultyDto, UpdateDifficultyDto} from './dto/difficulty.dto';
import {Public} from "@/core/decorators/public.decorator";

@ApiTags('Difficulties')
@Controller('difficulties')
export class DifficultiesController {
    constructor(private svc: DifficultiesService) {
    }

    @Public()
    @Get()
    findAll() {
        return this.svc.findAll();
    }

    @Public() @Get(':id')
    findOne(@Param('id', ParseIntPipe) id: number) {
        return this.svc.findOne(id);
    }

    @UseGuards(AuthGuard('jwt'))
    @ApiBearerAuth('JWT') @Post() create(@Body() dto: CreateDifficultyDto) {
        return this.svc.create(dto);
    }

    @UseGuards(AuthGuard('jwt'))
    @ApiBearerAuth('JWT') @Put(':id') update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateDifficultyDto) {
        return this.svc.update(id, dto);
    }

    @UseGuards(AuthGuard('jwt'))
    @ApiBearerAuth('JWT') @Delete(':id') remove(@Param('id', ParseIntPipe) id: number) {
        return this.svc.remove(id);
    }
}
