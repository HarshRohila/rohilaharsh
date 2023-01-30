export { Input, MemoryInput }

interface Input {
  getRequests(): string[]
}

class MemoryInput implements Input {
  constructor(private input: string) {}

  getRequests(): string[] {
    return this.input.split('\n')
  }
}
