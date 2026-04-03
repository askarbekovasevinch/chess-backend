import { Controller, Body, Param, Query, ParseIntPipe, Req } from '@nestjs/common';
import { ApiTags,  ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { ReportsService } from './reports.service';
import { CreateReportDto } from './dto/report.dto';

@ApiTags('Reports')
@ApiBearerAuth('JWT')
@Controller('reports')
export class ReportsController {
  constructor(private svc: ReportsService) {}

  @ApiQuery({ name: 'page', required: false }) @ApiQuery({ name: 'onlyPending', required: false })
  findAll(@Query('page') page = 1, @Query('onlyPending') onlyPending = false) {
    return this.svc.findAll(+page, 20, Boolean(onlyPending));
  }

  findOne(@Param('id', ParseIntPipe) id: number) { return this.svc.findOne(id); }


  create(@Req() req: any, @Body() dto: CreateReportDto) { return this.svc.create(req.user.id, dto); }


  markReviewed(@Param('id', ParseIntPipe) id: number) { return this.svc.markReviewed(id); }
}
