import BlogViewModel from './blog.view.model';

export type BlogBanInfo = {
  isBanned: boolean;
  banDate: string | null;
};
export type BlogOwnerInfo = {
  userId: string | null;
  userLogin: string | null;
};

export default class AdminBlogViewModel extends BlogViewModel {
  constructor(
    viewModel: BlogViewModel,
    public blogOwnerInfo: BlogOwnerInfo,
    public banInfo: BlogBanInfo,
  ) {
    super(
      viewModel.id,
      viewModel.name,
      viewModel.description,
      viewModel.websiteUrl,
      viewModel.createdAt,
    );
  }
}
