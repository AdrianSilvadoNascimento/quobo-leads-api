import { Controller } from '@nestjs/common';
import { EventPattern, Payload, Ctx, RmqContext } from '@nestjs/microservices';
import { NotificationsService } from './notifications.service';

@Controller()
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) { }

  @EventPattern('lead_created')
  async handleLeadCreated(@Payload() data: { email: string }, @Ctx() context: RmqContext) {
    const channel = context.getChannelRef();
    const originalMsg = context.getMessage();

    await this.notificationsService.sendWelcomeEmail(data.email);
    await this.notificationsService.sendAdminNotification(data.email);

    channel.ack(originalMsg);
  }
}
