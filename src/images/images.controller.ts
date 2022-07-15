import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { QuestionsService } from 'src/questions/questions.service';
import { ImagesService } from './images.service';

@Controller('images')
@ApiTags('이미지 API')
export class ImagesController {
  constructor(private readonly imagesService: ImagesService) {}
}
