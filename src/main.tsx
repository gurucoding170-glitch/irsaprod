import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// ✅ Global error logging (will log to Android's logcat & also show alert)
window.addEventListener('error', (event) => {
  console.log('❌ Global JS Error:', event.error || event.message);
  alert('Error: ' + (event.error?.message || event.message));
});

window.addEventListener('unhandledrejection', (event) => {
  console.log('❌ Unhandled Promise Rejection:', event.reason);
  alert('Promise Error: ' + (event.reason?.message || event.reason));
});

// ✅ Mount React app
createRoot(document.getElementById("root")!).render(<App />);