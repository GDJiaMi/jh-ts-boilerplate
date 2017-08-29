/**
 * entry
 * @module
 */ /** */
import Base from './Base'

if (process.env.NODE_ENV === 'development') {
  console.log('hello world')
}

export default class Hello extends Base {
  public bar() {
    console.log('bar')
  }
}
