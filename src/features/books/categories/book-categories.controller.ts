import {Controller, Get, Post, Put, Delete, Body, Param, ParseIntPipe} from '@nestjs/common';
import {ApiTags, ApiBearerAuth} from '@nestjs/swagger';
import {BookCategoriesService} from './book-categories.service';
import {Public} from "@/core/decorators/public.decorator";

@ApiTags('Book Categories')
@Controller('book-categories')
export class BookCategoriesController {
    constructor(private svc: BookCategoriesService) {
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

    @Post()
    @ApiBearerAuth('JWT') create(@Body('title') title: string) {
        return this.svc.create(title);
    }

    @Put(':id')
    @ApiBearerAuth('JWT') update(@Param('id', ParseIntPipe) id: number, @Body('title') title: string) {
        return this.svc.update(id, title);
    }

    @Delete(':id')
    @ApiBearerAuth('JWT') remove(@Param('id', ParseIntPipe) id: number) {
        return this.svc.remove(id);
    }
}
