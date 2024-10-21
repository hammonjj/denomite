export class Guid {
  private readonly value: string;

  constructor(value?: string) {
    this.value = value ?? crypto.randomUUID();
  }

  toString(): string {
    return this.value;
  }

  static fromString(value: string): Guid {
    return new Guid(value);
  }
}
