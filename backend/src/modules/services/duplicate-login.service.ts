import { Server } from 'socket.io';
import { Logger } from '../config/logger';

interface UserSession {
  userId: string;
  fingerprint: string;
  socketId: string;
  lastActive: Date;
  deviceInfo?: string;
  role?: string | string[];
}

export class DuplicateLoginService {
  private static instance: DuplicateLoginService;
  private userSessions: Map<string, UserSession[]> = new Map();
  private io: Server | null = null;
  // Roles that are exempt from duplicate login detection
  private exemptRoles = ['admin', 'teacher'];

  private constructor() {
    Logger.info('DuplicateLoginService initialized');
    // Log session status every 5 minutes
    setInterval(() => this.logSessionStatus(), 5 * 60 * 1000);
  }

  public static getInstance(): DuplicateLoginService {
    if (!DuplicateLoginService.instance) {
      DuplicateLoginService.instance = new DuplicateLoginService();
    }
    return DuplicateLoginService.instance;
  }

  public setSocketServer(io: Server): void {
    this.io = io;
  }

  /**
   * Check if the role is exempt from duplicate login detection
   */
  private isExemptRole(role?: string | string[]): boolean {
    if (!role) return false;
    
    if (Array.isArray(role)) {
      return role.some(r => this.exemptRoles.includes(r));
    }
    
    return this.exemptRoles.includes(role);
  }

  public handleLogin(userId: string, fingerprint: string, socketId: string, deviceInfo?: string, role?: string | string[]): boolean {
    const userSessions = this.userSessions.get(userId) || [];
    const existingSession = userSessions.find(session => session.fingerprint === fingerprint);

    if (existingSession) {
      // Update existing session
      existingSession.socketId = socketId;
      existingSession.lastActive = new Date();
      if (deviceInfo) {
        existingSession.deviceInfo = deviceInfo;
      }
      if (role) {
        existingSession.role = role;
      }
      return false;
    }

    // Check for duplicate login - skip for exempt roles
    if (userSessions.length > 0 && !this.isExemptRole(role)) {
      Logger.warn(`Duplicate login detected for user ${userId}! Current sessions: ${userSessions.length}`);
      
      // Notify all existing sessions about the new login
      userSessions.forEach(session => {
        if (this.io) {
          this.io.to(session.socketId).emit('duplicate_login_detected', {
            message: 'Another device has logged in with your account',
            timestamp: new Date(),
            deviceInfo: deviceInfo || 'Unknown device'
          });
        } else {
          Logger.error('Socket.io server not initialized!');
        }
      });
    }

    // Add new session
    const newSession: UserSession = {
      userId,
      fingerprint,
      socketId,
      lastActive: new Date(),
      role
    };
    
    if (deviceInfo) {
      newSession.deviceInfo = deviceInfo;
    }
    
    userSessions.push(newSession);
    this.userSessions.set(userId, userSessions);
    
    return true;
  }

  public handleLogout(userId: string, socketId: string): void {
    const userSessions = this.userSessions.get(userId);
    if (!userSessions) {
      return;
    }

    const updatedSessions = userSessions.filter(session => session.socketId !== socketId);
    if (updatedSessions.length === 0) {
      this.userSessions.delete(userId);
    } else {
      this.userSessions.set(userId, updatedSessions);
    }
  }

  public handleDisconnect(socketId: string): void {
    for (const [userId, sessions] of this.userSessions.entries()) {
      const session = sessions.find(s => s.socketId === socketId);
      if (session) {
        this.handleLogout(userId, socketId);
        break;
      }
    }
  }

  public getActiveSessions(userId: string): UserSession[] {
    return this.userSessions.get(userId) || [];
  }

  public logSessionStatus(): void {
    const totalSessions = Array.from(this.userSessions.values()).reduce(
      (count, sessions) => count + sessions.length, 0);
    
    const usersWithMultipleSessions = Array.from(this.userSessions.entries())
      .filter(([_, sessions]) => sessions.length > 1)
      .length;
    
    Logger.info(`Session Status: ${this.userSessions.size} users, ${totalSessions} active sessions, ${usersWithMultipleSessions} users with multiple sessions`);
    
    // Log details only for users with multiple sessions (potential security concern)
    if (usersWithMultipleSessions > 0) {
      Array.from(this.userSessions.entries())
        .filter(([_, sessions]) => sessions.length > 1)
        .forEach(([userId, sessions]) => {
          Logger.info(`User ${userId} has ${sessions.length} active sessions`);
        });
    }
  }
} 