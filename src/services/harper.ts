import axios from 'axios';
import { IUser, UserRegistrationParams } from '../interface/user.interface';
import { IToken } from '../interface/token.interface';
import { v4 as uuid } from 'uuid';

const schema = process.env.HARPERDB_SCHEMA;
const dbUrl = process.env.HARPERDB_URL;
const dbPassword = process.env.HARPERDB_PW;

class Harper {
  private dbUrl?: string;
  private dbPassword?: string;
  private schema?: string;
  private dbStatus: boolean;

  constructor() {
    this.dbUrl = dbUrl;
    this.dbPassword = dbPassword;
    this.dbStatus = this.dbUrl !== undefined && this.dbPassword !== undefined;
    this.schema = schema;
  }

  config(method: 'POST', sql: string, operation: string = 'sql') {
    return {
      method,
      url: this.dbUrl,
      headers: {
        'Content-Type': 'application/json',
        Authorization: this.dbPassword,
      },
      data: JSON.stringify({
        operation,
        sql,
      }),
    };
  }

  //USER
  findUser(key: keyof IUser, value: string): Promise<IUser> | null {
    if (!this.dbStatus) {
      return null;
    }
    const config = this.config('POST', `SELECT * FROM ${this.schema}.users WHERE ${key} = '${value}'`);
    return new Promise((resolve, reject) => {
      axios(config)
        .then((response) => {
          resolve(response.data[0] || null);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  async createUser(user: UserRegistrationParams): Promise<IUser | null> {
    const { name, nickname, password, city, birthday, email } = user;
    if (!this.dbStatus) {
      return null;
    }
    const id = uuid();
    const activationLink = uuid();

    const isActivated = false;
    const config = this.config(
      'POST',
      `INSERT INTO ${this.schema}.users (id, nickname, email, password, name, birthday, city, activationLink, isActivated) VALUES ('${id}', '${nickname}', '${email}', '${password}', '${name}', '${birthday}', '${city}', '${activationLink}', ${isActivated})`
    );

    return new Promise((resolve, reject) => {
      axios(config)
        .then(async (_) => {
          resolve({
            id,
            email,
            password,
            name,
            nickname,
            city,
            birthday,
            activationLink,
            isActivated,
          });
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  async updateUserField(userId: string, field: keyof IUser, value: string | boolean | number) {
    let config;
    if (typeof value === 'string') {
      config = this.config('POST', `UPDATE ${this.schema}.users SET ${field} = '${value}' WHERE id = '${userId}'`);
    } else {
      config = this.config('POST', `UPDATE ${this.schema}.users SET ${field} = ${value} WHERE id = '${userId}'`);
    }
    return (await axios(config)).data;
  }

  async getAllUsers(): Promise<IUser[] | null> {
    const config = this.config('POST', `SELECT id, nickname FROM ${this.schema}.users`);
    return new Promise((resolve, reject) => {
      axios(config)
        .then((response) => {
          resolve(response.data || null);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  //TOKEN
  async saveToken(userId: string, refreshToken: string) {
    if (!this.dbStatus) {
      return null;
    }
    console.log('saveToken');
    let config = this.config('POST', `SELECT * FROM ${this.schema}.tokens WHERE id = '${userId}'`);

    const tokenData: IToken[] = (await axios(config)).data;
    if (tokenData[0]) {
      console.log('tokenData', tokenData[0]);
      config = this.config(
        'POST',
        `UPDATE ${this.schema}.tokens SET refreshToken = "${refreshToken}" WHERE id = '${userId}'`
      );

      try {
        console.log('try');
        const response = await axios(config);
        console.log(response);
        return response.data || null;
      } catch (e) {
        throw e;
      }
    }

    config = this.config(
      'POST',
      `INSERT INTO ${this.schema}.tokens (id, refreshToken) VALUES ('${userId}', '${refreshToken}')`
    );

    try {
      const response = await axios(config);
      return response.data || null;
    } catch (e) {
      throw e;
    }
  }

  async deleteRefreshToken(refreshToken: string) {
    const config = this.config('POST', `DELETE FROM ${this.schema}.tokens WHERE refreshToken = '${refreshToken}'`);
    return new Promise((resolve, reject) => {
      axios(config)
        .then((response) => {
          resolve(response.data || null);
        })
        .catch((e) => reject(e));
    });
  }

  async findRefreshToken(refreshToken: string) {
    const config = this.config('POST', `SELECT * FROM ${this.schema}.tokens WHERE refreshToken = '${refreshToken}'`);
    return new Promise((resolve, reject) => {
      axios(config)
        .then((response) => {
          resolve(response.data || null);
        })
        .catch((e) => reject(e));
    });
  }
}

export default Harper;
