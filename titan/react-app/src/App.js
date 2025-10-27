import { useEffect, useState } from 'react';
import { DarkModeToggle } from './components/DarkModeToggle';
import { Header } from './components/Header';
import { UserActions } from './components/userActions';
import { Display } from './components/display';
import './App.css';

function App() {
  const [data, setData] = useState(null);
  const [headerMessage, setHeaderMessage] = useState("Loading...");
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('darkMode');
    return saved === 'true';
  });

  useEffect(() => {
    getData(); 
  }, []);

  const toggleDarkMode = () => {
    setDarkMode(prev => {
      const newValue = !prev;
      localStorage.setItem('darkMode', newValue);
      return newValue;
    });
  };

  const getData = async () => {
    try {
      const response = await fetch('/api/images/next');
      const data = await response.json();
      
      if (data && data.url) {
        setData(data);
      } else {
        setHeaderMessage("All images have been reviewed");
        setData(null);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      setHeaderMessage("Error loading data");
      setData(null);
    }
  };

  return (
    <div 
      className={`App ${ darkMode ? 'dark-mode' : '' }`}
      aria-label="Image labeling application based on ML suggestions"
    >
      <DarkModeToggle 
        darkMode={ darkMode } 
        onToggle={ toggleDarkMode } 
        aria-label="Toggle dark mode"
      />
      <main>
        <Header 
          data={ data } 
          message={ headerMessage } 
          aria-label="Header displaying ML suggestion and confidence score"
        />
        { data ? (
          <>
            <Display 
              photoUrl={ data.url } 
              label={ data.suggested_label } 
              aria-label="Image to be labeled"
            />
            <UserActions 
              data={ data } 
              onRefresh={ getData } 
              aria-label="User actions for labeling the image"
            />
          </>
        ) : ( 
          <p 
            role="status" 
            aria-label="No data available">
            No data available
          </p>
        )}
      </main>
    </div>
  );
}

export default App;
