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
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [isOtpSent, setIsOtpSent] = useState(false);
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

  const handlePhoneNumberChange = (e: ChangeEvent<HTMLInputElement>) => {
    setPhoneNumber(e.target.value);
  };

  const handleOtpChange = (e: ChangeEvent<HTMLInputElement>) => {
    setOtp(e.target.value);
  };

  // Handle submit to sign in and send OTP
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
      try {
        // Send OTP to the provided phone number
        const response = await fetch("/api/sendOtp", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ phoneNumber }),
        });

        if (response.ok) {
          console.log("OTP sent successfully");
          setIsOtpSent(true); // Set OTP sent state
        } else {
          const errorData = await response.json();
          setError(errorData.message || "Failed to send OTP");
        }
      } catch (error) {
        console.error("Error sending OTP:", error);
        setError("Failed to send OTP");
      }

      setLoading(false);
    }
  };

  // Handle OTP verification
  const handleVerifyOtp = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/verifyOtp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ phoneNumber, otp }),
      });

      if (response.ok) {
        console.log("OTP verified successfully");
        // Handle successful OTP verification, e.g., redirect to the homepage
        router.push("/");
      } else {
        const errorData = await response.json();
        setError(errorData.message || "Failed to verify OTP");
      }
    } catch (error) {
      console.error("Error verifying OTP:", error);
      setError("Failed to verify OTP");
    }
    setLoading(false);
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
            isOtpSent ? handleVerifyOtp() : handleSubmit();
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
          <div className="space-y-1">
            <Label htmlFor="phone">Phone Number</Label>
            <Input
              id="phone"
              type="text"
              placeholder="+910123456789"
              name="phone"
              onChange={handlePhoneNumberChange}
            />
          </div>
          {isOtpSent && (
            <div className="space-y-1">
              <Label htmlFor="otp">OTP</Label>
              <Input
                id="otp"
                type="text"
                placeholder="Send OTP to your phone number"
                name="otp"
                onChange={handleOtpChange}
              />
            </div>
          )}
          {error && <p className="text-red-500">{error}</p>}
          <span className="text-blue-500 font-semibold mt-1 mb-1">
            Forgot password
          </span>
          <Button type="submit" className="w-full mt-3" disabled={loading}>
            {loading ? "Processing..." : isOtpSent ? "Verify OTP" : "Sign In"}
          </Button>
        </form>
      </CardContent>
    </div>
  );
}
