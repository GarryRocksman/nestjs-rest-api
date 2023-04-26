import { Optional } from '@nestjs/common';

export class EditBookmarkDto {
  @Optional()
  title?: string;

  @Optional()
  description?: string;

  @Optional()
  link?: string;
}
