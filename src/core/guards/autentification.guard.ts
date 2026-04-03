import {CanActivate, ExecutionContext, Injectable} from "@nestjs/common";
import {Observable} from "rxjs";
import {JwtService} from "@nestjs/jwt";
import {Reflector} from "@nestjs/core";

@Injectable()
class AuthenticationGuard implements CanActivate{
    private RolesKey: string;
    constructor(
        private readonly jwtService: JwtService,
        private readonly reflector: Reflector,
    ) {
    }

    canActivate(context: ExecutionContext){
        let roles = this.reflector.getAllAndOverride(this.RolesKey, [context.getHandler()])
        if (!roles){
            return true;
        }
    }
}

export default AuthenticationGuard