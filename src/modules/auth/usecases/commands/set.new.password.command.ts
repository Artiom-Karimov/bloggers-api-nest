import NewPasswordInputModel from '../../models/input/new.password.input.model';

export default class SetNewPasswordCommand {
  constructor(public data: NewPasswordInputModel) { }
}
