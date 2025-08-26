# Duplicate Login Detection System

This document describes how to implement the duplicate login detection system on the frontend side using FingerprintJS and Socket.IO.

## Overview

The system detects when a user logs in from multiple devices/browsers and notifies all active sessions about the duplicate login. This helps maintain security by alerting users when their account is being accessed from another location.

> **Note:** Users with roles `admin` or `teacher` are exempt from duplicate login detection and can be logged in from multiple devices simultaneously without triggering alerts.

## Frontend Implementation

### 1. Install Required Dependencies

```bash
npm install @fingerprintjs/fingerprintjs socket.io-client
```

### 2. Initialize FingerprintJS

```typescript
import FingerprintJS from '@fingerprintjs/fingerprintjs';

// Initialize FingerprintJS
const fp = await FingerprintJS.load();
const result = await fp.get();
const visitorId = result.visitorId;
```

### 3. Socket.IO Integration

```typescript
import { io } from 'socket.io-client';

// Initialize socket connection
const socket = io('YOUR_BACKEND_URL', {
  withCredentials: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
  timeout: 10000
});

// Enhanced browser, OS, and device detection
function getBrowserInfo() {
  const ua = navigator.userAgent;
  
  // Object to store detection results
  const browserInfo = {
    userAgent: ua,
    browser: 'Unknown',
    os: 'Unknown',
    device: 'Desktop'
  };
  
  // Browser detection first (order matters for some cases)
  if (/Edge\/|Edg\//.test(ua)) browserInfo.browser = 'Microsoft Edge';
  else if (/OPR\/|Opera\//.test(ua)) browserInfo.browser = 'Opera';
  else if (/Chrome\//.test(ua) && !/Chromium\//.test(ua)) browserInfo.browser = 'Chrome';
  else if (/Firefox\//.test(ua)) browserInfo.browser = 'Firefox';
  else if (/Safari\//.test(ua) && !/Chrome\//.test(ua) && !/Chromium\//.test(ua)) browserInfo.browser = 'Safari';
  else if (/MSIE|Trident\//.test(ua)) browserInfo.browser = 'Internet Explorer';
  else if (/Chromium\//.test(ua)) browserInfo.browser = 'Chromium';
  else if (/CocCoc\/|CocCocBrowser/.test(ua)) browserInfo.browser = 'CocCoc';
  // Mobile browsers
  else if (/UCBrowser\//.test(ua)) browserInfo.browser = 'UC Browser';
  else if (/SamsungBrowser\//.test(ua)) browserInfo.browser = 'Samsung Browser';
  else if (/YaBrowser\//.test(ua)) browserInfo.browser = 'Yandex Browser';
  else if (/FBIOS|FBAV|FBAN/.test(ua)) browserInfo.browser = 'Facebook App';
  else if (/Instagram/.test(ua)) browserInfo.browser = 'Instagram App';
  // Fallback for generic WebKit/Mozilla
  else if (/AppleWebKit/.test(ua)) browserInfo.browser = 'WebKit-based';
  else if (/Gecko\//.test(ua)) browserInfo.browser = 'Gecko-based';
  else if (/Mozilla\/5.0/.test(ua)) browserInfo.browser = 'Mozilla-based';
  
  // Operating System detection
  if (/Windows NT 11.0|Windows 11/.test(ua)) browserInfo.os = 'Windows 11';
  else if (/Windows NT 10.0|Windows 10/.test(ua)) browserInfo.os = 'Windows 10';
  else if (/Windows NT 6.3|Windows 8.1/.test(ua)) browserInfo.os = 'Windows 8.1';
  else if (/Windows NT 6.2|Windows 8/.test(ua)) browserInfo.os = 'Windows 8';
  else if (/Windows NT 6.1|Windows 7/.test(ua)) browserInfo.os = 'Windows 7';
  else if (/Windows NT 6.0|Windows Vista/.test(ua)) browserInfo.os = 'Windows Vista';
  else if (/Windows NT 5.1|Windows XP/.test(ua)) browserInfo.os = 'Windows XP';
  else if (/Windows/.test(ua)) browserInfo.os = 'Windows';
  // macOS with different version pattern matching
  else if (/Mac OS X/.test(ua)) {
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
    const versionMatch = ua.match(/Mac OS X (\d+[._]\d+)/) || 
                         ua.match(/Mac OS X (\d+)/) ||
                         ua.match(/Version\/[\d.]+.*Mac OS X (\d+[._]\d+)/);
    
    if (versionMatch && versionMatch[1]) {
      const vKey = versionMatch[1].replace('.', '_');
      macVersion = Object.keys(macOsVersions).includes(vKey) 
        ? ` ${macOsVersions[vKey]}` 
        : ` ${versionMatch[1].replace(/_/g, '.')}`;
    }
    
    browserInfo.os = `macOS${macVersion}`;
  }
  // Android with version extraction
  else if (/Android/.test(ua)) {
    const androidVersion = ua.match(/Android[\s/]?([0-9.]+)/i);
    browserInfo.os = androidVersion && androidVersion[1] ? `Android ${androidVersion[1]}` : 'Android';
  }
  // iOS with version extraction - multiple patterns
  else if (/iPhone|iPad|iPod/.test(ua)) {
    let iosVersion = '';
    
    // Try different patterns for iOS versions
    const versionMatch = ua.match(/OS ([\d_]+) like Mac OS X/) || 
                         ua.match(/iPhone OS ([\d_]+)/) ||
                         ua.match(/iOS ([\d.]+)/);
    
    if (versionMatch && versionMatch[1]) {
      iosVersion = ` ${versionMatch[1].replace(/_/g, '.')}`;
    }
    
    browserInfo.os = `iOS${iosVersion}`;
  }
  // Linux distros
  else if (/Ubuntu/.test(ua)) browserInfo.os = 'Ubuntu Linux';
  else if (/Fedora/.test(ua)) browserInfo.os = 'Fedora Linux';
  else if (/Debian/.test(ua)) browserInfo.os = 'Debian Linux';
  else if (/CentOS/.test(ua)) browserInfo.os = 'CentOS Linux';
  else if (/Linux/.test(ua)) browserInfo.os = 'Linux';
  // Other OS options
  else if (/CrOS/.test(ua)) browserInfo.os = 'Chrome OS';
  else if (/BlackBerry|BB10|RIM Tablet OS/.test(ua)) browserInfo.os = 'BlackBerry';
  
  // Device type detection - should happen after OS detection in some cases
  if (/iPhone|iPod/.test(ua) || /Android.*Mobile/.test(ua) || /Mobile/.test(ua) || /Windows Phone/.test(ua)) {
    browserInfo.device = 'Mobile';
  } else if (/iPad/.test(ua) || /Android/.test(ua) && !/Mobile/.test(ua) || /Tablet/.test(ua)) {
    browserInfo.device = 'Tablet';
  } else if (/TV|SmartTV|HbbTV/.test(ua)) {
    browserInfo.device = 'Smart TV';
  } else if (/Console|PlayStation|Xbox|Nintendo/.test(ua)) {
    browserInfo.device = 'Game Console';
  }
  
  return browserInfo;
}

// Get the user's role from your authentication system
const userRole = getUserRole(); // Replace with your actual function to get user role

// TROUBLESHOOTING: Debug browser detection
// Call this before registering session to verify browser detection
socket.emit('debug_browser_detection', (result) => {
  // Only log during troubleshooting
  if (process.env.NODE_ENV === 'development') {
    console.log('Debug Browser Detection:', result);
  }
});

// Register session after successful login
socket.emit('register_session', {
  userId: 'USER_ID', // Get this from your auth system
  fingerprint: visitorId,
  role: userRole, // Include the user's role
  deviceInfo: getBrowserInfo()
});

// Listen for session registration response
socket.on('session_registered', (response) => {
  if (!response.success) {
    console.error('Failed to register session:', response.message);
    // Handle registration failure (maybe retry after a delay)
  }
});

// Listen for duplicate login notifications
socket.on('duplicate_login_detected', (data) => {
  // Critical security log - always keep this one
  console.warn(`Security alert: ${data.message} from device: ${data.deviceInfo}`);
  
  showSecurityAlert({
    title: 'Security Alert - Duplicate Login Detected',
    message: `Your account was accessed from another device: ${data.deviceInfo}`,
    timestamp: new Date(data.timestamp).toLocaleString(),
    type: 'warning'
  });
});

// Handle logout
function handleLogout() {
  socket.emit('logout', { userId: 'USER_ID' });
}

// Listen for logout success
socket.on('logout_success', () => {
  // Handle successful logout
  // Example: Redirect to login page
});

// Listen for logout errors
socket.on('logout_error', (data) => {
  console.error('Logout error:', data.message);
});

// Handle socket connection events
socket.on('connect', () => {
  // Critical connection event - keep this for debugging connectivity issues
  console.log('Socket connected');
});

socket.on('disconnect', () => {
  // Critical connection event - keep this for debugging connectivity issues
  console.log('Socket disconnected');
  // Handle disconnection - you might want to show a reconnection message
});

socket.on('connect_error', (error) => {
  console.error('Connection error:', error.message);
});

// Health check function - can be called periodically to ensure connection is alive
function checkSocketHealth() {
  socket.emit('health_check', (response) => {
    // Only log health check failures
    if (response.status !== 'healthy') {
      console.error('Socket health check failed:', response);
    }
  });
}

// Clean up on unmount (e.g., when component is destroyed)
function cleanUp() {
  // Remove all event listeners to prevent memory leaks
  socket.off('duplicate_login_detected');
  socket.off('session_registered');
  socket.off('logout_success');
  socket.off('logout_error');
  socket.off('connect');
  socket.off('disconnect');
  socket.off('connect_error');
  
  // Disconnect socket
  socket.disconnect();
}

// Add this to your frontend code to see what the frontend is detecting:

```javascript
// Only use this for troubleshooting - remove in production
if (process.env.NODE_ENV === 'development') {
  console.log('User Agent:', navigator.userAgent);
  console.log('Detected Browser Info:', getBrowserInfo());
}
```

## Troubleshooting Browser Detection Issues

If you're seeing "Unknown browser on Unknown OS" in your notifications or logs, try these steps:

### 1. Use the Debug Helper

The backend provides a special debug endpoint to help diagnose browser detection issues:

```javascript
// Add this to your frontend code after establishing socket connection
socket.emit('debug_browser_detection', (result) => {
  console.log('Server browser detection result:', result);
});
```

This will return:
- The full user agent string the server sees
- The detected browser, OS, and device information
- The final device summary that would be used for duplicate login alerts

### 2. Add Console Logging

Add this to your frontend code to see what the frontend is detecting:

```javascript
// Add this to your front-end code
console.log('User Agent:', navigator.userAgent);
console.log('Detected Browser Info:', getBrowserInfo());
```

### 3. Check for Special Cases

If the automatic detection isn't working, you can manually specify the browser information:

```javascript
// Manual override
socket.emit('register_session', {
  userId: 'USER_ID',
  fingerprint: visitorId,
  role: userRole,
  deviceInfo: {
    userAgent: navigator.userAgent,  // Always include this
    browser: 'Chrome',               // Manually specify
    os: 'Windows 10',                // Manually specify
    device: 'Desktop'                // Manually specify
  }
});
```

### 4. Server Logs

Check the server logs for entries like:
- `Parsing user agent: [your user agent string]`
- `Parsed user agent - Browser: [browser], OS: [os], Device: [device]`
- `Final device summary: [what appears in notifications]`

These logs will help identify where the detection is failing.

## Socket Events

### Emitted Events (Frontend to Backend)

1. `register_session`
   - Emitted after successful login
   - Payload: 
   ```typescript
   {
     userId: string;
     fingerprint: string;
     role?: string | string[]; // User's role(s)
     deviceInfo?: {
       userAgent?: string;
       browser?: string;
       os?: string;
       device?: string;
     }
   }
   ```

2. `logout`
   - Emitted when user logs out
   - Payload: `{ userId: string }`

3. `health_check`
   - Emitted to check if socket connection is healthy
   - Expects a callback function to receive response

4. `debug_browser_detection` (for troubleshooting only)
   - Helps diagnose browser detection issues
   - Returns details about server-side browser detection

### Received Events (Backend to Frontend)

1. `session_registered`
   - Response to register_session
   - Payload: `{ success: boolean, isNewSession: boolean, message: string }`

2. `duplicate_login_detected`
   - Emitted when another device logs in
   - Payload: `{ message: string, timestamp: Date, deviceInfo?: string }`

3. `logout_success`
   - Response to logout
   - No payload

4. `logout_error`
   - Response to logout when an error occurs
   - Payload: `{ message: string }`

## Role-Based Behavior

Users with specific roles have different behaviors in the duplicate login detection system:

1. **Regular users**:
   - Duplicate login detection is active
   - If a user logs in from a new device, all existing sessions will be notified

2. **Admin and Teacher roles**:
   - Duplicate login detection is disabled
   - Can be logged in from multiple devices simultaneously
   - Won't receive notifications about other sessions

To implement this, make sure to send the user's role when registering a session:

```typescript
// Example - getting user role from your auth system
const userRole = authService.getCurrentUserRole();

// Register session with role information
socket.emit('register_session', {
  userId: authService.getCurrentUserId(),
  fingerprint: fingerprint,
  role: userRole, // Can be a string or array of strings
  deviceInfo: deviceInfo
});
```

## Best Practices

1. Always initialize FingerprintJS before attempting to connect to the socket
2. Store the visitorId in a secure way (e.g., localStorage or sessionStorage)
3. Implement proper reconnection logic
4. Set reasonable timeouts and retry attempts
5. Show appropriate UI feedback for all socket events
6. Clear socket listeners on component unmount
7. Send device information to enhance security alerts
8. Implement a health check mechanism to ensure the socket is connected
9. Handle errors gracefully

## Example Implementation (React Component)

```tsx
import React, { useEffect, useState } from 'react';
import FingerprintJS from '@fingerprintjs/fingerprintjs';
import { io, Socket } from 'socket.io-client';

interface DuplicateLoginManagerProps {
  userId: string;
  userRole?: string | string[];
  onDuplicateLogin: (data: any) => void;
  onDisconnect: () => void;
}

const DuplicateLoginManager: React.FC<DuplicateLoginManagerProps> = ({ 
  userId, 
  userRole,
  onDuplicateLogin,
  onDisconnect 
}) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let fingerprint = '';
    let newSocket: Socket | null = null;

    const initialize = async () => {
      try {
        // Get fingerprint
        const fp = await FingerprintJS.load();
        const result = await fp.get();
        fingerprint = result.visitorId;

        // Get browser info
        const browserInfo = getBrowserInfo();

        // Initialize socket
        newSocket = io(process.env.REACT_APP_SOCKET_URL || 'http://localhost:10000', {
          withCredentials: true,
          reconnectionAttempts: 5,
          reconnectionDelay: 1000,
          timeout: 10000
        });

        // Debug browser detection only in development
        if (process.env.NODE_ENV === 'development') {
          newSocket.on('connect', () => {
            newSocket?.emit('debug_browser_detection', (result: any) => {
              console.log('Server browser detection:', result);
            });
          });
        }

        // Set up event listeners
        setupEventListeners(newSocket, fingerprint, browserInfo);
        setSocket(newSocket);
      } catch (error) {
        console.error('Failed to initialize duplicate login detection:', error);
        setError('Failed to initialize security monitoring');
      }
    };

    initialize();

    // Cleanup function
    return () => {
      if (newSocket) {
        newSocket.disconnect();
      }
    };
  }, [userId, userRole]);

  const getBrowserInfo = () => {
    const ua = navigator.userAgent;
    
    // Object to store detection results
    const browserInfo = {
      userAgent: ua,
      browser: 'Unknown',
      os: 'Unknown',
      device: 'Desktop'
    };
    
    // Browser detection first (order matters for some cases)
    if (/Edge\/|Edg\//.test(ua)) browserInfo.browser = 'Microsoft Edge';
    else if (/OPR\/|Opera\//.test(ua)) browserInfo.browser = 'Opera';
    else if (/Chrome\//.test(ua) && !/Chromium\//.test(ua)) browserInfo.browser = 'Chrome';
    else if (/Firefox\//.test(ua)) browserInfo.browser = 'Firefox';
    else if (/Safari\//.test(ua) && !/Chrome\//.test(ua) && !/Chromium\//.test(ua)) browserInfo.browser = 'Safari';
    else if (/MSIE|Trident\//.test(ua)) browserInfo.browser = 'Internet Explorer';
    else if (/Chromium\//.test(ua)) browserInfo.browser = 'Chromium';
    else if (/CocCoc\/|CocCocBrowser/.test(ua)) browserInfo.browser = 'CocCoc';
    // Mobile browsers
    else if (/UCBrowser\//.test(ua)) browserInfo.browser = 'UC Browser';
    else if (/SamsungBrowser\//.test(ua)) browserInfo.browser = 'Samsung Browser';
    else if (/YaBrowser\//.test(ua)) browserInfo.browser = 'Yandex Browser';
    else if (/FBIOS|FBAV|FBAN/.test(ua)) browserInfo.browser = 'Facebook App';
    else if (/Instagram/.test(ua)) browserInfo.browser = 'Instagram App';
    // Fallback for generic WebKit/Mozilla
    else if (/AppleWebKit/.test(ua)) browserInfo.browser = 'WebKit-based';
    else if (/Gecko\//.test(ua)) browserInfo.browser = 'Gecko-based';
    else if (/Mozilla\/5.0/.test(ua)) browserInfo.browser = 'Mozilla-based';
    
    // Operating System detection
    if (/Windows NT 11.0|Windows 11/.test(ua)) browserInfo.os = 'Windows 11';
    else if (/Windows NT 10.0|Windows 10/.test(ua)) browserInfo.os = 'Windows 10';
    else if (/Windows NT 6.3|Windows 8.1/.test(ua)) browserInfo.os = 'Windows 8.1';
    else if (/Windows NT 6.2|Windows 8/.test(ua)) browserInfo.os = 'Windows 8';
    else if (/Windows NT 6.1|Windows 7/.test(ua)) browserInfo.os = 'Windows 7';
    else if (/Windows NT 6.0|Windows Vista/.test(ua)) browserInfo.os = 'Windows Vista';
    else if (/Windows NT 5.1|Windows XP/.test(ua)) browserInfo.os = 'Windows XP';
    else if (/Windows/.test(ua)) browserInfo.os = 'Windows';
    // macOS with different version pattern matching
    else if (/Mac OS X/.test(ua)) {
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
      const versionMatch = ua.match(/Mac OS X (\d+[._]\d+)/) || 
                           ua.match(/Mac OS X (\d+)/) ||
                           ua.match(/Version\/[\d.]+.*Mac OS X (\d+[._]\d+)/);
      
      if (versionMatch && versionMatch[1]) {
        const vKey = versionMatch[1].replace('.', '_');
        macVersion = Object.keys(macOsVersions).includes(vKey) 
          ? ` ${macOsVersions[vKey]}` 
          : ` ${versionMatch[1].replace(/_/g, '.')}`;
      }
      
      browserInfo.os = `macOS${macVersion}`;
    }
    // Android with version extraction
    else if (/Android/.test(ua)) {
      const androidVersion = ua.match(/Android[\s/]?([0-9.]+)/i);
      browserInfo.os = androidVersion && androidVersion[1] ? `Android ${androidVersion[1]}` : 'Android';
    }
    // iOS with version extraction - multiple patterns
    else if (/iPhone|iPad|iPod/.test(ua)) {
      let iosVersion = '';
      
      // Try different patterns for iOS versions
      const versionMatch = ua.match(/OS ([\d_]+) like Mac OS X/) || 
                           ua.match(/iPhone OS ([\d_]+)/) ||
                           ua.match(/iOS ([\d.]+)/);
      
      if (versionMatch && versionMatch[1]) {
        iosVersion = ` ${versionMatch[1].replace(/_/g, '.')}`;
      }
      
      browserInfo.os = `iOS${iosVersion}`;
    }
    // Linux distros
    else if (/Ubuntu/.test(ua)) browserInfo.os = 'Ubuntu Linux';
    else if (/Fedora/.test(ua)) browserInfo.os = 'Fedora Linux';
    else if (/Debian/.test(ua)) browserInfo.os = 'Debian Linux';
    else if (/CentOS/.test(ua)) browserInfo.os = 'CentOS Linux';
    else if (/Linux/.test(ua)) browserInfo.os = 'Linux';
    // Other OS options
    else if (/CrOS/.test(ua)) browserInfo.os = 'Chrome OS';
    else if (/BlackBerry|BB10|RIM Tablet OS/.test(ua)) browserInfo.os = 'BlackBerry';
    
    // Device type detection - should happen after OS detection in some cases
    if (/iPhone|iPod/.test(ua) || /Android.*Mobile/.test(ua) || /Mobile/.test(ua) || /Windows Phone/.test(ua)) {
      browserInfo.device = 'Mobile';
    } else if (/iPad/.test(ua) || /Android/.test(ua) && !/Mobile/.test(ua) || /Tablet/.test(ua)) {
      browserInfo.device = 'Tablet';
    } else if (/TV|SmartTV|HbbTV/.test(ua)) {
      browserInfo.device = 'Smart TV';
    } else if (/Console|PlayStation|Xbox|Nintendo/.test(ua)) {
      browserInfo.device = 'Game Console';
    }
    
    return browserInfo;
  };

  const setupEventListeners = (socket: Socket, fingerprint: string, browserInfo: any) => {
    socket.on('connect', () => {
      setIsConnected(true);
      setError(null);
      
      // Register session
      socket.emit('register_session', {
        userId,
        fingerprint,
        role: userRole, // Include user role
        deviceInfo: browserInfo
      });

      // Set up health check interval
      const healthCheckInterval = setInterval(() => {
        socket.emit('health_check', (response: any) => {
          // Only log health issues
          if (response.status !== 'healthy') {
            console.error('Socket health check failed:', response);
          }
        });
      }, 60000); // Every minute

      socket.on('disconnect', () => {
        setIsConnected(false);
        onDisconnect();
        clearInterval(healthCheckInterval);
      });
    });

    socket.on('duplicate_login_detected', (data) => {
      // Critical security log
      console.warn('Duplicate login detected:', data);
      onDuplicateLogin(data);
    });

    socket.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
      setError(`Connection error: ${error.message}`);
      setIsConnected(false);
    });

    socket.on('session_registered', (response) => {
      if (!response.success) {
        console.error('Session registration failed:', response.message);
        setError('Failed to register security session');
      }
    });
  };

  const handleLogout = () => {
    if (socket && isConnected) {
      socket.emit('logout', { userId });
    }
  };

  // This component doesn't render anything visible
  return null;
};

export default DuplicateLoginManager;

// Usage example:
/*
function App() {
  const userId = "user-123"; // Get this from your auth context/state
  const userRole = "admin"; // or "teacher", "student", etc.

  const handleDuplicateLogin = (data) => {
    alert(`Security Alert: Your account was accessed from another device: ${data.deviceInfo}`);
  };

  const handleDisconnect = () => {
    // Show reconnection UI or trigger a reconnect
    console.log("Socket disconnected");
  };

  return (
    <div className="App">
      {/* Your app content *//*}
      <DuplicateLoginManager
        userId={userId}
        userRole={userRole}
        onDuplicateLogin={handleDuplicateLogin}
        onDisconnect={handleDisconnect}
      />
    </div>
  );
}
*/
```

## Security Considerations

1. The fingerprint is used only for session management and is not used for authentication
2. All socket communications are protected by CORS and credentials
3. The system maintains a list of active sessions per user
4. Users are notified immediately when a duplicate login is detected
5. The system handles disconnections and reconnections gracefully
6. Device information is collected to provide more context about duplicate logins
7. Admin and teacher roles are exempt from duplicate login restrictions for convenience

## Debugging and Monitoring

The backend system includes extensive logging for debugging and monitoring:

1. All socket connections, disconnections, and errors are logged
2. Login attempts, session registrations, and duplicate login detections are logged with timestamps
3. Periodic logging of active sessions and connections
4. Health check endpoint to verify connection status

## General Troubleshooting

1. If socket connection fails:
   - Check if the backend URL is correct
   - Verify CORS settings (check if your domain is in the allowed origins list)
   - Check if credentials are being sent properly
   - Verify network connectivity and firewall settings

2. If duplicate login detection is not working:
   - Verify that FingerprintJS is generating consistent IDs (check browser console)
   - Test with different browsers or incognito windows to verify duplicates are detected
   - Check server logs for any errors in the duplicate login service
   - Ensure userId values are consistent between sessions
   - Make sure user role is correctly passed (admin/teacher roles won't trigger duplicate login alerts)

3. If logout is not working:
   - Check if the socket is still connected (isConnected state)
   - Verify that the user ID is being passed correctly
   - Check the browser console for any errors
   - Check server logs for logout failures

4. Check server logs:
   - The server provides detailed logs for all socket events
   - Look for errors in session registration or handling
   - Monitor session status reports for anomalies 