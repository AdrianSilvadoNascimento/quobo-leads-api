import { Module } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { NotificationsController } from './notifications.controller';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { ConfigService, ConfigModule } from '@nestjs/config';
import { join } from 'path';

@Module({
  imports: [
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        const host = configService.get('EMAIL_HOST');
        const port = configService.get('EMAIL_PORT');
        const secure = configService.get('EMAIL_SECURE') === 'true';
        const user = configService.get('EMAIL_USERNAME');

        console.log(`[MailerConfig] Configuring Mailer: Host=${host}, Port=${port}, Secure=${secure}, User=${user}`);

        return {
          transport: {
            host: configService.get('EMAIL_HOST'),
            port: configService.get('EMAIL_PORT'),
            secure: configService.get('EMAIL_SECURE') === 'true',
            auth: {
              user: configService.get('EMAIL_USERNAME'),
              pass: configService.get('EMAIL_PASSWORD'),
            },
          },
          defaults: {
            from: `"${configService.get('EMAIL_FROM_NAME')}" <${configService.get('EMAIL_FROM')}>`,
          },
          template: {
            dir: join(__dirname, 'templates'),
            adapter: new HandlebarsAdapter(),
            options: {
              strict: true,
            },
          },
        };
      },
      inject: [ConfigService],
    }),
  ],
  controllers: [NotificationsController],
  providers: [NotificationsService],
})
export class NotificationsModule { }
