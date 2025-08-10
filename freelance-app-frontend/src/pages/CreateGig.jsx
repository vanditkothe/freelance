import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { apiConnector } from "../services/apiConnector";
import { GIG_API, UPLOAD_API } from "../services/apis";
import { FiPlus, FiUpload, FiArrowLeft, FiArrowRight } from "react-icons/fi";

const categories = [
  "Graphics & Design",
  "Writing & Translation",
  "Video & Animation",
  "Programming & Tech",
  "Web Development",
  "Digital Marketing",
  "Music & Audio",
  "Business"
];

const CreateGig = () => {
  const { user } = useSelector((s) => s.auth);
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [coverPreview, setCoverPreview] = useState(null);
  const [coverFile, setCoverFile] = useState(null);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [imageFiles, setImageFiles] = useState([]);
  const [uploading, setUploading] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    watch,
  } = useForm({ defaultValues: { features: [""] } });

  useEffect(() => {
    if (user && user.role !== "freelancer") {
      toast.error("Only freelancers can create gigs.");
      navigate("/");
    }
  }, [user, navigate]);

  const handleCoverChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCoverPreview(URL.createObjectURL(file));
      setCoverFile(file);
    }
  };

  const handleImagesChange = (e) => {
    const files = Array.from(e.target.files);
    const allowed = 5 - imageFiles.length;
    const selectedFiles = files.slice(0, allowed);

    setImagePreviews((prev) => [
      ...prev,
      ...selectedFiles.map((file) => URL.createObjectURL(file)),
    ]);
    setImageFiles((prev) => [...prev, ...selectedFiles]);
  };

  const removeImage = (index) => {
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
    setImageFiles(prev => prev.filter((_, i) => i !== index));
  };

  const onSubmit = async (data) => {
    try {
      setUploading(true);

      const formData = new FormData();
      if (coverFile) formData.append("images", coverFile);
      imageFiles.forEach((file) => formData.append("images", file));

      const res = await apiConnector("POST", UPLOAD_API.UPLOAD_IMAGES, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const [coverFileResponse, ...otherFiles] = res.files;

      const payload = {
        title: data.title,
        shortDescription: data.shortDescription,
        description: data.description,
        category: data.category,
        price: Number(data.price),
        deliveryTime: Number(data.deliveryTime),
        revisionNumber: Number(data.revisionNumber),
        cover: coverFileResponse,
        images: otherFiles,
        features: data.features.filter((f) => f.trim() !== ""),
      };

      await apiConnector("POST", GIG_API.CREATE_GIG, payload);
      toast.success("Gig created successfully!");
      navigate("/my-gigs");
    } catch (err) {
      console.error(err);
      toast.error(err.message || "Failed to create gig");
    } finally {
      setUploading(false);
    }
  };

  const next = () => setStep((s) => s + 1);
  const back = () => setStep((s) => s - 1);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        {/* Progress Steps */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-center text-gray-800 mb-2">
            Create a New Gig
          </h1>
          <div className="flex items-center justify-between mb-6">
            {["Basic Info", "Images", "Pricing"].map((label, index) => (
              <div key={index} className="flex flex-col items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    step > index + 1
                      ? "bg-green-500 text-white"
                      : step === index + 1
                      ? "bg-emerald-600 text-white"
                      : "bg-gray-200 text-gray-600"
                  }`}
                >
                  {index + 1}
                </div>
                <span
                  className={`mt-2 text-sm font-medium ${
                    step === index + 1 ? "text-emerald-600" : "text-gray-500"
                  }`}
                >
                  {label}
                </span>
              </div>
            ))}
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-emerald-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(step / 3) * 100}%` }}
            ></div>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-xl shadow-md p-6 sm:p-8">
          {step === 1 && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Gig Title*
                </label>
                <input
                  {...register("title", { required: "Title is required" })}
                  placeholder="e.g. I will design a professional logo"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                />
                {errors.title && (
                  <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Short Description*
                </label>
                <input
                  {...register("shortDescription", {
                    required: "Short description is required",
                    maxLength: {
                      value: 120,
                      message: "Max 120 characters"
                    }
                  })}
                  placeholder="Briefly describe your gig"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                />
                <div className="flex justify-between mt-1">
                  {errors.shortDescription && (
                    <p className="text-sm text-red-600">{errors.shortDescription.message}</p>
                  )}
                  <span className="text-xs text-gray-500">
                    {watch("shortDescription")?.length || 0}/120 characters
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category*
                </label>
                <select
                  {...register("category", { required: "Category is required" })}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                >
                  <option value="">Select a category</option>
                  {categories.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
                {errors.category && (
                  <p className="mt-1 text-sm text-red-600">{errors.category.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description*
                </label>
                <textarea
                  {...register("description", { required: "Description is required" })}
                  rows={6}
                  placeholder="Describe your gig in detail..."
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                />
                {errors.description && (
                  <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
                )}
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Cover Image*
                </label>
                <div className="flex items-center justify-center w-full">
                  <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                    {coverPreview ? (
                      <img src={coverPreview} alt="Cover preview" className="h-full w-full object-cover rounded-lg" />
                    ) : (
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <FiUpload className="w-8 h-8 mb-3 text-gray-500" />
                        <p className="mb-2 text-sm text-gray-500">
                          <span className="font-semibold">Click to upload</span> or drag and drop
                        </p>
                        <p className="text-xs text-gray-500">PNG, JPG, JPEG (Max 5MB)</p>
                      </div>
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleCoverChange}
                      className="hidden"
                      required={!coverFile}
                    />
                  </label>
                </div>
                {errors.cover && (
                  <p className="mt-1 text-sm text-red-600">{errors.cover.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Extra Images (up to 5)
                </label>
                <div className="flex items-center justify-center w-full">
                  <label className="flex flex-col items-center justify-center w-full border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 p-6">
                    <div className="flex flex-col items-center justify-center">
                      <FiUpload className="w-8 h-8 mb-3 text-gray-500" />
                      <p className="mb-2 text-sm text-gray-500">
                        <span className="font-semibold">Click to upload</span> or drag and drop
                      </p>
                      <p className="text-xs text-gray-500">PNG, JPG, JPEG (Max 5MB each)</p>
                    </div>
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleImagesChange}
                      className="hidden"
                      disabled={imageFiles.length >= 5}
                    />
                  </label>
                </div>
                {imagePreviews.length > 0 && (
                  <div className="mt-4">
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {imagePreviews.map((src, idx) => (
                        <div key={idx} className="relative group">
                          <img
                            src={src}
                            alt={`Preview ${idx + 1}`}
                            className="h-32 w-full object-cover rounded-lg"
                          />
                          <button
                            type="button"
                            onClick={() => removeImage(idx)}
                            className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                    <p className="text-xs text-gray-500 mt-2">
                      {imageFiles.length}/5 images uploaded
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Price (USD)*
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-gray-500">$</span>
                  </div>
                  <input
                    type="number"
                    {...register("price", {
                      required: "Price is required",
                      min: {
                        value: 5,
                        message: "Minimum price is $5"
                      }
                    })}
                    placeholder="0.00"
                    className="w-full pl-8 pr-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  />
                </div>
                {errors.price && (
                  <p className="mt-1 text-sm text-red-600">{errors.price.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Delivery Time (days)*
                </label>
                <input
                  type="number"
                  {...register("deliveryTime", {
                    required: "Delivery time is required",
                    min: {
                      value: 1,
                      message: "Minimum 1 day"
                    }
                  })}
                  placeholder="e.g. 3"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                />
                {errors.deliveryTime && (
                  <p className="mt-1 text-sm text-red-600">{errors.deliveryTime.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Number of Revisions*
                </label>
                <select
                  {...register("revisionNumber", { required: "Revisions required" })}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                >
                  <option value="0">0 (No revisions)</option>
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                  <option value="4">4</option>
                  <option value="5">5</option>
                  <option value="99">Unlimited</option>
                </select>
                {errors.revisionNumber && (
                  <p className="mt-1 text-sm text-red-600">{errors.revisionNumber.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Key Features
                </label>
                <div className="space-y-2">
                  {watch("features").map((_, idx) => (
                    <input
                      key={idx}
                      {...register(`features.${idx}`)}
                      placeholder={`Feature ${idx + 1}`}
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    />
                  ))}
                  <button
                    type="button"
                    onClick={() => setValue("features", [...watch("features"), ""])}
                    className="flex items-center text-sm text-emerald-600 hover:text-emerald-700 mt-2"
                  >
                    <FiPlus className="mr-1" /> Add another feature
                  </button>
                </div>
              </div>
            </div>
          )}

          <div className="flex justify-between pt-8">
            {step > 1 ? (
              <button
                type="button"
                onClick={back}
                className="flex items-center px-6 py-2.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                <FiArrowLeft className="mr-2" /> Back
              </button>
            ) : (
              <div></div>
            )}

            {step < 3 ? (
              <button
                type="button"
                onClick={next}
                className="flex items-center px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg"
              >
                Next <FiArrowRight className="ml-2" />
              </button>
            ) : (
              <button
                type="submit"
                disabled={uploading}
                className={`flex items-center px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg ${
                  uploading ? "opacity-70 cursor-not-allowed" : ""
                }`}
              >
                {uploading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Creating...
                  </>
                ) : (
                  "Create Gig"
                )}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateGig;