import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { useParams, useNavigate, Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import {
  useGetPackageQuery,
  useUpdatePackageMutation,
} from "../../Api/authApi";

export default function EditPackage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data, isLoading: isFetching } = useGetPackageQuery(id);
  const [updatePackage, { isLoading }] = useUpdatePackageMutation();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [recurring, setRecurring] = useState(false);
  const [amount, setAmount] = useState("");
  const [billingInterval, setBillingInterval] = useState("month");
  const [status, setStatus] = useState("active");
  const [intervalCount, setIntervalCount] = useState(1);

  useEffect(() => {
    if (data) {
      setName(data.name || "");
      setDescription(data.description || "");
      setRecurring(data.recurring || false);
      setAmount(data.amount !== undefined ? data.amount : "");
      setBillingInterval(data.billing_interval || "month");
      setStatus(data.status || "active");
      setIntervalCount(
        data.interval_count !== undefined ? data.interval_count : 1
      );
    }
  }, [data]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (
      !name.trim() ||
      !description.trim() ||
      !amount.toString().trim() ||
      !billingInterval.trim() ||
      !status.trim()
    ) {
      toast.error("Please fill all required fields correctly!");
      return;
    }
    try {
      await updatePackage({
        id,
        data: {
          name: name.trim(),
          description: description.trim(),
          recurring,
          amount: parseFloat(amount),
          billing_interval: billingInterval,
          interval_count: parseInt(intervalCount),
          status: status,
        },
      }).unwrap();
      toast.success("Package updated successfully!");
      setIntervalCount(1);
      navigate("/subscription");
    } catch (error) {
      toast.error(
        error?.data?.message || error.error || "Failed to update package"
      );
    }
  };

  const handleCancel = () => {
    navigate("/subscription");
  };

  if (isFetching) {
    return <div className="px-32 py-10 bg-white">Loading...</div>;
  }

  return (
    <div className="px-32 py-10 bg-white">
      <div className="flex items-center mb-8">
        <Link to={"/subscription"}>
          <ArrowLeft className="w-6 h-6 text-gray-600 mr-4 cursor-pointer" />
        </Link>
        <h1 className="text-2xl font-semibold text-gray-900">Edit Package</h1>
      </div>
      <form className="space-y-6" onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Name *
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              maxLength={255}
              minLength={1}
              placeholder="Package Name"
              className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Amount (in dollars) *
            </label>
            <input
              type="number"
              step="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="e.g. 30.00"
              className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Status *
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            >
              <option value="active">Active</option>
              <option value="hold">Hold</option>
            </select>
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Description *
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            minLength={1}
            placeholder="Description"
            rows={6}
            className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
            required
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Billing Interval *
            </label>
            <select
              value={billingInterval}
              onChange={(e) => setBillingInterval(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            >
              <option value="month">Monthly</option>
              {/* <option value="6 months">6 Monthly</option> */}
              <option value="year">Yearly</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Interval Count*
            </label>
            <input
              type="number"
              min="1"
              step="1"
              value={intervalCount}
              onChange={(e) => setIntervalCount(e.target.value)}
              placeholder="e.g. 1"
              className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
        </div>
        <div className="flex gap-4 pt-6">
          <button
            type="submit"
            disabled={isLoading}
            className="px-8 py-2 bg-primary text-white rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors disabled:opacity-50"
          >
            {isLoading ? "Updating..." : "Update"}
          </button>
          <button
            type="button"
            onClick={handleCancel}
            className="px-8 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
