"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const app_module_1 = require("./app.module");
const api_key_guard_1 = require("./auth/api-key.guard");
const config_1 = require("@nestjs/config");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        transform: true,
    }));
    const configService = app.get(config_1.ConfigService);
    app.useGlobalGuards(new api_key_guard_1.ApiKeyGuard(configService));
    const config = new swagger_1.DocumentBuilder()
        .setTitle('API Imóveis Caixa')
        .setDescription('API para importação e consulta de imóveis em leilão da Caixa Econômica Federal')
        .setVersion('1.0')
        .addApiKey({ type: 'apiKey', name: 'x-api-key', in: 'header' }, 'x-api-key')
        .build();
    const document = swagger_1.SwaggerModule.createDocument(app, config);
    swagger_1.SwaggerModule.setup('api', app, document);
    const port = process.env.PORT ?? 3000;
    await app.listen(port);
    console.log(`API rodando em http://localhost:${port}`);
    console.log(`Swagger em http://localhost:${port}/api`);
}
bootstrap();
//# sourceMappingURL=main.js.map