export interface Course {
  value: number
  text: string
}

export interface Courses {
  purchase: Course
  selling: Course
  status: CourseStatus
}

export enum CourseStatus {
  None,
  Up,
  Down
}
