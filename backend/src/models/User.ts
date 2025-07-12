import { DataTypes, Model, Optional } from 'sequelize';
import bcrypt from 'bcryptjs';
import { sequelize } from '../config/database';

// Definir atributos del usuario
interface UserAttributes {
  id: number;
  username: string;
  email: string;
  password: string;
  avatar?: string;
  bio?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

// Atributos opcionales para la creación
interface UserCreationAttributes extends Optional<UserAttributes, 'id' | 'avatar' | 'bio' | 'createdAt' | 'updatedAt'> {}

// Clase del modelo User
class User extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes {
  public id!: number;
  public username!: string;
  public email!: string;
  public password!: string;
  public avatar?: string;
  public bio?: string;

  // Timestamps
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  // Método para comparar contraseñas
  public async comparePassword(candidatePassword: string): Promise<boolean> {
    return bcrypt.compare(candidatePassword, this.password);
  }
}

// Definir el modelo
User.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    username: {
      type: DataTypes.STRING(20),
      allowNull: false,
      unique: true,
      validate: {
        len: [3, 20],
        is: /^[a-zA-Z0-9_]+$/
      }
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true
      }
    },
    password: {
      type: DataTypes.STRING(255),
      allowNull: false,
      validate: {
        len: [6, 255]
      }
    },
    avatar: {
      type: DataTypes.TEXT,
      allowNull: true,
      defaultValue: ''
    },
    bio: {
      type: DataTypes.STRING(500),
      allowNull: true,
      defaultValue: '',
      validate: {
        len: [0, 500]
      }
    }
  },
  {
    sequelize,
    tableName: 'users',
    modelName: 'User',
    timestamps: true,
    hooks: {
      beforeCreate: async (user: User) => {
        if (user.password) {
          const salt = await bcrypt.genSalt(12);
          user.password = await bcrypt.hash(user.password, salt);
        }
      },
      beforeUpdate: async (user: User) => {
        if (user.changed('password')) {
          const salt = await bcrypt.genSalt(12);
          user.password = await bcrypt.hash(user.password, salt);
        }
      }
    }
  }
);

export { User, UserAttributes, UserCreationAttributes };
