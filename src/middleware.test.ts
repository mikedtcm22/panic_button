/**
 * @jest-environment node
 */

const mockAuthMiddleware = jest.fn((config) => config);

jest.mock('@clerk/nextjs', () => ({
  authMiddleware: mockAuthMiddleware,
}));

describe('Authentication Middleware', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.resetModules();
  });

  it('should export configured authMiddleware', () => {
    const middleware = require('./middleware').default;
    
    expect(mockAuthMiddleware).toHaveBeenCalled();
  });

  it('should configure public routes', () => {
    require('./middleware');
    
    const config = mockAuthMiddleware.mock.calls[0][0];
    expect(config.publicRoutes).toContain('/');
    expect(config.publicRoutes).toContain('/sign-in');
    expect(config.publicRoutes).toContain('/sign-up');
  });

  it('should configure afterAuth handler', () => {
    require('./middleware');
    
    const config = mockAuthMiddleware.mock.calls[0][0];
    expect(config.afterAuth).toBeDefined();
    expect(typeof config.afterAuth).toBe('function');
  });

  it('should handle unauthenticated access to protected routes', () => {
    require('./middleware');
    
    const config = mockAuthMiddleware.mock.calls[0][0];
    const mockReq = { 
      url: 'http://localhost:3000/dashboard',
      nextUrl: { pathname: '/dashboard' }
    };
    
    const mockRedirect = jest.fn();
    const Response = {
      redirect: mockRedirect
    };
    
    global.Response = Response as any;
    
    config.afterAuth(
      { userId: null, isPublicRoute: false },
      mockReq
    );
    
    expect(mockRedirect).toHaveBeenCalled();
  });
});