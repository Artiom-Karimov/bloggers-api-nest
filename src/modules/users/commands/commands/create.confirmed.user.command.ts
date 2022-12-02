import UserInputModel from '../../models/user.input.model';

export default class CreateConfirmedUserCommand {
  constructor(public data: UserInputModel) { }
}
