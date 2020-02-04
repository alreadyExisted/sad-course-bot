import { Injectable } from '@nestjs/common'
import { CacheService } from 'src/cache'
import { Courses, CourseStatus } from './course.interface'
import { ParserService } from 'src/parser'

const COURSE_CACHE_KEY = 'course'
const COURSE_CACHE_TTL = 60 // 1 min

@Injectable()
export class CourseService {
  constructor(
    private cacheService: CacheService<Courses | undefined>,
    private parserService: ParserService
  ) {}

  async getCourses(): Promise<Courses> {
    const courses = await this.cacheService.get(COURSE_CACHE_KEY)

    if (courses) {
      return courses
    }

    const { purchase, selling } = await this.parserService.parseCourse()

    return {
      status: this.getStatus(null, purchase.value),
      purchase,
      selling
    }
  }

  async setCourses(courses: Omit<Courses, 'status'>): Promise<Courses> {
    const prevCourses = await this.cacheService.get(COURSE_CACHE_KEY)
    const storedCourses: Courses = {
      ...courses,
      status: this.getStatus(
        prevCourses?.purchase.value || null,
        courses.purchase.value
      )
    }

    this.cacheService.set(COURSE_CACHE_KEY, storedCourses, {
      ttl: COURSE_CACHE_TTL
    })

    return storedCourses
  }

  private getStatus(prevCourse: number | null, courseValue: number) {
    if (!prevCourse) {
      return CourseStatus.None
    }

    switch (true) {
      case courseValue > prevCourse:
        return CourseStatus.Up
      case courseValue < prevCourse:
        return CourseStatus.Down
      default:
        return CourseStatus.None
    }
  }
}
