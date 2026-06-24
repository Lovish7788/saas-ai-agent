"use client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input" // Corrected import
import { useState } from "react"
import { authClient } from "@/lib/auth-client";

export default function Home() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false); // Add a loading state
  const [login, setLogin] = useState("");

  const onSubmit = async () => {
    // 1. Basic validation
    if (!email.includes("@")) {
      window.alert("Please enter a valid email address");
      return;
    }

    setLoading(true);

    if (login) {

      await authClient.signIn.email({
        email, password,
      }, {
        onSuccess: () => {
          window.alert("Login success");
          setLoading(false);
        },
        onError: (ctx) => {
          window.alert(ctx.error.message);
          setLoading(false);
        }
      })
    }

    else {
      await authClient.signUp.email({
        email,
        name,
        password,
      }, {
        onError: (ctx) => {
          window.alert(ctx.error.message); // Show the real error from the server
          setLoading(false);
        },
        onSuccess: () => {
          window.alert("Success! Account created.");
          setLoading(false);
        }
      });
    }


  }
  const { data: session } = authClient.useSession();

  if (session) {
    return (
      <div className="flex flex-col p-4 gap-y-4">
        <p>Logged in as {session.user.name}</p>
        <Button onClick={() => authClient.signOut()} >Log out</Button>

      </div>
    )
  }



  return (
    <div className="p-4 space-y-4">
      {/* Only show name if NOT in login mode */}
      {!login && (
        <Input
          placeholder="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      )}

      <Input placeholder="email" value={email} onChange={(e) => setEmail(e.target.value)} />
      <Input type="password" placeholder="password" value={password} onChange={(e) => setPassword(e.target.value)} />

      <Button onClick={onSubmit} disabled={loading}>
        {loading ? "processing..." : login ? "Login user" : "Create user"}
      </Button>

      <Button variant="ghost" onClick={() => setLogin(!login)}>
        {login ? "Need an account? Sign up" : "Already have an account? Sign in"}
      </Button>
    </div>
  )
}