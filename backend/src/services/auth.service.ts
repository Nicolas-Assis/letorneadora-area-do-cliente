import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as admin from 'firebase-admin';
import { DecodedIdToken } from 'firebase-admin/auth';

@Injectable()
export class AuthService implements OnModuleInit {
  private readonly logger = new Logger(AuthService.name);

  constructor(private readonly config: ConfigService) {}

  onModuleInit() {
    this.initializeFirebase();
  }

  private initializeFirebase() {
    try {
      // Verificar se o Firebase já foi inicializado
      if (admin.apps.length === 0) {
        const firebaseConfig = this.getFirebaseConfig();
        
        admin.initializeApp({
          credential: admin.credential.cert(firebaseConfig),
        });

        this.logger.log('Firebase Admin SDK initialized successfully');
      }
    } catch (error) {
      this.logger.error('Failed to initialize Firebase Admin SDK:', error);
      throw error;
    }
  }

  private getFirebaseConfig() {
    // Configuração pode vir de variáveis de ambiente ou arquivo JSON
    const projectId = this.config.get<string>('FIREBASE_PROJECT_ID');
    const privateKey = this.config.get<string>('FIREBASE_PRIVATE_KEY')?.replace(/\\n/g, '\n');
    const clientEmail = this.config.get<string>('FIREBASE_CLIENT_EMAIL');

    if (!projectId || !privateKey || !clientEmail) {
      throw new Error('Firebase configuration is incomplete. Check FIREBASE_PROJECT_ID, FIREBASE_PRIVATE_KEY, and FIREBASE_CLIENT_EMAIL environment variables.');
    }

    return {
      projectId,
      privateKey,
      clientEmail,
    };
  }

  async verifyIdToken(idToken: string): Promise<DecodedIdToken> {
    try {
      const decodedToken = await admin.auth().verifyIdToken(idToken);
      this.logger.debug(`Token verified for user: ${decodedToken.uid}`);
      return decodedToken;
    } catch (error) {
      this.logger.error('Token verification failed:', error);
      throw error;
    }
  }

  async setCustomUserClaims(uid: string, customClaims: object): Promise<void> {
    try {
      await admin.auth().setCustomUserClaims(uid, customClaims);
      this.logger.debug(`Custom claims set for user: ${uid}`);
    } catch (error) {
      this.logger.error('Failed to set custom claims:', error);
      throw error;
    }
  }

  async getUserByUid(uid: string) {
    try {
      const userRecord = await admin.auth().getUser(uid);
      return userRecord;
    } catch (error) {
      this.logger.error('Failed to get user:', error);
      throw error;
    }
  }

  async createUser(userData: {
    email: string;
    password?: string;
    displayName?: string;
    role?: string;
  }) {
    try {
      const userRecord = await admin.auth().createUser({
        email: userData.email,
        password: userData.password,
        displayName: userData.displayName,
        emailVerified: false,
      });

      // Definir role padrão como 'client' se não especificado
      const role = userData.role || 'client';
      await this.setCustomUserClaims(userRecord.uid, { role });

      this.logger.debug(`User created: ${userRecord.uid} with role: ${role}`);
      return userRecord;
    } catch (error) {
      this.logger.error('Failed to create user:', error);
      throw error;
    }
  }

  async updateUserRole(uid: string, role: string): Promise<void> {
    try {
      await this.setCustomUserClaims(uid, { role });
      this.logger.debug(`Role updated for user ${uid}: ${role}`);
    } catch (error) {
      this.logger.error('Failed to update user role:', error);
      throw error;
    }
  }

  async deleteUser(uid: string): Promise<void> {
    try {
      await admin.auth().deleteUser(uid);
      this.logger.debug(`User deleted: ${uid}`);
    } catch (error) {
      this.logger.error('Failed to delete user:', error);
      throw error;
    }
  }

  async listUsers(maxResults: number = 1000) {
    try {
      const listUsersResult = await admin.auth().listUsers(maxResults);
      return listUsersResult.users;
    } catch (error) {
      this.logger.error('Failed to list users:', error);
      throw error;
    }
  }
}

