import { AlertCircle, CheckCircle, Clock, ArrowRight } from "lucide-react"
import { useEffect, useState } from "react"
import { useSearchParams, useNavigate } from "react-router"
import axiosInstance from "../../../api/axios"
import { toast } from "sonner"

export default function PaymentSuccess() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const [status, setStatus] = useState<"loading" | "success" | "failed">("loading")
  const [countdown, setCountdown] = useState(2)
  const [isVisible, setIsVisible] = useState(false)

  const sessionId = searchParams.get("session_id")

  // Fade in animation on mount
  useEffect(() => {
    setIsVisible(true)
  }, [])

  // Auto redirect after success
  useEffect(() => {
    if (status === "success") {
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer)
            window.location.href = "/dashboard"
            return 0
          }
          return prev - 1
        })
      }, 1000)

      return () => clearInterval(timer)
    }
  }, [status, navigate])

  useEffect(() => {
    if (!sessionId) {
      setStatus("failed")
      return
    }

    const checkPaymentStatus = async () => {
      try {
        const response = await axiosInstance.get(`/payment/verify-payment?sessionId=${sessionId}`)
        const data = response.data

        if (data.status) {
          setStatus("success")
        } else {
          setStatus("failed")
        }
      } catch (error) {
        console.log(error)
        toast.error("Payment verification failed")
        setStatus("failed")
      }
    }

    checkPaymentStatus()
  }, [sessionId])

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex flex-col items-center justify-center p-4">
      <div
        className={`w-full max-w-md bg-white rounded-xl shadow-lg p-8 text-center transform transition-all duration-700 ease-out ${
          isVisible ? "translate-y-0 opacity-100 scale-100" : "translate-y-8 opacity-0 scale-95"
        }`}
      >
        {status === "loading" && (
          <div className="space-y-6 animate-in fade-in duration-500">
            <div className="relative inline-flex items-center justify-center w-20 h-20 bg-blue-100 rounded-full">
              <Clock className="w-10 h-10 text-blue-500 animate-spin" />
              <div className="absolute inset-0 rounded-full border-4 border-blue-200 border-t-blue-500 animate-spin"></div>
            </div>
            <div className="space-y-3">
              <h1 className="text-2xl font-bold text-gray-800 animate-in slide-in-from-bottom-4 duration-700 delay-200">
                Processing Your Payment
              </h1>
              <p className="text-gray-600 animate-in slide-in-from-bottom-4 duration-700 delay-300">
                We're verifying your transaction and updating your credit balance...
              </p>
            </div>
            <div className="flex justify-center space-x-1 animate-in slide-in-from-bottom-4 duration-700 delay-500">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></div>
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
            </div>
          </div>
        )}

        {status === "success" && (
          <div className="space-y-6 animate-in fade-in duration-500">
            <div className="relative inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full animate-in zoom-in duration-500 delay-100">
              <CheckCircle className="w-10 h-10 text-green-500" />
              <div className="absolute inset-0 rounded-full bg-green-500 opacity-20 animate-ping"></div>
            </div>
            <div className="space-y-3">
              <h1 className="text-2xl font-bold text-gray-800 animate-in slide-in-from-bottom-4 duration-700 delay-200">
                Payment Successful!
              </h1>
              <p className="text-gray-600 animate-in slide-in-from-bottom-4 duration-700 delay-300">
                Your credits have been added to your account successfully.
              </p>
            </div>
            <div className="space-y-4 animate-in slide-in-from-bottom-4 duration-700 delay-400">
              <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                <p className="text-sm text-green-700">
                  Redirecting to dashboard in {countdown} second{countdown !== 1 ? "s" : ""}...
                </p>
                <div className="w-full bg-green-200 rounded-full h-1 mt-2">
                  <div
                    className="bg-green-500 h-1 rounded-full transition-all duration-1000 ease-linear"
                    style={{ width: `${((2 - countdown) / 2) * 100}%` }}
                  ></div>
                </div>
              </div>
              <button
                onClick={() => navigate("/dashboard")}
                className="w-full bg-green-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-green-700 transition-all duration-200 transform hover:scale-105 active:scale-95 flex items-center justify-center gap-2 group"
              >
                Go to Dashboard Now
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </button>
            </div>
          </div>
        )}

        {status === "failed" && (
          <div className="space-y-6 animate-in fade-in duration-500">
            <div className="relative inline-flex items-center justify-center w-20 h-20 bg-red-100 rounded-full animate-in zoom-in duration-500 delay-100">
              <AlertCircle className="w-10 h-10 text-red-500 animate-pulse" />
            </div>
            <div className="space-y-3">
              <h1 className="text-2xl font-bold text-gray-800 animate-in slide-in-from-bottom-4 duration-700 delay-200">
                Payment Processing
              </h1>
              <p className="text-gray-600 animate-in slide-in-from-bottom-4 duration-700 delay-300">
                Your payment was successful but we're still finalizing your credits. They should appear within 5
                minutes.
              </p>
            </div>
            <div className="space-y-4 animate-in slide-in-from-bottom-4 duration-700 delay-400">
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                <p className="text-sm text-amber-700">Don't worry! Your payment went through successfully.</p>
              </div>
              <div className="flex flex-col space-y-3">
                <button
                  onClick={() => navigate("/dashboard")}
                  className="w-full bg-gray-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-gray-700 transition-all duration-200 transform hover:scale-105 active:scale-95"
                >
                  Go to Dashboard
                </button>
                <button
                  onClick={() => navigate("/support")}
                  className="text-red-600 font-medium hover:underline transition-colors duration-200 hover:text-red-700"
                >
                  Need help? Contact Support
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
