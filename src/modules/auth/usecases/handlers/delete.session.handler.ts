import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import SessionsRepository from '../../../users/interfaces/sessions.repository';
import DeleteSessionCommand from '../commands/delete.session.command';
import {
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common/exceptions';

@CommandHandler(DeleteSessionCommand)
export default class DeleteSessionHandler
  implements ICommandHandler<DeleteSessionCommand>
{
  constructor(private readonly sessionsRepo: SessionsRepository) { }

  public async execute(command: DeleteSessionCommand): Promise<void> {
    const session = await this.sessionsRepo.get(command.deviceId);
    if (!session) throw new NotFoundException('session not found');

    if (session.userId !== command.userId) throw new ForbiddenException();

    await this.sessionsRepo.delete(command.deviceId);
  }
}
