import { Module, OnModuleInit } from '@nestjs/common'
import { CacheModule } from 'src/cache'
import { ParserModule } from 'src/parser'
import { CourseService } from './course.service'

@Module({
  imports: [CacheModule, ParserModule],
  providers: [CourseService],
  exports: [CourseService]
})
export class CourseModule implements OnModuleInit {
  constructor(private courseService: CourseService) {}

  onModuleInit() {
    this.courseService.getCourses()
  }
}
