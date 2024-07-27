"use client";
import { Button } from "@/components/ui/button";
import {
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";
import { ChangeEvent, useState } from "react";
import { signIn } from "next-auth/react";

export default function Login() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();

  const handleEmailChange = (e: ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  const handleSubmit = async () => {
    setError("");
    setLoading(true);

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (result?.error) {
      console.log("error");
      setLoading(false);
      setError("Invalid email or password");
    } else {
      console.log("good bro");
      setLoading(false);
      router.push("/");
    }
  };

  return (
    <div>
      <CardHeader>
        <CardTitle>Login</CardTitle>
        <CardDescription>Welcome back to MyWallet</CardDescription>
      </CardHeader>
      <CardContent className="space-y-2">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit();
          }}
        >
          <div className="space-y-1">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="Type email here"
              name="email"
              onChange={handleEmailChange}
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="Type password here"
              name="password"
              onChange={handlePasswordChange}
            />
          </div>
          {error && <p className="text-red-500">{error}</p>}
          <span className="text-blue-500 font-semibold mt-1 mb-1">
            Forgot password
          </span>
          <Button type="submit" className="w-full mt-3" disabled={loading}>
            {loading ? "Signing in..." : "Sign In"}
          </Button>
        </form>
      </CardContent>
    </div>
  );
}
