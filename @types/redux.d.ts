// eslint-disable-next-line @typescript-eslint/no-unused-vars
import * as Redux from 'redux';
import { Task } from 'redux-saga';

declare module 'redux' {
  export interface Store {
    sagaTask: Task
  }
}
