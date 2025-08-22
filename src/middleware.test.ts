/**
 * @jest-environment node
 */

const mockClerkMiddleware = jest.fn((handler) => handler);
const mockCreateRouteMatcher = jest.fn((routes) => {
  return (req: any) => {
    const pathname = req.nextUrl?.pathname || req.url;
    return routes.some((route: string) => {
      const pattern = route.replace('(.*)', '.*');
      const regex = new RegExp(`^${pattern}$`);
      return regex.test(pathname);
    });
  };
});

jest.mock('@clerk/nextjs/server', () => ({
  clerkMiddleware: mockClerkMiddleware,
  createRouteMatcher: mockCreateRouteMatcher,
}));

jest.mock('next/server', () => ({
  NextResponse: {
    next: jest.fn(() => 'next-response'),
    redirect: jest.fn((url) => ({ url, status: 307 })),
  },
}));

describe('Authentication Middleware', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.resetModules();
  });

  it('should export configured clerkMiddleware', () => {
    const middleware = require('./middleware').default;

    expect(mockClerkMiddleware).toHaveBeenCalled();
  });

  it('should create route matcher for public routes', () => {
    require('./middleware');

    expect(mockCreateRouteMatcher).toHaveBeenCalledWith(['/', '/sign-in(.*)', '/sign-up(.*)']);
  });

  it('should handle authenticated requests', async () => {
    const { NextResponse } = require('next/server');
    const middleware = require('./middleware').default;

    const mockAuth = jest.fn().mockResolvedValue({ userId: 'user-123' });
    const mockReq = {
      url: 'http://localhost:3000/dashboard',
      nextUrl: { pathname: '/dashboard' },
    };

    const handler = mockClerkMiddleware.mock.calls[0][0];
    const result = await handler(mockAuth, mockReq);

    expect(NextResponse.next).toHaveBeenCalled();
  });

  it('should redirect unauthenticated users to sign-in', async () => {
    const { NextResponse } = require('next/server');
    const middleware = require('./middleware').default;

    const mockAuth = jest.fn().mockResolvedValue({ userId: null });
    const mockReq = {
      url: 'http://localhost:3000/dashboard',
      nextUrl: { pathname: '/dashboard' },
    };

    const handler = mockClerkMiddleware.mock.calls[0][0];
    const result = await handler(mockAuth, mockReq);

    expect(NextResponse.redirect).toHaveBeenCalled();
  });
});
