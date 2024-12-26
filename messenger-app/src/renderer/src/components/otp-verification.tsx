import authService from '@renderer/services/authService'
import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { toast } from './ui/use-toast'

export default function OTP_verification() {
  const [otp, setOtp] = useState(''.padStart(6, ' ')) // Tạo chuỗi dài 6 ký tự rỗng
  const params = useParams<{ email: string }>()
  const navi = useNavigate()
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      // Gọi hàm verifyOTP từ authService
      if (params.email) {
        await authService.verifyOTP(params.email, otp)
        toast({
          variant: 'default',
          title: 'OTP Verified',
          description: 'You are now verified'
        })
        navi('/chat')
        console.log('OTP verified')
      } else {
        console.error('Email not found  in params')
        toast({
          variant: 'destructive',
          title: 'OTP Verification Failed',
          description: 'An error occurred during OTP verification'
        })
      }
    } catch (error) {
      console.error('OTP verification failed:', error)
    }
  }
  useEffect(() => {
    console.log('Email:', params.email)
  }, [params.email])
  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 mt-4 flex flex-col items-center justify-center min-h-screen"
    >
      <h2 className="text-lg font-semibold text-center">Verify OTP</h2>
      <p className="text-xs text-gray-500 text-center">
        Enter the OTP sent to your registered email or phone number.
      </p>
      <div className="flex justify-center gap-1">
        {[...Array(4)].map((_, index) => (
          <input
            key={index}
            type="text"
            maxLength={1}
            className="w-8 h-8 border border-gray-300 rounded text-center text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            onChange={(e) => {
              const value = e.target.value
              if (!isNaN(Number(value))) {
                setOtp((prevOtp) => {
                  const otpArray = prevOtp.split('')
                  otpArray[index] = value
                  return otpArray.join('')
                })
                const nextSibling = e.target.nextSibling as HTMLInputElement | null
                if (nextSibling) {
                  nextSibling.focus()
                }
              }
            }}
          />
        ))}
      </div>
      <button
        type="submit"
        className="py-1 px-2 bg-blue-500 text-white text-sm rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 mt-4"
      >
        Verify
      </button>
    </form>
  )
}
