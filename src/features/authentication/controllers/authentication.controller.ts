import {Controller, Post, Body, Req, UseGuards} from '@nestjs/common';
import {ApiTags, ApiBearerAuth} from '@nestjs/swagger';
import {AuthGuard} from '@nestjs/passport';


import {AuthService} from "@/features/authentication/services/authentication.service";
import {Public} from "@/core/decorators/public.decorator";
import {RegisterDto} from "@/features/authentication/dtos/register.dto";
import {LoginDto} from "@/features/authentication/dtos/login.dto";
import {VerifyOtpDto} from "@/features/authentication/dtos/verify-otp.dto";
import {ResetPasswordDto} from "@/features/authentication/dtos/reset-password.dto";

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {
    }

    @Public()
    @Post('register')
    register(@Body() dto: RegisterDto) {
        return this.authService.register(dto);
    }

    @Public()
    @Post('login')
    login(@Body() dto: LoginDto) {
        return this.authService.login(dto);
    }

    @Public()
    @Post('verify-otp')
    verifyOtp(@Body() dto: VerifyOtpDto) {
        return this.authService.verifyOtp(dto);
    }

    @Public()
    @Post('forgot-password')
    forgotPassword(@Body('login') login: string) {
        return this.authService.sendForgotOtp(login);
    }

    @Public()
    @Post('reset-password')
    resetPassword(@Body() dto: ResetPasswordDto) {
        return this.authService.resetPassword(dto);
    }

    @Post('refresh')
    @UseGuards(AuthGuard('jwt'))
    @ApiBearerAuth('JWT')
    refresh(@Req() req: any, @Body('refreshToken') refreshToken: string) {
        return this.authService.refreshToken(req.user.id, refreshToken);
    }

    @Post('logout')
    @UseGuards(AuthGuard('jwt'))
    @ApiBearerAuth('JWT')
    logout(@Req() req: any) {
        return this.authService.logout(req.user.id);
    }
}
