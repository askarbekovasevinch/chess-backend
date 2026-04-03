import {Module} from "@nestjs/common";
import {TempController} from "@/features/temp/controllers/temp.controller";

@Module({
    controllers: [TempController],
})

export class TempModule {

}