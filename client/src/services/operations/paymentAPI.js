import { toast } from "react-hot-toast";
import { apiConnector } from "../../../services/apiConnector";
import { paymentEndpoints } from "../../../services/apis";

const { CREATE_ORDER_API, VERIFY_PAYMENT_API, CREATE_MULTI_ORDER_API, VERIFY_MULTI_PAYMENT_API } = paymentEndpoints;

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

// Buy Single Course
export async function buyCourse(courseId, token, user, navigate, skipNavigation = false) {
    const toastId = toast.loading("Loading...");

    try {
        const res = await loadScript("https://checkout.razorpay.com/v1/checkout.js");

        if (!res) {
            toast.error("Razorpay SDK failed to load. Please check your internet connection.");
            return false;
        }

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

        const { orderId, amount, currency, courseName } = orderResponse.data;

        const options = {
            key: import.meta.env.VITE_RAZORPAY_KEY || "rzp_test_RzJ1OcpeDMiyQS",
            amount: amount,
            currency: currency,
            name: "StudyNotion",
            description: courseName,
            order_id: orderId,
            handler: async function (response) {
                const verified = await verifyPayment({ ...response, courseId }, token, navigate, skipNavigation);
                return verified;
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
                    if (!skipNavigation) {
                        toast.error("Payment cancelled");
                    }
                },
            },
        };

        const razorpay = new window.Razorpay(options);
        razorpay.open();

        razorpay.on("payment.failed", function (response) {
            if (!skipNavigation) {
                toast.error("Payment Failed. Please try again.");
            }
            console.error("Payment failed:", response.error);
        });

    } catch (error) {
        console.error("PAYMENT ERROR:", error);
        if (!skipNavigation) {
            toast.error(error?.response?.data?.message || "Could not complete payment");
        }
        return false;
    } finally {
        toast.dismiss(toastId);
    }
}

// Buy Multiple Courses (Cart Checkout)
export async function buyMultipleCourses(courseIds, token, user, navigate) {
    const toastId = toast.loading("Processing your cart...");

    try {
        const res = await loadScript("https://checkout.razorpay.com/v1/checkout.js");

        if (!res) {
            toast.error("Razorpay SDK failed to load. Please check your internet connection.");
            return false;
        }

        const orderResponse = await apiConnector(
            "POST",
            CREATE_MULTI_ORDER_API,
            { courseIds },
            {
                Authorization: `Bearer ${token}`,
            }
        );

        if (!orderResponse.data.success) {
            throw new Error(orderResponse.data.message);
        }

        const { orderId, amount, currency, courseNames, courseCount } = orderResponse.data;

        const options = {
            key: import.meta.env.VITE_RAZORPAY_KEY || "rzp_test_RzJ1OcpeDMiyQS",
            amount: amount,
            currency: currency,
            name: "StudyNotion",
            description: `${courseCount} Courses: ${courseNames}`,
            order_id: orderId,
            handler: async function (response) {
                await verifyMultiPayment({ ...response, courseIds }, token, navigate);
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

        return true;

    } catch (error) {
        console.error("MULTI-COURSE PAYMENT ERROR:", error);
        toast.error(error?.response?.data?.message || "Could not complete payment");
        return false;
    } finally {
        toast.dismiss(toastId);
    }
}

// Verify Single Course Payment
async function verifyPayment(bodyData, token, navigate, skipNavigation = false) {
    const toastId = toast.loading("Verifying Payment...");
    try {
        const response = await apiConnector("POST", VERIFY_PAYMENT_API, bodyData, {
            Authorization: `Bearer ${token}`,
        });

        if (!response.data.success) {
            throw new Error(response.data.message);
        }

        if (!skipNavigation) {
            toast.success("Payment Successful! You are now enrolled.");
            navigate("/dashboard/enrolled-courses");
        }
        return true;

    } catch (error) {
        console.error("PAYMENT VERIFICATION ERROR:", error);
        if (!skipNavigation) {
            toast.error("Could not verify payment. Please contact support.");
        }
        return false;
    } finally {
        toast.dismiss(toastId);
    }
}

// Verify Multi-Course Payment
async function verifyMultiPayment(bodyData, token, navigate) {
    const toastId = toast.loading("Verifying Payment...");
    try {
        const response = await apiConnector("POST", VERIFY_MULTI_PAYMENT_API, bodyData, {
            Authorization: `Bearer ${token}`,
        });

        if (!response.data.success) {
            throw new Error(response.data.message);
        }

        toast.success(`Payment Successful! You are now enrolled in all courses.`);
        navigate("/dashboard/enrolled-courses");
        return true;

    } catch (error) {
        console.error("MULTI-PAYMENT VERIFICATION ERROR:", error);
        toast.error("Could not verify payment. Please contact support.");
        return false;
    } finally {
        toast.dismiss(toastId);
    }
}
