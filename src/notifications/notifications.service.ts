import { Injectable, Logger } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class NotificationsService {
  private readonly logger = new Logger(NotificationsService.name);

  constructor(
    private readonly mailerService: MailerService,
    private readonly configService: ConfigService,
  ) { }

  async sendWelcomeEmail(email: string) {
    try {
      await this.mailerService.sendMail({
        to: email,
        subject: 'Bem vindo à fila de acesso antecipado!',
        template: 'welcome-lead',
        context: {
          email,
        },
      });
      this.logger.log(`Email de boas vindas enviado para ${email}`);
    } catch (error) {
      this.logger.error(`Failed to send email de boas vindas para ${email}`, error);
    }
  }

  async sendAdminNotification(leadEmail: string) {
    const adminEmail = this.configService.get<string>('MY_EMAIL');
    if (!adminEmail) {
      this.logger.warn('MY_EMAIL not configured, skipping admin notification');
      return;
    }

    try {
      await this.mailerService.sendMail({
        to: adminEmail,
        subject: 'Novo Lead na Fila de Acesso Antecipado',
        template: 'new-lead-admin',
        context: {
          email: leadEmail,
        },
      });
      this.logger.log(`Email de notificação enviado para ${adminEmail} para lead ${leadEmail}`);
    } catch (error) {
      this.logger.error(`Failed to send email de notificação para ${adminEmail} para lead ${leadEmail}`, error);
    }
  }
}
