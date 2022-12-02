import UserInputModel from '../../../users/models/user.input.model';

export default class CreateConfirmedUserCommand {
  constructor(public data: UserInputModel) { }
}
