import { ApiProperty } from '@nestjs/swagger';

export class AccessTokenViewModel {
  @ApiProperty()
  accessToken: string;
}
