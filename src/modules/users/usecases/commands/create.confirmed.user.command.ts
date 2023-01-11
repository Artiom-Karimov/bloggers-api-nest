import UserInputModel from '../../models/input/user.input.model';

export default class CreateConfirmedUserCommand {
  constructor(public data: UserInputModel) { }
}
