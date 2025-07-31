"use client";
import CountryCodeSelector from "@/components/CountryCodeSelector";
import { OTPSchema, OTPFormData } from "@/lib/types";
import { useAuthStore } from "@/store/authStore";
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, Phone } from "lucide-react";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from 'react-hot-toast';

// Login Page Component
const LoginPage = () => {
  const [otpSent, setOtpSent] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [otp, setOtp] = useState("");
  const login = useAuthStore((state) => state.login);

  const { control, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(OTPSchema),
    defaultValues: { countryCode: '', phone: '' },
  });

  const onSendOtp = (data: OTPFormData) => {
    console.log("Sending OTP to:", data);
    toast.loading("Sending OTP...", { id: 'otp' });
    setTimeout(() => {
      toast.success("OTP Sent to " + data.countryCode + data.phone, { id: 'otp' });
      setOtpSent(true);
    }, 2000);
  };

  const onVerifyOtp = () => {
    setIsVerifying(true);
    toast.loading("Verifying OTP...", { id: 'verify' });
    setTimeout(() => {
      if (otp === '123456') {
        toast.success("Login Successful!", { id: 'verify' });
        login();
      } else {
        toast.error("Invalid OTP. Please try again.", { id: 'verify' });
        setIsVerifying(false);
      }
    }, 2000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 p-4">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-lg dark:bg-gray-800">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Welcome Back</h1>
          <p className="text-gray-500 dark:text-gray-400">
            {otpSent ? 'Enter the 6-digit code we sent you.' : 'Sign in to your Gemini Clone account.'}
          </p>
        </div>

        {!otpSent ? (
          <form onSubmit={handleSubmit(onSendOtp)} className="space-y-4">
            <div>
              <Controller
                name="countryCode"
                control={control}
                render={({ field }) => <CountryCodeSelector field={field} />}
              />
              {errors.countryCode && <p className="text-red-500 text-sm mt-1">{errors.countryCode.message}</p>}
            </div>
            <div className="flex items-center border border-gray-300 rounded-md focus-within:ring-2 focus-within:ring-indigo-500 dark:border-gray-600">
               <span className="pl-3 text-gray-500"><Phone size={20}/></span>
               <input
                {...control.register("phone")}
                type="tel"
                placeholder="Phone Number"
                className="w-full p-3 bg-transparent border-none focus:ring-0 dark:text-white"
              />
            </div>
             {errors.phone && <p className="text-red-500 text-sm">{errors.phone.message}</p>}
            <button type="submit" className="w-full p-3 text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-gray-800 font-semibold">
              Send OTP
            </button>
          </form>
        ) : (
          <div className="space-y-4">
            <input
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="Enter 6-digit OTP"
              maxLength={6}
              className="w-full p-3 text-center tracking-[1em] border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
            />
            <button onClick={onVerifyOtp} disabled={isVerifying} className="w-full p-3 text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-400 font-semibold flex items-center justify-center">
              {isVerifying && <Loader2 className="mr-2 h-5 w-5 animate-spin" />}
              Verify OTP
            </button>
            <button onClick={() => setOtpSent(false)} className="w-full text-sm text-center text-gray-500 hover:text-indigo-600 dark:hover:text-indigo-400">
              Change number
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default LoginPage