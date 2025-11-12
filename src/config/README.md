# API Configuration

This directory contains centralized configuration for API endpoints and related utilities.

## Files

- `api.ts` - Main API configuration with endpoints and helper functions

## Usage

### Basic Configuration

The API configuration is centralized in `src/config/api.ts` and provides:

- Centralized endpoint definitions
- Environment variable support
- Helper functions for building URLs

### Environment Variables

You can configure the API base URL using environment variables:

```bash
# .env.local or .env
VITE_API_BASE_URL=https://your-api-domain.com
```

### Using the Configuration

```typescript
import { 
  getAuthEndpoint, 
  getUserEndpoint, 
  getTwoFAEndpoint, 
  getNotificationEndpoint, 
  getPartnerBalanceEndpoint, 
  buildApiUrl 
} from '@/config/api'

// Get a specific auth endpoint
const otpEndpoint = getAuthEndpoint('VERIFY_OTP')
const signInEndpoint = getAuthEndpoint('SIGN_IN')

// Get user endpoints
const usersListEndpoint = getUserEndpoint('LIST')
const deleteUserEndpoint = getUserEndpoint('DELETE', 'user-id-123')

// Get two-factor authentication endpoints
const twoFAInitiateEndpoint = getTwoFAEndpoint('INITIATE')

// Get notification endpoints
const sendNotificationEndpoint = getNotificationEndpoint('SEND')

// Get partner balance endpoints
const partnerBalanceEndpoint = getPartnerBalanceEndpoint('GET')

// Build a custom URL
const customUrl = buildApiUrl('/api/custom/endpoint')
```

### Available Endpoints

#### Auth Endpoints
- `VERIFY_OTP` - Two-factor authentication verification
- `SIGN_IN` - User sign in
- `SIGN_UP` - User registration
- `FORGOT_PASSWORD` - Password reset request
- `RESET_PASSWORD` - Password reset completion

#### User Endpoints
- `PROFILE` - Get user profile
- `UPDATE_PROFILE` - Update user profile
- `LIST` - Get list of users
- `DELETE` - Delete a specific user (requires user ID)

#### Two-Factor Authentication
- `INITIATE` - Start 2FA setup process
- `COMPLETE` - Complete 2FA setup
- `DEACTIVATE` - Disable 2FA

#### Notifications
- `SEND` - Send notification

#### Partner Balance
- `GET` - Get partner balance information

## Benefits

1. **Centralized Management** - All API endpoints in one place
2. **Environment Flexibility** - Easy to switch between dev/staging/prod
3. **Type Safety** - TypeScript support for endpoint keys
4. **Maintainability** - Single source of truth for API configuration
5. **Security** - No hardcoded URLs in components

## Adding New Endpoints

To add a new endpoint:

1. Add it to the appropriate section in `API_CONFIG`
2. Use the helper functions in your components
3. Update this documentation if needed
