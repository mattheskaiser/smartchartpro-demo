/**
 * Demo Mode Configuration
 *
 * This file controls the demo mode behavior for the portfolio version.
 * When DEMO_MODE is true, the app uses mock data instead of a real database.
 * 
 * MAINTENANCE_MODE can be enabled to switch to demo mode temporarily.
 */

export const MAINTENANCE_MODE = process.env.NEXT_PUBLIC_MAINTENANCE_MODE === 'true';
export const DEMO_MODE = process.env.NEXT_PUBLIC_DEMO_MODE === 'true' || MAINTENANCE_MODE;

export const DEMO_CONFIG = {
  // Demo mode enabled (either explicitly or via maintenance mode)
  enabled: DEMO_MODE,

  // Maintenance mode enabled
  maintenanceMode: MAINTENANCE_MODE,

  // Show demo banner
  showBanner: true,

  // Demo accounts
  accounts: {
    admin: {
      email: 'admin@demo.com',
      password: 'any password works',
      role: 'ADMIN',
    },
    cna: {
      email: 'cna@demo.com',
      password: 'any password works',
      role: 'CNA',
    },
  },

  // Features to disable in demo mode
  disabledFeatures: {
    emailSending: true,
    fileUploads: true,
    externalAPIs: true,
  },

  // Toast messages
  messages: {
    demoModeActive: 'Demo Mode: Changes are not saved',
    loginSuccess: 'Demo login successful',
    actionNotPersisted: "Your changes weren't saved. This is a demo and changes aren't persistent.",
  },
};

// Helper to check if we're in demo mode
export const isDemoMode = () => DEMO_CONFIG.enabled;

// Helper to check if we're in maintenance mode
export const isMaintenanceMode = () => DEMO_CONFIG.maintenanceMode;

// Helper to get demo message
export const getDemoMessage = (key: keyof typeof DEMO_CONFIG.messages) => DEMO_CONFIG.messages[key];
