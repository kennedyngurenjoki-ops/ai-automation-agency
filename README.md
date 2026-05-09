# AI Automation Agency - Client Onboarding

A modern, responsive React application for AI automation agency services featuring a polished landing page and comprehensive client onboarding form.

## Features

### 🎨 Modern Design
- Gradient backgrounds and glass morphism effects
- Responsive design for all devices
- Smooth animations with Framer Motion
- Beautiful UI components with Tailwind CSS

### 📋 Multi-Step Onboarding
- **Step 1: Company Information** - Basic company details and industry
- **Step 2: Contact Details** - Contact person information
- **Step 3: Business Needs** - Challenges, goals, and budget assessment
- **Step 4: Current Setup** - Existing tools and integration needs

### ⚡ Key Components
- Progress indicator with visual feedback
- Form validation and state management
- Interactive checkboxes for multi-select options
- Professional styling with hero icons

## Technologies Used

- **React 18** - Latest React with hooks
- **React Router DOM** - Client-side routing
- **Framer Motion** - Smooth animations and transitions
- **Tailwind CSS** - Utility-first CSS framework
- **Heroicons** - Beautiful SVG icons
- **Responsive Design** - Mobile-first approach

## Installation

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
npm start
```

4. Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

## Project Structure

```
src/
├── components/
│   └── ClientOnboarding.jsx    # Main onboarding component
├── index.js                    # Entry point
└── App.js                      # Main app component
```

## Component Features

### ClientOnboarding Component

The main onboarding component includes:

- **Multi-step form navigation**
- **State management** for form data
- **Conditional rendering** for each step
- **Array handling** for checkbox selections
- **Responsive grid layouts**
- **Form validation** (basic)

#### Form Data Structure:
```javascript
{
  // Company Info
  companyName: '',
  industry: '',
  companySize: '',
  website: '',

  // Contact Info
  name: '',
  email: '',
  phone: '',
  role: '',

  // Business Needs
  currentChallenges: [],
  automationGoals: [],
  timeSpentOnTasks: '',
  budget: '',
  timeline: '',

  // Current Tools
  currentTools: [],
  integrationNeeds: [],
  additionalInfo: ''
}
```

## Customization

### Styling
- Modify Tailwind classes in the component
- Update color scheme in the gradient backgrounds
- Customize the glass morphism effects

### Form Options
- Update industry options in the `industries` array
- Modify company sizes in the `companySizes` array
- Add or remove challenge/goal options
- Update tool integration options

### Functionality
- Add form validation with libraries like Formik or react-hook-form
- Integrate with backend APIs for form submission
- Add email notifications
- Implement progress saving

## Deployment

### Build for production:
```bash
npm run build
```

### Deploy to platforms like:
- Netlify
- Vercel
- GitHub Pages
- AWS S3 + CloudFront

## Future Enhancements

- [ ] Form validation with error messages
- [ ] Progress saving to localStorage
- [ ] Email integration for notifications
- [ ] Analytics tracking
- [ ] A/B testing capabilities
- [ ] Multi-language support
- [ ] Dark/light theme toggle
- [ ] Integration with CRM systems

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Contact

For questions or support, please reach out to our team.

---

Built with ❤️ for businesses looking to automate and scale their operations.
