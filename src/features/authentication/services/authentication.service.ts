import {
    Injectable,
    UnauthorizedException,
    BadRequestException,
    ConflictException,
    NotFoundException,
} from '@nestjs/common';
import {JwtService} from '@nestjs/jwt';
import {InjectRepository} from '@nestjs/typeorm';
import {Repository} from 'typeorm';
import {ConfigService} from '@nestjs/config';
import * as bcrypt from 'bcryptjs';
import {User} from "@/features/users/user.entity";
import {OtpCode} from "@/features/otp/otp.entity";
import {LoginType, OtpType} from "@/core/enums";
import {RegisterDto} from "@/features/authentication/dtos/register.dto";
import {LoginDto} from "@/features/authentication/dtos/login.dto";
import {VerifyOtpDto} from "@/features/authentication/dtos/verify-otp.dto";
import {ResetPasswordDto} from "@/features/authentication/dtos/reset-password.dto";

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(User) private userRepo: Repository<User>,
        @InjectRepository(OtpCode) private otpRepo: Repository<OtpCode>,
        private jwtService: JwtService,
        private configService: ConfigService,
    ) {
    }

    async register(dto: RegisterDto) {
        const existing = await this.userRepo.findOne({where: {login: dto.login}});
        if (existing) throw new ConflictException('Bu login allaqachon band');

        if (dto.loginType === LoginType.EMAIL && !dto.password) {
            throw new BadRequestException('Email orqali ro\'yxatda parol kerak');
        }

        const hashedPassword = dto.password ? await bcrypt.hash(dto.password, 10) : null;
        const user = this.userRepo.create({
            ...dto,
            password: hashedPassword,
            birthDate: dto.birthDate ? new Date(dto.birthDate) : null,
        });
        await this.userRepo.save(user);

        await this.sendOtp(user, OtpType.REGISTER);
        return {message: 'OTP kod yuborildi. Hisobingizni tasdiqlang.'};
    }

    async login(dto: LoginDto) {
        const user = await this.userRepo.findOne({where: {login: dto.login}});
        if (!user) throw new NotFoundException('Foydalanuvchi topilmadi');

        if (dto.loginType === LoginType.EMAIL) {
            if (!dto.password) throw new BadRequestException('Parol kiritilmadi');
            const valid = await bcrypt.compare(dto.password, user.password);
            if (!valid) throw new UnauthorizedException('Parol noto\'g\'ri');
            if (!user.isVerified) throw new UnauthorizedException('Hisobingiz tasdiqlanmagan');
            return this.generateTokens(user);
        }

        // Phone OTP login
        await this.sendOtp(user, OtpType.REGISTER);
        return {message: 'OTP kod yuborildi'};
    }

    async verifyOtp(dto: VerifyOtpDto) {
        const user = await this.userRepo.findOne({where: {login: dto.login}});
        if (!user) throw new NotFoundException('Foydalanuvchi topilmadi');

        const otp = await this.otpRepo.findOne({
            where: {userId: user.id, code: dto.code, type: dto.type, isUsed: false},
            order: {createdAt: 'DESC'},
        });

        if (!otp) throw new BadRequestException('OTP kod noto\'g\'ri');
        if (new Date() > otp.expiredAt) throw new BadRequestException('OTP kod muddati o\'tgan');

        await this.otpRepo.update(otp.id, {isUsed: true});

        if (dto.type === OtpType.REGISTER) {
            await this.userRepo.update(user.id, {isVerified: true, isActive: true});
        }

        return this.generateTokens(user);
    }

    async resetPassword(dto: ResetPasswordDto) {
        const user = await this.userRepo.findOne({where: {login: dto.login}});
        if (!user) throw new NotFoundException('Foydalanuvchi topilmadi');

        const otp = await this.otpRepo.findOne({
            where: {userId: user.id, code: dto.otp, type: OtpType.PASSWORD_RESET, isUsed: false},
            order: {createdAt: 'DESC'},
        });
        if (!otp || new Date() > otp.expiredAt) throw new BadRequestException('OTP noto\'g\'ri yoki muddati o\'tgan');

        const hashedPassword = await bcrypt.hash(dto.newPassword, 10);
        await this.userRepo.update(user.id, {password: hashedPassword});
        await this.otpRepo.update(otp.id, {isUsed: true});

        return {message: 'Parol muvaffaqiyatli yangilandi'};
    }

    async sendForgotOtp(login: string) {
        const user = await this.userRepo.findOne({where: {login}});
        if (!user) throw new NotFoundException('Foydalanuvchi topilmadi');
        await this.sendOtp(user, OtpType.PASSWORD_RESET);
        return {message: 'OTP kod yuborildi'};
    }

    async refreshToken(userId: number, refreshToken: string) {
        const user = await this.userRepo.findOne({where: {id: userId}});
        if (!user?.refreshToken) throw new UnauthorizedException();
        const valid = await bcrypt.compare(refreshToken, user.refreshToken);
        if (!valid) throw new UnauthorizedException('Refresh token yaroqsiz');
        return this.generateTokens(user);
    }

    async logout(userId: number) {
        await this.userRepo.update(userId, {refreshToken: null});
        return {message: 'Muvaffaqiyatli chiqildi'};
    }

    private async sendOtp(user: User, type: OtpType) {
        // Eski OTPlarni bekor qilish
        await this.otpRepo.update({userId: user.id, type, isUsed: false}, {isUsed: true});

        const code = Math.floor(100000 + Math.random() * 900000).toString();
        const expireMinutes = parseInt(this.configService.get('OTP_EXPIRE_MINUTES', '5'));
        const expiredAt = new Date(Date.now() + expireMinutes * 60 * 1000);

        await this.otpRepo.save(this.otpRepo.create({userId: user.id, code, expiredAt, type}));


        console.log(`OTP [${type}] for ${user.login}: ${code}`);
    }

    private async generateTokens(user: User) {
        const payload = {sub: user.id, role: user.role};
        const accessToken = this.jwtService.sign(payload, {
            secret: this.configService.get('JWT_SECRET'),
            expiresIn: this.configService.get('JWT_EXPIRES_IN', '15m'),
        });
        const refreshToken = this.jwtService.sign(payload, {
            secret: this.configService.get('JWT_REFRESH_SECRET'),
            expiresIn: this.configService.get('JWT_REFRESH_EXPIRES_IN', '30d'),
        });
        const hashedRefresh = await bcrypt.hash(refreshToken, 10);
        await this.userRepo.update(user.id, {refreshToken: hashedRefresh});
        return {accessToken, refreshToken, user: {id: user.id, role: user.role, fullName: user.fullName}};
    }
}
