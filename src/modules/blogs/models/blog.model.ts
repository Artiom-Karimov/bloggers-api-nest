import DateGenerator from '../../../common/utils/date.generator';
import IdGenerator from '../../../common/utils/id.generator';
import BlogInputModel from './blog.input.model';

export default class BlogModel {
  constructor(
    public id: string,
    public name: string,
    public youtubeUrl: string,
    public createdAt: string,
  ) { }
  public static create(data: BlogInputModel): BlogModel {
    return new BlogModel(
      IdGenerator.generate(),
      data.name,
      data.youtubeUrl,
      DateGenerator.generate(),
    );
  }
}
