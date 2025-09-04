import { useEffect, useState } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import type { User } from "firebase/auth";   // ✅ type import only
import { auth } from "./lib/firebase";

import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import Dashboard from "./pages/Dashboard";

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center text-xl">
        Loading...
      </div>
    );
  }

  if (user) {
    return (
      <Dashboard
        user={user}
        onLogout={() => {
          signOut(auth);
        }}
      />
    );
  }

  return isSignUp ? (
    <SignUp onSwitchToSignIn={() => setIsSignUp(false)} />
  ) : (
    <SignIn onSwitchToSignUp={() => setIsSignUp(true)} />
  );
}
