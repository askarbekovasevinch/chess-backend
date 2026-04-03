export enum Role {
    USER = 'user',
    ADMIN = 'admin',
    SUPER_ADMIN = 'superAdmin',
}

export enum LoginType {
    EMAIL = 'email',
    NUMBER = 'number',
}

export enum OtpType {
    REGISTER = 'register',
    PASSWORD_RESET = 'passwordReset',
    NUMBER_CHANGE = 'numberChange',
}

export enum MatchType {
    CLASSIC = 'classic',
    RAPID = 'rapid',
    BLITZ = 'blitz',
}

export enum WinnerType {
    FIRST = 'first',
    SECOND = 'second',
    DRAW = 'draw',
}

export enum ReportType {
    BOOK = 'book',
    COURSE = 'course',
}
