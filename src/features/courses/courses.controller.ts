import {Controller, Get, Post, Put, Delete, Body, Param, Query, ParseIntPipe, Req} from '@nestjs/common';
import {ApiTags, ApiBearerAuth} from '@nestjs/swagger';
import {CoursesService} from './courses.service';
import {CreateCourseDto, UpdateCourseDto, CourseQueryDto} from './dto/course.dto';
import {Public} from "@/core/decorators/public.decorator";

@ApiTags('Courses')
@Controller('courses')
export class CoursesController {
    constructor(private svc: CoursesService) {
    }

    @Public()
    @Get()
    findAll(@Query() query: CourseQueryDto) {
        return this.svc.findAll(query);
    }

    @Public()
    @Get(':id')
    findOne(@Param('id', ParseIntPipe) id: number) {
        return this.svc.findOne(id);
    }

    @Post()
    @ApiBearerAuth('JWT')
    create(@Body() dto: CreateCourseDto) {
        return this.svc.create(dto);
    }

    @Put(':id')
    @ApiBearerAuth('JWT')

    update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateCourseDto) {
        return this.svc.update(id, dto);
    }

    @Delete(':id')
    @ApiBearerAuth('JWT')

    remove(@Param('id', ParseIntPipe) id: number) {
        return this.svc.remove(id);
    }

    // Purchase
    @Post(':id/purchase')
    @ApiBearerAuth('JWT')
    purchase(@Param('id', ParseIntPipe) id: number, @Req() req: any) {
        return this.svc.purchase(id, req.user);
    }

    @Get('me/purchases')
    @ApiBearerAuth('JWT')
    myPurchases(@Req() req: any) {
        return this.svc.getMyPurchases(req.user.id);
    }

    // Like
    @Post(':id/like')
    @ApiBearerAuth('JWT')
    toggleLike(@Param('id', ParseIntPipe) id: number, @Req() req: any) {
        return this.svc.toggleLike(id, req.user.id);
    }

    // Reviews
    @Public() @Get(':id/reviews')
    getReviews(@Param('id', ParseIntPipe) id: number) {
        return this.svc.getReviews(id);
    }

    @Post(':id/reviews') @ApiBearerAuth('JWT')
    addReview(
        @Param('id', ParseIntPipe) id: number,
        @Req() req: any,
        @Body('rating') rating: number,
        @Body('comment') comment?: string,
    ) {
        return this.svc.addReview(id, req.user.id, rating, comment);
    }

    @Delete(':id/reviews')
    @ApiBearerAuth('JWT')
    deleteReview(@Param('id', ParseIntPipe) id: number, @Req() req: any) {
        return this.svc.deleteReview(id, req.user.id);
    }
}
