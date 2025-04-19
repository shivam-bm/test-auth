# OIDC Provider Application

This application serves as an OpenID Connect (OIDC) provider using the Next.js framework and the Better Auth library. It provides a robust authentication system with OAuth 2.0 and OpenID Connect support.

## Features

- **OpenID Connect Provider**: Full implementation of OIDC standards
- **Email & Password Authentication**: Built-in support for traditional authentication
- **Consent Flows**: User-friendly consent screens for OAuth authorization
- **PostgreSQL Database**: Persistent storage for users, sessions, and OAuth clients
- **Security Enhancements**: CORS protection, rate limiting, and secure defaults

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- PostgreSQL database
- Docker (optional, for local development)

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Copy environment variables:
   ```bash
   cp .env.example .env
   ```
4. Update the `.env` file with your configuration
5. Start the PostgreSQL database:
   ```bash
   npm run docker:up
   ```
6. Run database migrations:
   ```bash
   npm run db:migrate
   ```
7. Start the development server:
   ```bash
   npm run dev
   ```

## Production Deployment

### Environment Configuration

For production deployments, make sure to:

1. Set `NODE_ENV=production` in your environment
2. Generate a strong random string for `BETTER_AUTH_SECRET`
3. Set `NEXT_PUBLIC_APP_URL` to your production domain
4. Configure `TRUSTED_ORIGINS` with your client application domains
5. Set up a secure PostgreSQL database and update connection details
6. Disable dynamic client registration by setting `OAUTH_ALLOW_DYNAMIC_REGISTRATION=false`

### Security Considerations

- Use HTTPS in production
- Set up proper Content Security Policy (CSP) headers
- Enable database encryption for sensitive data
- Implement proper logging and monitoring
- Consider using a dedicated secret management solution

### Deployment Options

#### Docker Deployment

1. Build the Docker image:
   ```bash
   docker build -t oidc-provider .
   ```

2. Run the container:
   ```bash
   docker run -p 3000:3000 --env-file .env.production oidc-provider
   ```

#### Cloud Providers

This application can be deployed to:

- **Vercel**: Suitable for serverless deployment
- **AWS**: Using EC2, ECS, or EKS
- **Google Cloud**: Using Cloud Run or GKE
- **Azure**: Using App Service or AKS

## Managing OAuth Clients

OAuth clients can be managed through:

1. The Better Auth admin UI
2. Direct database management
3. API endpoints (for admin users)

## Rate Limiting

The application includes basic rate limiting to protect against abuse:

- 50 requests per minute for authentication endpoints
- Configurable via environment variables
- For production, consider using Redis for distributed rate limiting

## Monitoring and Logging

In production:

1. Set up centralized logging (e.g., ELK stack, Datadog)
2. Monitor authentication events for security anomalies
3. Set up alerts for unusual activities
4. Implement audit logging for compliance requirements

## Contributing

Contributions are welcome! Please follow the standard pull request process.

## License

[MIT](LICENSE)
