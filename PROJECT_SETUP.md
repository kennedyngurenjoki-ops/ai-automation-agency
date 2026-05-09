# AI Automation Agency - Client Onboarding

A polished React landing page and client onboarding tool for AI Automation Agency services.

## 🚀 Features

### Landing Page
- Modern, responsive design with gradient backgrounds
- Animated components using Framer Motion
- Clear value proposition and call-to-action
- Features grid showcasing automation benefits
- Benefits section with pricing information

### Client Onboarding Form
- **4-Step Multi-Step Form:**
  1. **Company Information** - Basic company details and industry
  2. **Contact Details** - Primary contact information
  3. **Business Needs** - Current challenges, goals, budget, timeline
  4. **Current Setup** - Existing tools and integration needs

- **Features:**
  - Progress indicator with visual step completion
  - Form validation and required field handling
  - Checkbox arrays for multiple selections
  - Smooth animations between steps
  - Professional glassmorphism design
  - Responsive layout for all devices

## 🛠️ Technology Stack

- **React 18** - Latest React version with hooks
- **React Router DOM** - Client-side routing
- **Framer Motion** - Smooth animations and transitions
- **Heroicons** - Beautiful SVG icons
- **Tailwind CSS** - Utility-first CSS framework
- **Vite** - Fast build tool and dev server

## 📦 Installation

1. Clone the repository:
```bash
git clone https://github.com/kennedyngurenjoki-ops/ai-automation-agency.git
cd ai-automation-agency
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:3000`

## 🏗️ Project Structure

```
src/
├── components/
│   ├── HomePage.jsx          # Landing page component
│   └── ClientOnboarding.jsx  # Multi-step onboarding form
├── App.jsx                   # Main app component with routing
├── main.jsx                  # React entry point
└── index.css                 # Global styles and Tailwind imports
```

## 🎨 Design Features

- **Glassmorphism UI** - Translucent glass-like elements with backdrop blur
- **Gradient Backgrounds** - Beautiful color gradients throughout
- **Smooth Animations** - Page transitions and micro-interactions
- **Responsive Design** - Works perfectly on desktop, tablet, and mobile
- **Professional Typography** - Inter font for clean, modern look

## 📋 Form Data Structure

The onboarding form collects comprehensive client information:

```javascript
{
  // Company Info
  companyName: string,
  industry: string,
  companySize: string,
  website: string,
  
  // Contact Info
  name: string,
  email: string,
  phone: string,
  role: string,
  
  // Business Needs
  currentChallenges: array,
  automationGoals: array,
  timeSpentOnTasks: string,
  budget: string,
  timeline: string,
  
  // Current Tools
  currentTools: array,
  integrationNeeds: array,
  additionalInfo: string
}
```

## 🚀 Deployment

### Build for production:
```bash
npm run build
```

### Preview production build:
```bash
npm run preview
```

### Deploy to various platforms:
- **Vercel**: Connect your GitHub repo to Vercel for automatic deployments
- **Netlify**: Drag and drop the `dist` folder or connect via GitHub
- **GitHub Pages**: Use GitHub Actions for automated deployment

## 🔧 Customization

### Styling
- Edit `tailwind.config.js` to customize colors, fonts, and spacing
- Modify `src/index.css` for global styles
- Component-specific styles are handled with Tailwind classes

### Content
- Update company branding in `HomePage.jsx` and `ClientOnboarding.jsx`
- Modify form fields and options in `ClientOnboarding.jsx`
- Customize features, benefits, and pricing in `HomePage.jsx`

### Form Handling
- Add API integration in the `handleSubmit` function
- Implement form validation with libraries like Formik or React Hook Form
- Add email notifications or CRM integration

## 📱 Mobile Responsiveness

- Fully responsive design works on all screen sizes
- Touch-friendly form inputs and buttons
- Optimized layout for mobile devices
- Progressive disclosure of information

## 🎯 Conversion Optimization

- Clear value propositions throughout
- Multiple calls-to-action
- Social proof elements
- Professional design builds trust
- Streamlined onboarding process

## 📈 Analytics Integration

To add analytics tracking:

1. Install analytics package (Google Analytics, Mixpanel, etc.)
2. Add tracking events to form steps
3. Monitor conversion rates and drop-off points
4. A/B test different form layouts and copy

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details

---

**Ready to automate your business?** This professional onboarding system will help you capture high-quality leads and convert them into paying clients for your automation agency.
