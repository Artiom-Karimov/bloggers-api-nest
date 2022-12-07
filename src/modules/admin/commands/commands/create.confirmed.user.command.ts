import UserInputModel from '../../../users/models/input/user.input.model';

export default class CreateConfirmedUserCommand {
  constructor(public data: UserInputModel) { }
}
