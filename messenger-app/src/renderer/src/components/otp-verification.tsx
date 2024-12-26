import React, { useState } from 'react';

export default function OTP_verification() {
    const [otp, setOtp] = useState(''.padStart(6, ' ')); // Tạo chuỗi dài 6 ký tự rỗng

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log('OTP submitted:', otp);
        // Thêm logic xử lý OTP tại đây
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4 mt-4 flex flex-col items-center justify-center min-h-screen">
            <h2 className="text-lg font-semibold text-center">Verify OTP</h2>
            <p className="text-xs text-gray-500 text-center">
                Enter the OTP sent to your registered email or phone number.
            </p>
            <div className="flex justify-center gap-1">
                {[...Array(6)].map((_, index) => (
                    <input
                        key={index}
                        type="text"
                        maxLength={1}
                        className="w-8 h-8 border border-gray-300 rounded text-center text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        onChange={(e) => {
                            const value = e.target.value;
                            if (!isNaN(Number(value))) {
                                setOtp((prevOtp) => {
                                    const otpArray = prevOtp.split('');
                                    otpArray[index] = value;
                                    return otpArray.join('');
                                });
                                const nextSibling = e.target.nextSibling as HTMLInputElement | null;
                                if (nextSibling) {
                                    nextSibling.focus();
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
    );
}
