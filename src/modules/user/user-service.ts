import { ConflictError, NotFoundError } from '../../shared/AppError.js';
import { UserRepository } from './user-repository.js';

interface UserData {
  email: string;
}

export class UserService {
  constructor(private userRepository: UserRepository) {}

  async create({ email }: UserData) {
    const hasUser = await this.userRepository.findUser(email);

    if (!hasUser) {
      const user = await this.userRepository.createUser(email);
      return {
        email: user.email,
        createdAt: user.createdAt,
        id: user.id,
      };
    } else {
      throw new ConflictError('Email já cadastrado');
    }
  }

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
}
