export class UserResponceDTO {
  id: string;
  name: string;
  lastname: string;
  email: string;
  role: string;
}

export class Payload {
  id: string;
  role: string;
}

export type payload = Payload;
