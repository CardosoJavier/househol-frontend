import { isSuccessfulSignInResponse } from './isSuccessfulSignInResponse';
import { SuccessfulSignInResponse } from '../../models';

describe('isSuccessfulSignInResponse', () => {
  const mockValidResponse: SuccessfulSignInResponse = {
    user: {
      id: 'user123',
      email: 'test@example.com',
      app_metadata: {},
      user_metadata: {},
      aud: 'authenticated',
      created_at: '2024-01-15T00:00:00Z'
    },
    session: {
      access_token: 'valid_token',
      refresh_token: 'refresh_token',
      expires_in: 3600,
      token_type: 'bearer',
      user: {
        id: 'user123',
        email: 'test@example.com',
        app_metadata: {},
        user_metadata: {},
        aud: 'authenticated',
        created_at: '2024-01-15T00:00:00Z'
      }
    }
  };

  it('should return true for valid sign-in response', () => {
    expect(isSuccessfulSignInResponse(mockValidResponse)).toBe(true);
  });

  it('should return false for null', () => {
    expect(isSuccessfulSignInResponse(null)).toBe(false);
  });

  it('should return false for undefined', () => {
    expect(isSuccessfulSignInResponse(undefined)).toBe(false);
  });

  it('should return false for non-object values', () => {
    expect(isSuccessfulSignInResponse('string')).toBe(false);
    expect(isSuccessfulSignInResponse(123)).toBe(false);
    expect(isSuccessfulSignInResponse(true)).toBe(false);
    expect(isSuccessfulSignInResponse([])).toBe(false);
  });

  it('should return false for object missing user property', () => {
    const invalidResponse = {
      session: mockValidResponse.session
    };
    expect(isSuccessfulSignInResponse(invalidResponse)).toBe(false);
  });

  it('should return false for object missing session property', () => {
    const invalidResponse = {
      user: mockValidResponse.user
    };
    expect(isSuccessfulSignInResponse(invalidResponse)).toBe(false);
  });

  it('should return true for object with additional properties', () => {
    const responseWithExtra = {
      ...mockValidResponse,
      extraProperty: 'extra'
    };
    expect(isSuccessfulSignInResponse(responseWithExtra)).toBe(true);
  });

  it('should return true for minimal valid response', () => {
    const minimalResponse = {
      user: {},
      session: {}
    };
    expect(isSuccessfulSignInResponse(minimalResponse)).toBe(true);
  });
});