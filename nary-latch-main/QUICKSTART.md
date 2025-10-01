# Quick Start Guide - N-ary Tree Locking Visualization

## 🚀 Run the Web Application

### Prerequisites
- Node.js 16+ installed ([Download here](https://nodejs.org/))

### Steps

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Start Development Server**
   ```bash
   npm run dev
   ```

3. **Open in Browser**
   - The app will automatically open at `http://localhost:5173`
   - Or manually visit: http://localhost:5173

### Build for Production

```bash
npm run build
npm run preview
```

## 📱 Features

This web application showcases:
- ✅ **10/10 Test Suites Passing** (updated!)
- ✅ O(N) to O(log N) optimization visualization
- ✅ Thread-safe locking features
- ✅ Performance comparison charts
- ✅ Technical implementation details

## 🌐 Live Demo

The project is also available on Lovable:
**URL**: https://lovable.dev/projects/7ce55e1e-c46c-4d14-84b2-80aae7bae6df

## 📁 Project Structure

```
nary-latch-main/
├── src/
│   ├── pages/
│   │   └── Index.tsx          # Main landing page
│   ├── components/ui/          # Shadcn UI components
│   ├── assets/                 # Images and static files
│   └── main.tsx               # Entry point
├── public/                     # Public assets
└── package.json               # Dependencies
```

## 🎨 Technologies Used

- **React 18** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **shadcn/ui** - Component library
- **Lucide React** - Icons

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 📝 Notes

- The web app is a **portfolio showcase** of the C++ implementation
- For the actual C++ algorithm, see the parent directory
- All test results have been updated to reflect 10/10 passing tests
