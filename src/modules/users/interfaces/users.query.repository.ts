import PageViewModel from '../../../common/models/page.view.model';
import SessionUserViewModel from '../models/view/session.user.view.model';
import GetUsersQuery from '../models/input/get.users.query';
import UserViewModel from '../models/view/user.view.model';

export default abstract class UsersQueryRepository {
  public abstract getUsers(
    params: GetUsersQuery,
  ): Promise<PageViewModel<UserViewModel>>;

  public abstract getUser(id: string): Promise<UserViewModel | undefined>;

  public abstract getSessionUserView(
    id: string,
  ): Promise<SessionUserViewModel | undefined>;
}
