import {Controller, Get, Post, Put, Delete, Body, Param, ParseIntPipe, Req} from '@nestjs/common';
import {ApiTags, ApiBearerAuth, ApiOperation} from '@nestjs/swagger';
import {CourseLessonsService} from './course-lessons.service';
import {Public} from "@/core/decorators/public.decorator";

@ApiTags('Course Lessons')
@Controller()
export class CourseLessonsController {
    constructor(private svc: CourseLessonsService) {
    }

    @Public()
    @Get('courses/:courseId/sections/:sectionId/lessons')
    findBySection(@Param('sectionId', ParseIntPipe) sectionId: number) {
        return this.svc.findBySection(sectionId);
    }

    @Post('lessons')
    @ApiBearerAuth('JWT')
    create(@Body() dto: any) {
        return this.svc.create(dto);
    }

    @Put('lessons/:id')
    @ApiBearerAuth('JWT')
    update(@Param('id', ParseIntPipe) id: number, @Body() dto: any) {
        return this.svc.update(id, dto);
    }

    @Delete('lessons/:id')
    @ApiBearerAuth('JWT')
    remove(@Param('id', ParseIntPipe) id: number) {
        return this.svc.remove(id);
    }

    @Put('lessons/:id/progress')
    @ApiBearerAuth('JWT')
    updateProgress(
        @Param('id', ParseIntPipe) id: number,
        @Req() req: any,
        @Body('stoppedAt') stoppedAt: number,
        @Body('isCompleted') isCompleted: boolean,
    ) {
        return this.svc.updateProgress(id, req.user.id, stoppedAt, isCompleted);
    }

    @Get('courses/:courseId/progress')
    @ApiBearerAuth('JWT')
    getCourseProgress(@Param('courseId', ParseIntPipe) courseId: number, @Req() req: any) {
        return this.svc.getCourseProgress(courseId, req.user.id);
    }
}
