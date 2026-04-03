import {Controller, Get, Post, Put, Delete, Body, Param, ParseIntPipe} from '@nestjs/common';
import {ApiTags, ApiBearerAuth} from '@nestjs/swagger';
import {CourseSectionsService} from './course-sections.service';
import {Public} from "@/core/decorators/public.decorator";

@ApiTags('Course Sections')
@Controller('courses/:courseId/sections')
export class CourseSectionsController {
    constructor(private svc: CourseSectionsService) {
    }

    @Public()
    @Get() findAll(@Param('courseId', ParseIntPipe) courseId: number) {
        return this.svc.findByCourse(courseId);
    }

    @Post()
    @ApiBearerAuth('JWT') create(@Param('courseId', ParseIntPipe) courseId: number, @Body() body: any) {
        return this.svc.create(courseId, body);
    }

    @Put(':id')
    @ApiBearerAuth('JWT') update(@Param('id', ParseIntPipe) id: number, @Body() body: any) {
        return this.svc.update(id, body);
    }

    @Delete(':id')
    @ApiBearerAuth('JWT') remove(@Param('id', ParseIntPipe) id: number) {
        return this.svc.remove(id);
    }
}
