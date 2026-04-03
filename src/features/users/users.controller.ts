import { Controller, Get, Put, Delete, Body, Param, ParseIntPipe, Query, Req } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { UpdateUserDto, UpdateUserRoleDto } from './dto/user.dto';

@ApiTags('Users')
@ApiBearerAuth('JWT')
@Controller('users')
export class UsersController {
  constructor(private svc: UsersService) {}

  @Get('me')
  getMe(@Req() req: any) { return this.svc.getMe(req.user.id); }

  @Get()
  @ApiQuery({ name: 'page', required: false }) @ApiQuery({ name: 'limit', required: false })
  findAll(@Query('page') page = 1, @Query('limit') limit = 20) {
    return this.svc.findAll(+page, +limit);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) { return this.svc.findOne(id); }

  @Put('me')
  updateMe(@Req() req: any, @Body() dto: UpdateUserDto) { return this.svc.update(req.user.id, req.user, dto); }

  @Put(':id/role')
  updateRole(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateUserRoleDto) { return this.svc.updateRole(id, dto); }

  @Delete(':id')
  deactivate(@Param('id', ParseIntPipe) id: number) { return this.svc.deactivate(id); }
}
