import { CreateUserInput } from './../schema/user.schema';
import { LoginInput, UserModel } from '../schema/user.schema';
import Context from '../types/Context';
import { ApolloError } from 'apollo-server-core';
import bcrypt from 'bcrypt';
import { signJwt } from '../utils/jwt';

class UserService {
  async createUser(input: CreateUserInput) {
    // call user model to create a user
    return UserModel.create(input);
  }

  async login(input: LoginInput, context: Context) {
    const e = 'Invalid email or password';
    // Get our user by email
    const user = await UserModel.find().findByEmail(input.email).lean();

    if (!user) {
      throw new ApolloError(e);
    }

    // validate the password

    const passwordIsValid = await bcrypt.compare(input.password, user.password);

    if (!passwordIsValid) {
      throw new ApolloError(e);
    }

    // sign a jwt
    const token = signJwt(user);

    // set a cookie for the jwt
    context.res.cookie('accessToken', token, {
      maxAge: 3.154e10,
      httpOnly: true,
      domain: 'localhost', // set domain in prod
      path: '/',
      sameSite: 'strict',
      secure: process.env.NODE_ENV === 'production',
    });

    // return the jwt
    return token;
  }
}

export default UserService;
