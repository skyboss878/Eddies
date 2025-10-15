// Add this after the loading state declaration:
const [initialized, setInitialized] = useState(false);

// Add this to the useEffect:
useEffect(() => {
  const token = localStorage.getItem("token");
  const savedUser = localStorage.getItem("user");
  if (token && savedUser && !user) {
    try {
      setUser(JSON.parse(savedUser));
    } catch (error) {
      console.error("Error parsing saved user:", error);
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    }
  }
  setInitialized(true); // Add this line
}, []);

// Add initialized to the value object:
const value = {
  user,
  loading,
  error,
  login,
  register,
  logout,
  isAuthenticated,
  setError,
  initialized, // Add this line
};
