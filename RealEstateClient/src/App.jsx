// This is the main or "root" component of our application.
// Think of it like the MainActivity in an Android app.

import './App.css';
import Dashboard from './pages/Dashboard';

function App() {
  return (
    <div className="app-container">
      <header className="app-header">
        <h1>נדל"ן ישראל - דשבורד חכם</h1>
      </header>
      
      <main className="app-main">
        {/* We inject the Dashboard component here! */}
        <Dashboard />
      </main>
    </div>
  );
}

// Exporting allows this component to be used by the main.jsx file
export default App;