import DateGenerator from 'src/common/utils/date.generator';
import IdGenerator from 'src/common/utils/id.generator';

export type PostInputModel = {
  title: string;
  shortDescription: string;
  content: string;
  blogId: string;
  blogName: string;
};

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
  public static create(data: PostInputModel): PostModel {
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
