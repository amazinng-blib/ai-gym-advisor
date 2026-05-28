import { Request, Response } from 'express';
import { hashPassword, comparePassword, generateToken } from '../utils/auth';
import { ApiResponse, AuthRequest } from '../types';
import UserModel from '../models/user_models';

export const register = async (req: Request, res: Response) => {
  try {
    const { email, password, name } = req.body as AuthRequest;

    if (!email || !password || !name) {
      const response: ApiResponse<null> = {
        success: false,
        message: 'Email, password, and name are required',
      };
      return res.status(400).json(response);
    }

    // Check if user already exists
    const existingUser = await UserModel.findOne({ where: { email } });
    if (existingUser) {
      const response: ApiResponse<null> = {
        success: false,
        message: 'User with this email already exists',
      };
      return res.status(400).json(response);
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Create user
    const newUser = await UserModel.create({
      name,
      email,
      password: hashedPassword,
    });

    // Generate token
    const token = generateToken(newUser?.getDataValue('id') as string);

    const response: ApiResponse<any> = {
      success: true,
      message: 'User registered successfully',
      data: {
        user: {
          id: newUser.getDataValue('id'),
          email: newUser.getDataValue('email'),
          name: newUser.getDataValue('name'),
        },
        token,
      },
    };

    res.status(201).json(response);
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : 'Unknown error';
    const response: ApiResponse<null> = {
      success: false,
      message: 'Registration failed',
      error: errorMessage,
    };
    res.status(500).json(response);
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body as AuthRequest;

    if (!email || !password) {
      const response: ApiResponse<null> = {
        success: false,
        message: 'Email and password are required',
      };
      return res.status(400).json(response);
    }

    // Find user
    const user = await UserModel.findOne({ where: { email } });
    if (!user) {
      const response: ApiResponse<null> = {
        success: false,
        message: 'Invalid email or password',
      };
      return res.status(401).json(response);
    }

    // Compare password
    const isPasswordValid = await comparePassword(
      password,
      user.getDataValue('password'),
    );
    if (!isPasswordValid) {
      const response: ApiResponse<null> = {
        success: false,
        message: 'Invalid email or password',
      };
      return res.status(401).json(response);
    }

    // Generate token
    const token = generateToken(user?.getDataValue('id') as string);

    const response: ApiResponse<any> = {
      success: true,
      message: 'Login successful',
      data: {
        user: {
          id: user.getDataValue('id'),
          email: user.getDataValue('email'),
          name: user.getDataValue('name'),
        },
        token,
      },
    };

    res.status(200).json(response);
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : 'Unknown error';
    const response: ApiResponse<null> = {
      success: false,
      message: 'Login failed',
      error: errorMessage,
    };
    res.status(500).json(response);
  }
};

export const logout = async (req: Request, res: Response) => {
  try {
    const response: ApiResponse<null> = {
      success: true,
      message: 'Logout successful',
    };

    res.status(200).json(response);
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : 'Unknown error';
    const response: ApiResponse<null> = {
      success: false,
      message: 'Logout failed',
      error: errorMessage,
    };
    res.status(500).json(response);
  }
};

export const refresh = async (req: Request, res: Response) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      const response: ApiResponse<null> = {
        success: false,
        message: 'User ID is required',
      };
      return res.status(400).json(response);
    }

    // Find user
    const user = await UserModel.findByPk(userId);
    if (!user) {
      const response: ApiResponse<null> = {
        success: false,
        message: 'User not found',
      };
      return res.status(404).json(response);
    }

    // Generate new token
    const token = generateToken(userId);

    const response: ApiResponse<any> = {
      success: true,
      message: 'Token refreshed successfully',
      data: {
        user: {
          id: user?.getDataValue('id'),
          email: user?.getDataValue('email'),
          name: user?.getDataValue('name'),
        },
        token,
      },
    };

    res.status(200).json(response);
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : 'Unknown error';
    const response: ApiResponse<null> = {
      success: false,
      message: 'Token refresh failed',
      error: errorMessage,
    };
    res.status(500).json(response);
  }
};
