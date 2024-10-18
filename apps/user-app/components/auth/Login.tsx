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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default function Login() {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [newPassword, setNewPassword] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [forgotPasswordOpen, setForgotPasswordOpen] = useState(false);
  const [forgotPasswordOtpSent, setForgotPasswordOtpSent] = useState(false);
  const [otpSuccessMessage, setOtpSuccessMessage] = useState("");

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

  const handleNewPasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
    setNewPassword(e.target.value);
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
      setLoading(false);
      setError("Invalid email or password");
    } else {
      try {
        const response = await fetch("/api/sendOtp", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ phoneNumber }),
        });

        if (response.ok) {
          setIsOtpSent(true);
          setOtpSuccessMessage("OTP has been sent to your phone number!");
        } else {
          const errorData = await response.json();
          setError(errorData.message || "Failed to send OTP");
        }
      } catch (error) {
        setError("Failed to send OTP");
      }

      setLoading(false);
    }
  };

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
        router.push("/");
      } else {
        const errorData = await response.json();
        setError(errorData.message || "Failed to verify OTP");
      }
    } catch (error) {
      setError("Failed to verify OTP");
    }
    setLoading(false);
  };

  const handleForgotPassword = async () => {
    setLoading(true);
    setOtpSuccessMessage("");
    try {
      const response = await fetch("/api/sendOtp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ phoneNumber }),
      });

      if (response.ok) {
        setForgotPasswordOtpSent(true);
        setOtpSuccessMessage("OTP has been sent to your phone number!");
      } else {
        const errorData = await response.json();
        setError(errorData.message || "Failed to send OTP");
      }
    } catch (error) {
      setError("Failed to send OTP");
    }
    setLoading(false);
  };

  const handleResetPassword = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/resetPassword", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ phoneNumber, otp, newPassword }),
      });

      if (response.ok) {
        setForgotPasswordOpen(false);
        router.push("/");
      } else {
        const errorData = await response.json();
        setError(errorData.message || "Failed to reset password");
      }
    } catch (error) {
      setError("Failed to reset password");
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
          {otpSuccessMessage && (
            <p className="text-red-500">{otpSuccessMessage}</p>
          )}
          {isOtpSent && (
            <div className="space-y-1">
              <Label htmlFor="otp">OTP</Label>
              <Input
                id="otp"
                type="text"
                placeholder="Enter OTP sent to your phone number"
                name="otp"
                onChange={handleOtpChange}
              />
            </div>
          )}
          {error && <p className="text-red-500">{error}</p>}
          <span
            className="text-blue-500 font-semibold mt-1 mb-1 cursor-pointer"
            onClick={() => setForgotPasswordOpen(true)}
          >
            Forgot password
          </span>
          <Button type="submit" className="w-full mt-3" disabled={loading}>
            {loading ? "Processing..." : isOtpSent ? "Verify OTP" : "Sign In"}
          </Button>
        </form>
      </CardContent>
      <Dialog open={forgotPasswordOpen} onOpenChange={setForgotPasswordOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reset Password</DialogTitle>
          </DialogHeader>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              forgotPasswordOtpSent
                ? handleResetPassword()
                : handleForgotPassword();
            }}
          >
            <div className="space-y-1">
              <Label htmlFor="phone" className="mr-2">
                Phone Number
              </Label>
              <div className="flex items-center">
                <Input
                  id="phone"
                  type="text"
                  placeholder="+910123456789"
                  name="phone"
                  className="flex-grow"
                  onChange={handlePhoneNumberChange}
                />
                <Button
                  type="button"
                  onClick={handleForgotPassword}
                  className="ml-2"
                >
                  Send OTP
                </Button>
              </div>
              {otpSuccessMessage && (
                <p className="text-red-500">{otpSuccessMessage}</p>
              )}
            </div>
            {
              <>
                <div className="space-y-1">
                  <Label htmlFor="otp">OTP</Label>
                  <Input
                    id="otp"
                    type="text"
                    placeholder="Enter OTP"
                    name="otp"
                    onChange={handleOtpChange}
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="newPassword">New Password</Label>
                  <Input
                    id="newPassword"
                    type="password"
                    placeholder="Enter new password"
                    name="newPassword"
                    onChange={handleNewPasswordChange}
                  />
                </div>
              </>
            }
            {error && <p className="text-red-500">{error}</p>}
            <Button type="submit" className="w-full mt-3" disabled={loading}>
              {loading ? "Processing..." : "Reset Password"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
