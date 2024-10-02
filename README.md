![Personal Website Banner](./assets/image.png)

# Personal Website Portfolio

This is a customizable personal website portfolio built with Next.js, React, and Tailwind CSS. It features a clean, modern design with easy customization options, GitHub information retrieval, and Markdown-based blog rendering.

## Description

This personal website portfolio allows you to showcase your professional information, GitHub stats, and blog posts in a sleek, responsive design. It's built with modern web technologies and offers easy customization through configuration files.

## Features

- 🎨 Easy theme customization
- 📊 GitHub stats integration
- 📝 Markdown-based blog
- 🚀 Built with Next.js and React
- 🎭 Dark mode support
- 📱 Responsive design

## Configuration

### Site Configuration

To customize the site's basic information and links, edit the `config/site.ts` file:

```typescript
export const siteConfig = {
  name: 'Your Name',
  description: 'Your description',
  links: {
    github: 'https://github.com/yourusername',
    linkedin: 'https://www.linkedin.com/in/yourusername',
    // Add or remove social links as needed
  },
  // Other configurations...
}
```

### Description

To update the main description on the home page, edit the `config/description.md` file. This file supports Markdown formatting.

### Theme Customization

You can easily change the color scheme by modifying the `colors` object in `config/site.ts`:

```typescript
colors: {
  dark: '#9366FF',
  light: '#7C3AED',
},
```

### Blog Posts

To add or edit blog posts, simply add or modify Markdown files in the `public/blog` directory. The file name will be used as the URL slug, and you can add a date in the frontmatter:

```markdown
---
Date: 2023-04-01
---

# Your Blog Post Title

Your content here...
```

## Getting Started

1. Clone the repository
2. Install dependencies: `npm install`
3. Run the development server: `npm run dev`
4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Deployment

This project can be easily deployed to platforms like Vercel or Netlify. Refer to their respective documentation for detailed deployment instructions.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
