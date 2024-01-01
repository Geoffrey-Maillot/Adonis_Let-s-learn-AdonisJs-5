class CounterDefault {
  private count: number = 0

  public increment() {
    this.count++
    console.log('counter: ', this.count)
  }
}

// Singleton
export default new CounterDefault()
