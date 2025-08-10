import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { apiConnector } from "../services/apiConnector";
import { GIG_API, ORDER_API, PAYMENT_API, REVIEW_API } from "../services/apis";
import { AiFillStar } from "react-icons/ai";
import toast from "react-hot-toast";
import Slider from "react-slick";
import { IoMdClose } from "react-icons/io";
import { Rating } from "react-simple-star-rating";

const ViewGig = () => {
  const { gigId } = useParams();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  const [gig, setGig] = useState(null);
  const [loading, setLoading] = useState(true);
  const [modalImage, setModalImage] = useState(null);
  const [paying, setPaying] = useState(false);
  const [hasPurchased, setHasPurchased] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reviewText, setReviewText] = useState("");
  const [rating, setRating] = useState(0);
  const [reviews, setReviews] = useState([]);

  const imageUrl = (imgPath) =>
    imgPath?.startsWith("http")
      ? imgPath
      : `${import.meta.env.VITE_SERVER_BASE_URL.replace("/api", "")}/${imgPath}`;

  useEffect(() => {
    fetchGig();
    fetchPurchaseStatus();
    fetchReviews();
  }, [gigId]);

  const fetchGig = async () => {
    try {
      const res = await apiConnector("GET", GIG_API.GET_GIG_BY_ID(gigId));
      setGig(res);
    } catch (err) {
      toast.error("Failed to load gig");
    } finally {
      setLoading(false);
    }
  };

  const fetchPurchaseStatus = async () => {
    if (user?.role !== "client") return;
    try {
      const res = await apiConnector("GET", ORDER_API.GET_MY_ORDERS);
      const purchased = res?.orders?.some(
        (order) => order.gigId === gigId || order.gigId?._id === gigId
      );
      setHasPurchased(purchased);
    } catch (err) {
      console.error("Purchase check failed", err);
    }
  };

 const fetchReviews = async () => {
  try {
    const data = await apiConnector("get", `/reviews/gig/${gigId}`);
    setReviews(data || []); // assuming the API returns an array directly
  } catch (err) {
    console.error("Failed to fetch reviews", err);
  }
};

  const handleReviewSubmit = async (e) => {
    e.preventDefault();

    if (!rating || !reviewText.trim()) {
      return toast.error("Please provide both rating and review");
    }

    try {
      await apiConnector("POST", REVIEW_API.ADD_REVIEW, {
        gigId,
        rating,
        comment: reviewText,
      });

      toast.success("Review submitted!");
      setReviewText("");
      setRating(0);
      setShowReviewModal(false);
      fetchReviews();
    } catch (err) {
      console.error(err);
      toast.error("Failed to submit review");
    }
  };

  const handleBuyNow = async () => {
  if (!user) return toast.error("Please login to continue");
  if (user.role !== "client") return toast.error("Only clients can place orders");

  const buyerId = user?.id;
  const amount = gig?.price;

  if (!amount || !buyerId || !gigId) {
    toast.error("Missing required data to initiate payment");
    return;
  }

  // ✅ Load Razorpay SDK script
  const loaded = await loadRazorpayScript();
  if (!loaded || typeof window.Razorpay !== "function") {
    console.error("Razorpay SDK failed to load");
    toast.error("Failed to load Razorpay SDK. Please refresh and try again.");
    return;
  }

  // ✅ Check env variable
  const razorpayKey = import.meta.env.VITE_RAZORPAY_KEY_ID;
  if (!razorpayKey) {
    console.error("Razorpay key is missing. Check your .env file.");
    toast.error("Razorpay key is missing in environment variables");
    return;
  }

  try {
    setPaying(true);

    // ✅ Create order from backend
    const order = await apiConnector("POST", PAYMENT_API.CREATE_ORDER, {
      amount,
      buyerId,
      gigId,
    });

    if (!order?.id) {
      toast.error("Failed to create Razorpay order");
      return;
    }

    const options = {
      key: razorpayKey,
      amount: order.amount,
      currency: order.currency,
      name: "Freelance Hub",
      description: gig.title,
      order_id: order.id,
      handler: async (response) => {
        try {
          await apiConnector("POST", ORDER_API.CREATE_ORDER, {
            gigId,
            paymentId: response.razorpay_payment_id,
            orderId: response.razorpay_order_id,
            signature: response.razorpay_signature,
            amount,
          });
          toast.success("Order placed successfully!");
          navigate("/my-orders");
        } catch (err) {
          console.error("Order creation failed:", err);
          toast.error("Order creation failed");
        }
      },
      prefill: {
        name: user.name,
        email: user.email,
      },
      theme: { color: "#22c55e" },
    };

    new window.Razorpay(options).open();
  } catch (err) {
    console.error("Payment initiation failed:", err);
    toast.error("Payment initiation failed");
  } finally {
    setPaying(false);
  }
};

// ✅ Razorpay Script Loader
const loadRazorpayScript = () =>
  new Promise((resolve) => {
    if (document.querySelector("script[src='https://checkout.razorpay.com/v1/checkout.js']")) {
      resolve(true);
      return;
    }
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });

  if (loading) return <div className="p-8 text-center">Loading...</div>;
  if (!gig) return <div className="p-8 text-center">Gig not found</div>;

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 relative">
      <h1 className="text-3xl font-bold mb-2">{gig.title}</h1>
      <p className="text-gray-600 mb-4">By {gig.userId?.name || "Unknown"}</p>

      {/* ⭐ Rating */}
      <div className="flex items-center text-yellow-500 mb-4">
        {Array.from({ length: 5 }).map((_, idx) => (
          <AiFillStar
            key={idx}
            className={
              idx < Math.round(gig.totalStars / gig.starNumber)
                ? "fill-yellow-500"
                : "fill-gray-300"
            }
          />
        ))}
        <span className="ml-2 text-sm text-gray-700">
          {(
            (gig.totalStars || 0) / (gig.starNumber || 1)
          ).toFixed(1)}{" "}
          ({gig.starNumber || 0} reviews)
        </span>
      </div>

      {/* Cover */}
      {gig.cover && (
        <img
          src={imageUrl(gig.cover.url)}
          alt="cover"
          onClick={() => setModalImage(imageUrl(gig.cover.url))}
          className="w-full h-[300px] object-cover rounded mb-6 cursor-pointer"
        />
      )}

      {/* Buy Now */}
      {user?.role === "client" && (
        <button
          onClick={handleBuyNow}
          disabled={paying}
          className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded mb-6"
        >
          {paying ? "Processing..." : "Buy Now"}
        </button>
      )}

      {/* ✅ Write Review */}
      {user?.role === "client" && hasPurchased && (
        <div className="mb-6">
          <button
            onClick={() => setShowReviewModal(true)}
            className="text-green-600 font-medium underline"
          >
            Write a Review
          </button>
        </div>
      )}

      {/* 💬 Reviews */}
      <div className="mt-8">
        <h3 className="text-xl font-semibold mb-4">Client Reviews</h3>
        {reviews.length === 0 ? (
          <p className="text-gray-500">No reviews yet.</p>
        ) : (
          <div className="space-y-4">
            {reviews.map((rev) => (
              <div key={rev._id} className="bg-gray-100 p-4 rounded shadow-sm">
                <div className="flex items-center mb-1">
                  <Rating readonly size={20} initialValue={rev.rating} allowFraction />
                </div>
                <p className="text-gray-700">{rev.comment}</p>
                <p className="text-xs text-gray-500 mt-1">— {rev.userId?.name || "Anonymous"}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 📝 Review Modal */}
      {showReviewModal && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-[90%] max-w-md relative">
            <button
              onClick={() => setShowReviewModal(false)}
              className="absolute top-2 right-2 text-gray-500 hover:text-black"
            >
              <IoMdClose size={24} />
            </button>
            <h2 className="text-xl font-bold mb-4">Write a Review</h2>
            <form onSubmit={handleReviewSubmit}>
              <Rating
                onClick={(rate) => setRating(rate)}
                size={24}
                initialValue={rating}
              />
              <textarea
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
                className="w-full border mt-4 p-2 rounded resize-none h-24"
                placeholder="Share your experience..."
              ></textarea>
              <button
                type="submit"
                className="mt-4 w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
              >
                Submit Review
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Image Modal */}
      {modalImage && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50">
          <button
            onClick={() => setModalImage(null)}
            className="absolute top-6 right-6 text-white text-3xl"
          >
            <IoMdClose />
          </button>
          <img src={modalImage} className="max-w-full max-h-[90vh]" />
        </div>
      )}
    </div>
  );
};

export default ViewGig;
