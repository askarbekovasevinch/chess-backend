import {Controller, Get, Post, Put, Body, Param, Query, ParseIntPipe, Req} from '@nestjs/common';
import {ApiTags, ApiBearerAuth, ApiQuery} from '@nestjs/swagger';
import {MatchesService} from './matches.service';
import {CreateMatchDto, FinishMatchDto} from './dto/match.dto';
import {Public} from "@/core/decorators/public.decorator";

@ApiTags('Matches')
@Controller('matches')
export class MatchesController {
    constructor(private svc: MatchesService) {
    }

    @Public()
    @Get()
    @ApiQuery({name: 'page', required: false})
    @ApiQuery({name: 'limit', required: false})
    @ApiQuery({
        name: 'type',
        required: false
    })
    findAll(@Query('page') page = 1, @Query('limit') limit = 20, @Query('type') type?: string) {
        return this.svc.findAll(+page, +limit, type);
    }

    @Public()
    @Get(':id')
    findOne(@Param('id', ParseIntPipe) id: number) {
        return this.svc.findOne(id);
    }

    @Get('user/me')
    @ApiBearerAuth('JWT')
    myMatches(@Req() req: any, @Query('page') page = 1) {
        return this.svc.findByUser(req.user.id, +page);
    }

    @Post()
    @ApiBearerAuth('JWT')
    create(@Req() req: any, @Body() dto: CreateMatchDto) {
        return this.svc.create(req.user, dto);
    }

    @Put(':id/finish')
    @ApiBearerAuth('JWT')

    finish(@Param('id', ParseIntPipe) id: number, @Req() req: any, @Body() dto: FinishMatchDto) {
        return this.svc.finish(id, req.user, dto);
    }
}
