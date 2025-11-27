# Mmiri-Anyi

Mmiri-Anyi is a community-driven civic issues reporting platform built with Next.js. The application connects citizens with local authorities, enabling people to detect, report, and resolve everyday problems in their communities including water issues, road potholes, street lighting, and waste management.

## 🏘️ Features

- **Issue Reporting** - Report various civic problems including water issues, road damage, lighting problems, and waste management
- **Community Engagement** - Connect citizens with local authorities for faster issue resolution
- **Issue Tracking** - Monitor the status and progress of reported issues
- **Multi-category Support** - Handle diverse civic problems from infrastructure to utilities
- **Location-based Reporting** - GPS-enabled issue reporting for precise problem identification
- **Dashboard & Analytics** - Track community issues and resolution patterns
- **Mobile Responsive** - Report and track issues from any device

## 🏗️ Architecture

**Frontend**: Next.js with React 19 and Tailwind CSS
**Backend**: Next.js API Routes
**Styling**: Tailwind CSS v4
**Fonts**: Geist Sans and Geist Mono

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm, yarn, pnpm, or bun

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd communifi
```

2. Install dependencies:
```bash
npm install
# or
yarn install
# or
pnpm install
```

3. Start the development server:
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## 📁 Project Structure

```
communifi/
├── app/                    # Next.js App Router
│   ├── api/               # API routes (backend)
│   ├── components/        # Reusable UI components
│   ├── dashboard/         # Dashboard pages
│   ├── monitoring/        # Water monitoring pages
│   ├── analytics/         # Analytics and reports
│   ├── globals.css        # Global styles
│   ├── layout.js          # Root layout
│   └── page.js            # Home page
├── public/                # Static assets
├── lib/                   # Utility functions and configurations
└── README.md
```

## 🔧 API Endpoints

The backend API is built using Next.js API Routes and provides the following endpoints:

- `GET /api/issues` - Retrieve reported civic issues
- `POST /api/issues` - Submit new issue reports
- `GET /api/categories` - Get issue categories (water, roads, lighting, waste, etc.)
- `GET /api/status` - Check issue resolution status
- `POST /api/status` - Update issue status
- `GET /api/locations` - List all reporting locations
- `POST /api/locations` - Add new reporting location

## 🎨 Styling

This project uses Tailwind CSS v4 for styling with a custom design system:

- **Colors**: Custom color palette optimized for civic engagement UI
- **Typography**: Geist font family for modern, clean text
- **Components**: Responsive design components for issue reporting and tracking
- **Dark Mode**: Built-in dark mode support

## 📊 Data Visualization

Mmiri-Anyi includes interactive charts and graphs for:
- Issue reporting trends over time
- Category-wise problem analysis
- Resolution time tracking
- Community engagement metrics
- Geographic distribution of issues

## 🔒 Security

- Input validation and sanitization
- Rate limiting on API endpoints
- Secure data transmission
- Environment variable configuration for sensitive data

## 🚀 Deployment

### Vercel (Recommended)

The easiest way to deploy Mmiri-Anyi is using the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme):

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Configure environment variables
4. Deploy with automatic CI/CD

### Other Platforms

Mmiri-Anyi can be deployed on any platform that supports Next.js:
- Netlify
- AWS Amplify
- Railway
- DigitalOcean App Platform

Refer to the [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for detailed instructions.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions:
- Create an issue in the GitHub repository
- Check the documentation
- Contact the development team

## 🔗 Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [React Documentation](https://react.dev)
- [Civic Engagement Best Practices](https://www.govtech.com)
- [Community Reporting Guidelines](https://www.icma.org)
