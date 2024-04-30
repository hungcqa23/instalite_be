import { ApiProperty } from '@nestjs/swagger';

export class FileUploadDto {
  @ApiProperty({ type: 'file', example: 'profile.png', name: 'avatar' })
  file: Express.Multer.File;
}
