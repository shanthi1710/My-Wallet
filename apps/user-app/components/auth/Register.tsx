"use client";

import {
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useEffect, useState } from "react";

import { signinValidation } from "@repo/inputvalidation/Validation";
import signup from "../../app/lib/actions/signup";
import { Button } from "@/components/ui/button";
import { AuthTabs, AuthTabValues } from "../../app/userAuth/page";

interface Props {
  setAuthTab: (tab: AuthTabValues) => void;
}

export default function Register({ setAuthTab }: Props) {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [number, setNumber] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [touched, setTouched] = useState<{ [key: string]: boolean }>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const validate = () => {
      const parsed = signinValidation.safeParse({
        email,
        name,
        number,
        password,
      });
      const errorMessages: { [key: string]: string } = {};
      if (!parsed.success) {
        parsed.error.errors.forEach((err) => {
          errorMessages[err.path[0] as string] = err.message;
        });
      }
      setErrors(errorMessages);
    };

    const timeout = setTimeout(validate, 300);
    return () => clearTimeout(timeout);
  }, [email, name, number, password]);

  const handleBlur = (field: string) => {
    setTouched((prevTouched) => ({ ...prevTouched, [field]: true }));
  };

  const handleSubmit = async () => {
    setLoading(true); // Set loading state while processing

    const result = signinValidation.safeParse({
      email,
      name,
      password,
      number,
    });

    if (result.success) {
      const res = await signup(email, name, password, number);
      setLoading(false); // Reset loading state

      if (res) {
        console.log("ok");
        setAuthTab(AuthTabs.LOGIN);
      } else {
        alert("Signup failed. User already exists."); // Show alert for signup failure
      }
    } else {
      setLoading(false); // Reset loading state
      alert("Please fill out all fields correctly."); // Generic error message for validation failure
    }
  };

  return (
    <div>
      <CardHeader>
        <CardTitle>Register</CardTitle>
        <CardDescription>Welcome back to MyWallet</CardDescription>
      </CardHeader>
      <CardContent className="space-y-2">
        <form>
          <div className="space-y-1">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              type="text"
              name="name"
              placeholder="Enter your name."
              onChange={(e) => setName(e.target.value)}
              onBlur={() => handleBlur("name")}
            />
            {touched.name && errors.name && (
              <p className="text-red-500 text-sm">{errors.name}</p>
            )}
          </div>
          <div className="space-y-1">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              name="email"
              placeholder="Enter your email."
              onChange={(e) => setEmail(e.target.value)}
              onBlur={() => handleBlur("email")}
            />
            {touched.email && errors.email && (
              <p className="text-red-500 text-sm">{errors.email}</p>
            )}
          </div>
          <div className="space-y-1">
            <Label htmlFor="phone">Phone Number</Label>
            <Input
              id="phone"
              type="text"
              name="phone"
              placeholder="Enter your phone number"
              onChange={(e) => setNumber(e.target.value)}
              onBlur={() => handleBlur("number")}
            />
            {touched.number && errors.number && (
              <p className="text-red-500 text-sm">{errors.number}</p>
            )}
          </div>
          <div className="space-y-1">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              name="password"
              placeholder="Enter your password."
              onChange={(e) => setPassword(e.target.value)}
              onBlur={() => handleBlur("password")}
            />
            {touched.password && errors.password && (
              <p className="text-red-500 text-sm">{errors.password}</p>
            )}
          </div>
          <div className="mt-2">
            <Button
              onClick={handleSubmit}
              className={`w-full mt-3 ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
              disabled={loading}
            >
              {loading ? "Signing up..." : "Sign Up"}
            </Button>
          </div>
        </form>
      </CardContent>
    </div>
  );
}
