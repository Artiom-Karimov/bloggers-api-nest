import DateGenerator from '../../../../common/utils/date.generator';
import IdGenerator from '../../../../common/utils/id.generator';
import PostCreateModel from './post.create.model';

export default class PostModel {
  constructor(
    public id: string,
    public title: string,
    public shortDescription: string,
    public content: string,
    public blogId: string,
    public blogName: string,
    public createdAt: string,
  ) { }
  public static create(data: PostCreateModel): PostModel {
    return new PostModel(
      IdGenerator.generate(),
      data.title,
      data.shortDescription,
      data.content,
      data.blogId,
      data.blogName,
      DateGenerator.generate(),
    );
  }
}
