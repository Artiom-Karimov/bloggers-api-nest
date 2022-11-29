import { BlogBanInfo, BlogOwnerInfo } from '../blog.model';
import BlogViewModel from './blog.view.model';

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
