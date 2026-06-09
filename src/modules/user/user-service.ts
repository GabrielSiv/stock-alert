import { NotFoundError } from '../../shared/AppError.js';
import { UserRepository } from './user-repository.js';

interface UserData {
  email: string;
}

export class UserService {
  constructor(private userRepository: UserRepository) {}

  async find({ email }: UserData) {
    const user = await this.userRepository.findUser(email);

    if (user) {
      return {
        email: user.email,
        createdAt: user.createdAt,
        id: user.id,
      };
    } else {
      throw new NotFoundError('Usuário não encontrado');
    }
  }

  async create({ email }: UserData) {
    const hasUser = await this.userRepository.findUser(email);

    if (!hasUser) {
      const user = await this.userRepository.createUser(email);
      return {
        created: true,
        user: { email: user.email, createdAt: user.createdAt, id: user.id },
      };
    }

    return {
      created: false,
      user: { email: hasUser.email, createdAt: hasUser.createdAt, id: hasUser.id },
    };
  }
}
