import { toast } from "react-hot-toast";
import { apiConnector } from "../../../services/apiConnector";
import { paymentEndpoints } from "../../../services/apis";

const { CREATE_ORDER_API, VERIFY_PAYMENT_API } = paymentEndpoints;

// Load Razorpay script
function loadScript(src) {
    return new Promise((resolve) => {
        const script = document.createElement("script");
        script.src = src;
        script.onload = () => {
            resolve(true);
        };
        script.onerror = () => {
            resolve(false);
        };
        document.body.appendChild(script);
    });
}

// Buy Course Function
export async function buyCourse(courseId, token, user, navigate) {
    const toastId = toast.loading("Loading...");

    try {
        // Load Razorpay SDK
        const res = await loadScript("https://checkout.razorpay.com/v1/checkout.js");

        if (!res) {
            toast.error("Razorpay SDK failed to load. Please check your internet connection.");
            return;
        }

        // Create Order
        const orderResponse = await apiConnector(
            "POST",
            CREATE_ORDER_API,
            { courseId },
            {
                Authorization: `Bearer ${token}`,
            }
        );

        if (!orderResponse.data.success) {
            throw new Error(orderResponse.data.message);
        }

        const { orderId, amount, currency, courseName, courseDescription } = orderResponse.data;

        // Razorpay Options
        const options = {
            key: import.meta.env.VITE_RAZORPAY_KEY || "rzp_test_RzJ1OcpeDMiyQS",
            amount: amount,
            currency: currency,
            name: "StudyNotion",
            description: courseName,
            order_id: orderId,
            handler: function (response) {
                // Payment Successful - Verify with Backend
                verifyPayment({ ...response, courseId }, token, navigate);
            },
            prefill: {
                name: `${user.firstName} ${user.lastName}`,
                email: user.email,
            },
            theme: {
                color: "#FFD60A",
            },
            modal: {
                ondismiss: function () {
                    toast.error("Payment cancelled");
                },
            },
        };

        const razorpay = new window.Razorpay(options);
        razorpay.open();

        razorpay.on("payment.failed", function (response) {
            toast.error("Payment Failed. Please try again.");
            console.error("Payment failed:", response.error);
        });

    } catch (error) {
        console.error("PAYMENT ERROR:", error);
        toast.error(error?.response?.data?.message || "Could not complete payment");
    }

    toast.dismiss(toastId);
}

// Verify Payment Function
async function verifyPayment(bodyData, token, navigate) {
    const toastId = toast.loading("Verifying Payment...");
    try {
        const response = await apiConnector("POST", VERIFY_PAYMENT_API, bodyData, {
            Authorization: `Bearer ${token}`,
        });

        if (!response.data.success) {
            throw new Error(response.data.message);
        }

        toast.success("Payment Successful! You are now enrolled.");
        navigate("/dashboard/enrolled-courses");

    } catch (error) {
        console.error("PAYMENT VERIFICATION ERROR:", error);
        toast.error("Could not verify payment. Please contact support.");
    }
    toast.dismiss(toastId);
}
