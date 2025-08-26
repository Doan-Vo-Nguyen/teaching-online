import { Server, Socket } from 'socket.io';
import { DuplicateLoginService } from '../services/duplicate-login.service';
import { Logger } from '../config/logger';

interface SessionData {
  userId: string;
  fingerprint: string;
  role?: string | string[];
  deviceInfo?: {
    userAgent?: string;
    browser?: string;
    os?: string;
    device?: string;
    [key: string]: any;
  };
}

/**
 * Enhanced browser detection from user agent
 */
function parseUserAgent(userAgent: string): { browser: string; os: string; device: string } {
  // Only log for debug mode or unexpected cases
  if (!userAgent) {
    Logger.warn('Empty user agent received for parsing');
    return { browser: 'Unknown', os: 'Unknown', device: 'Unknown' };
  }
  
  let browser = 'Unknown';
  let os = 'Unknown';
  let device = 'Desktop';

  // Browser detection first (order matters for some cases)
  if (/Edge\/|Edg\//.test(userAgent)) browser = 'Microsoft Edge';
  else if (/OPR\/|Opera\//.test(userAgent)) browser = 'Opera';
  else if (/Chrome\//.test(userAgent) && !/Chromium\//.test(userAgent)) browser = 'Chrome';
  else if (/Firefox\//.test(userAgent)) browser = 'Firefox';
  else if (/Safari\//.test(userAgent) && !/Chrome\//.test(userAgent) && !/Chromium\//.test(userAgent)) browser = 'Safari';
  else if (/MSIE|Trident\//.test(userAgent)) browser = 'Internet Explorer';
  else if (/Chromium\//.test(userAgent)) browser = 'Chromium';
  else if (/CocCoc\/|CocCocBrowser/.test(userAgent)) browser = 'CocCoc';
  // Mobile browsers
  else if (/UCBrowser\//.test(userAgent)) browser = 'UC Browser';
  else if (/SamsungBrowser\//.test(userAgent)) browser = 'Samsung Browser';
  else if (/YaBrowser\//.test(userAgent)) browser = 'Yandex Browser';
  else if (/FBIOS|FBAV|FBAN/.test(userAgent)) browser = 'Facebook App';
  else if (/Instagram/.test(userAgent)) browser = 'Instagram App';
  // Fallback for generic WebKit/Mozilla
  else if (/AppleWebKit/.test(userAgent)) browser = 'WebKit-based';
  else if (/Gecko\//.test(userAgent)) browser = 'Gecko-based';
  else if (/Mozilla\/5.0/.test(userAgent)) browser = 'Mozilla-based';

  // Operating System detection
  if (/Windows NT 11.0|Windows 11/.test(userAgent)) os = 'Windows 11';
  else if (/Windows NT 10.0|Windows 10/.test(userAgent)) os = 'Windows 10';
  else if (/Windows NT 6.3|Windows 8.1/.test(userAgent)) os = 'Windows 8.1';
  else if (/Windows NT 6.2|Windows 8/.test(userAgent)) os = 'Windows 8';
  else if (/Windows NT 6.1|Windows 7/.test(userAgent)) os = 'Windows 7';
  else if (/Windows NT 6.0|Windows Vista/.test(userAgent)) os = 'Windows Vista';
  else if (/Windows NT 5.1|Windows XP/.test(userAgent)) os = 'Windows XP';
  else if (/Windows/.test(userAgent)) os = 'Windows';
  // macOS with different version pattern matching
  else if (/Mac OS X/.test(userAgent)) {
    const macOsVersions = {
      '10_15': 'Catalina',
      '10_14': 'Mojave',
      '10_13': 'High Sierra',
      '11': 'Big Sur',
      '12': 'Monterey',
      '13': 'Ventura',
      '14': 'Sonoma'
    };
    
    let macVersion = '';
    
    // Try different patterns for Mac OS versions
    const versionMatch = userAgent.match(/Mac OS X (\d+[._]\d+)/) || 
                         userAgent.match(/Mac OS X (\d+)/) ||
                         userAgent.match(/Version\/[\d.]+.*Mac OS X (\d+[._]\d+)/);
    
    if (versionMatch && versionMatch[1]) {
      const vKey = versionMatch[1].replace('.', '_');
      macVersion = Object.keys(macOsVersions).includes(vKey) 
        ? ` ${macOsVersions[vKey as keyof typeof macOsVersions]}` 
        : ` ${versionMatch[1].replace(/_/g, '.')}`;
    }
    
    os = `macOS${macVersion}`;
  }
  // Android with version extraction
  else if (/Android/.test(userAgent)) {
    const androidVersion = userAgent.match(/Android[\s/]?([0-9.]+)/i);
    os = androidVersion && androidVersion[1] ? `Android ${androidVersion[1]}` : 'Android';
  }
  // iOS with version extraction - multiple patterns
  else if (/iPhone|iPad|iPod/.test(userAgent)) {
    let iosVersion = '';
    
    // Try different patterns for iOS versions
    const versionMatch = userAgent.match(/OS ([\d_]+) like Mac OS X/) || 
                         userAgent.match(/iPhone OS ([\d_]+)/) ||
                         userAgent.match(/iOS ([\d.]+)/);
    
    if (versionMatch && versionMatch[1]) {
      iosVersion = ` ${versionMatch[1].replace(/_/g, '.')}`;
    }
    
    os = `iOS${iosVersion}`;
  }
  // Linux distros
  else if (/Ubuntu/.test(userAgent)) os = 'Ubuntu Linux';
  else if (/Fedora/.test(userAgent)) os = 'Fedora Linux';
  else if (/Debian/.test(userAgent)) os = 'Debian Linux';
  else if (/CentOS/.test(userAgent)) os = 'CentOS Linux';
  else if (/Linux/.test(userAgent)) os = 'Linux';
  // Other OS options
  else if (/CrOS/.test(userAgent)) os = 'Chrome OS';
  else if (/BlackBerry|BB10|RIM Tablet OS/.test(userAgent)) os = 'BlackBerry';

  // Device type detection - should happen after OS detection in some cases
  if (/iPhone|iPod/.test(userAgent) || /Android.*Mobile/.test(userAgent) || /Mobile/.test(userAgent) || /Windows Phone/.test(userAgent)) {
    device = 'Mobile';
  } else if (/iPad/.test(userAgent) || /Android/.test(userAgent) && !/Mobile/.test(userAgent) || /Tablet/.test(userAgent)) {
    device = 'Tablet';
  } else if (/TV|SmartTV|HbbTV/.test(userAgent)) {
    device = 'Smart TV';
  } else if (/Console|PlayStation|Xbox|Nintendo/.test(userAgent)) {
    device = 'Game Console';
  }

  return { browser, os, device };
}

export class DuplicateLoginSocket {
  private static instance: DuplicateLoginSocket;
  private duplicateLoginService: DuplicateLoginService;

  private constructor() {
    this.duplicateLoginService = DuplicateLoginService.getInstance();
  }

  public static getInstance(): DuplicateLoginSocket {
    if (!DuplicateLoginSocket.instance) {
      DuplicateLoginSocket.instance = new DuplicateLoginSocket();
    }
    return DuplicateLoginSocket.instance;
  }

  public initialize(io: Server): void {
    if (!io) {
      Logger.error('Failed to initialize socket handler: Socket.IO server is null');
      return;
    }

    this.duplicateLoginService.setSocketServer(io);
    
    io.on('connection', (socket: Socket) => {
      const socketId = socket.id;
      Logger.info(`Socket connected: ${socketId}`);

      // Debug helper for testing browser detection
      socket.on('debug_browser_detection', (callback) => {
        try {
          const userAgent = socket.handshake?.headers['user-agent'] as string;
          const result = parseUserAgent(userAgent);
          
          if (typeof callback === 'function') {
            callback({
              userAgent,
              detectedInfo: result,
              deviceSummary: `${result.browser} on ${result.os} (${result.device})`
            });
          }
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Unknown error';
          Logger.error(`Error in debug_browser_detection: ${errorMessage}`);
          if (typeof callback === 'function') {
            callback({ error: 'Failed to process user agent' });
          }
        }
      });

      socket.on('register_session', (data: SessionData) => {
        try {
          if (!data || !data.userId || !data.fingerprint) {
            Logger.error(`Invalid session registration data`);
            socket.emit('session_registered', {
              success: false,
              message: 'Missing required data for session registration'
            });
            return;
          }
          
          const { userId, fingerprint, deviceInfo, role } = data;
          
          // Get device info from user agent if not provided completely
          let deviceSummary = 'Unknown device';
          let parsedInfo: { browser: string; os: string; device: string } | null = null;
          
          // Case 1: Client provided complete device info
          if (deviceInfo?.browser && deviceInfo?.os) {
            deviceSummary = `${deviceInfo.browser} on ${deviceInfo.os} ${deviceInfo.device ? `(${deviceInfo.device})` : ''}`.trim();
          } 
          // Case 2: Client provided user agent but not browser/OS
          else if (deviceInfo?.userAgent) {
            parsedInfo = parseUserAgent(deviceInfo.userAgent);
            
            // Use parsed information if not provided
            const browser = deviceInfo.browser || parsedInfo.browser;
            const os = deviceInfo.os || parsedInfo.os;
            const device = deviceInfo.device || parsedInfo.device;
            
            deviceSummary = `${browser} on ${os} (${device})`;
          } 
          // Case 3: Fallback to socket handshake user agent
          else if (socket.handshake?.headers['user-agent']) {
            parsedInfo = parseUserAgent(socket.handshake.headers['user-agent'] as string);
            deviceSummary = `${parsedInfo.browser} on ${parsedInfo.os} (${parsedInfo.device})`;
          }
          
          // Critical log for security monitoring
          Logger.info(`User ${userId} session registration from: ${deviceSummary}`);
          
          const isNewSession = this.duplicateLoginService.handleLogin(
            userId, 
            fingerprint, 
            socket.id,
            deviceSummary,
            role
          );
          
          socket.emit('session_registered', {
            success: true,
            isNewSession,
            message: isNewSession ? 'New session registered' : 'Existing session updated'
          });
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Unknown error';
          Logger.error(`Error registering session: ${errorMessage}`);
          socket.emit('session_registered', {
            success: false,
            message: 'Failed to register session'
          });
        }
      });

      socket.on('logout', (data: { userId: string }) => {
        try {
          if (!data || !data.userId) {
            socket.emit('logout_error', { message: 'User ID is required' });
            return;
          }

          // Critical log for security monitoring
          Logger.info(`User ${data.userId} logged out, socket: ${socket.id}`);
          
          this.duplicateLoginService.handleLogout(data.userId, socket.id);
          socket.emit('logout_success');
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Unknown error';
          Logger.error(`Error handling logout: ${errorMessage}`);
          socket.emit('logout_error', { message: 'Failed to process logout' });
        }
      });

      socket.on('disconnect', () => {
        Logger.info(`Socket disconnected: ${socket.id}`);
        this.duplicateLoginService.handleDisconnect(socket.id);
      });

      // Health check event
      socket.on('health_check', (callback) => {
        if (typeof callback === 'function') {
          callback({ 
            status: 'healthy',
            timestamp: new Date().toISOString()
          });
        }
      });
    });

    // Log active connections every 10 minutes - critical for system monitoring
    setInterval(() => {
      Logger.info(`Active socket connections: ${io.sockets.sockets.size}`);
    }, 10 * 60 * 1000);
  }
} 