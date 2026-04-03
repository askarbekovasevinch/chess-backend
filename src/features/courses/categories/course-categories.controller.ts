import {Controller, Get, Post, Put, Delete, Body, Param, ParseIntPipe} from '@nestjs/common';
import {ApiTags, ApiBearerAuth} from '@nestjs/swagger';
import {CourseCategoriesService} from './course-categories.service';
import {Public} from "@/core/decorators/public.decorator";

@ApiTags('Course Categories')
@Controller('course-categories')
export class CourseCategoriesController {
    constructor(private svc: CourseCategoriesService) {
    }

    @Public()
    @Get() findAll() {
        return this.svc.findAll();
    }

    @Public()
    @Get(':id') findOne(@Param('id', ParseIntPipe) id: number) {
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
