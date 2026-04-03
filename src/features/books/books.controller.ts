import {Controller, Get, Post, Put, Delete, Body, Param, Query, ParseIntPipe, Req} from '@nestjs/common';
import {ApiTags, ApiBearerAuth} from '@nestjs/swagger';
import {BooksService} from './books.service';
import {CreateBookDto, UpdateBookDto, BookQueryDto} from './dto/book.dto';
import {Public} from "@/core/decorators/public.decorator";

@ApiTags('Books')
@Controller('books')
export class BooksController {
    constructor(private svc: BooksService) {
    }

    @Public()
    @Get()
    findAll(@Query() query: BookQueryDto) {
        return this.svc.findAll(query);
    }

    @Public()
    @Get(':id')
    findOne(@Param('id', ParseIntPipe) id: number) {
        return this.svc.findOne(id);
    }

    @Post()
    @ApiBearerAuth('JWT')
    create(@Body() dto: CreateBookDto) {
        return this.svc.create(dto);
    }

    @Put(':id')
    @ApiBearerAuth('JWT')
    update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateBookDto) {
        return this.svc.update(id, dto);
    }

    @Delete(':id')
    @ApiBearerAuth('JWT')
    remove(@Param('id', ParseIntPipe) id: number) {
        return this.svc.remove(id);
    }

    @Post(':id/purchase')
    @ApiBearerAuth('JWT')
    purchase(@Param('id', ParseIntPipe) id: number, @Req() req: any) {
        return this.svc.purchase(id, req.user.id);
    }

    @Get('me/purchases')
    @ApiBearerAuth('JWT')
    myPurchases(@Req() req: any) {
        return this.svc.getMyPurchases(req.user.id);
    }

    @Post(':id/like')
    @ApiBearerAuth('JWT')
    toggleLike(@Param('id', ParseIntPipe) id: number, @Req() req: any) {
        return this.svc.toggleLike(id, req.user.id);
    }

    @Public()
    @Get(':id/reviews')
    getReviews(@Param('id', ParseIntPipe) id: number) {
        return this.svc.getReviews(id);
    }

    @Post(':id/reviews')
    @ApiBearerAuth('JWT')
    addReview(
        @Param('id', ParseIntPipe) id: number, @Req() req: any,
        @Body('rating') rating: number, @Body('comment') comment?: string,
    ) {
        return this.svc.addReview(id, req.user.id, rating, comment);
    }

    @Delete(':id/reviews')
    @ApiBearerAuth('JWT')
    deleteReview(@Param('id', ParseIntPipe) id: number, @Req() req: any) {
        return this.svc.deleteReview(id, req.user.id);
    }
}
