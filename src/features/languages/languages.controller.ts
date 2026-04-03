import {Controller, Get, Post, Put, Delete, Body, Param, ParseIntPipe, UseGuards} from '@nestjs/common';
import {ApiTags, ApiBearerAuth} from '@nestjs/swagger';
import {AuthGuard} from '@nestjs/passport';
import {LanguagesService} from './languages.service';
import {CreateLanguageDto, UpdateLanguageDto} from './dto/language.dto';
import {Public} from "@/core/decorators/public.decorator";

@ApiTags('Languages')
@Controller('languages')
export class LanguagesController {
    constructor(private svc: LanguagesService) {
    }

    @Public()
    @Get()
    findAll() {
        return this.svc.findAll();
    }

    @Public()
    @Get(':id')
    findOne(@Param('id', ParseIntPipe) id: number) {
        return this.svc.findOne(id);
    }

    @UseGuards(AuthGuard('jwt'))
    @ApiBearerAuth('JWT')
    @Post()
    create(@Body() dto: CreateLanguageDto) {
        return this.svc.create(dto);
    }

    @UseGuards(AuthGuard('jwt'))
    @ApiBearerAuth('JWT') @Put(':id')
    update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateLanguageDto) {
        return this.svc.update(id, dto);
    }

    @UseGuards(AuthGuard('jwt'))
    @ApiBearerAuth('JWT')
    @Delete(':id')
    remove(@Param('id', ParseIntPipe) id: number) {
        return this.svc.remove(id);
    }
}
