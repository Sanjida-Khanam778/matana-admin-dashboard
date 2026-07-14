import React from "react";
import { useGetPlatformPrivacyPolicyQuery } from "../../Api/dashboardApi";

const PrivacyPolicy = () => {
  const { data, isLoading, error } = useGetPlatformPrivacyPolicyQuery();
  const content = data?.content || "";

  return (
    <div className="bg-gray-50 min-h-screen py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-4xl mx-auto bg-white p-8 md:p-12 shadow-sm rounded-2xl">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-gray-900 tracking-tight">
            Privacy Policy
          </h1>
        </div>

        {isLoading && (
          <div className="text-center text-gray-600">Loading...</div>
        )}

        {error && (
          <div className="text-center text-red-500">
            Failed to load Privacy Policy
          </div>
        )}

        {!isLoading && !error && content && (
          <div
            className="prose prose-blue max-w-none text-gray-700 leading-relaxed"
            dangerouslySetInnerHTML={{ __html: content }}
          />
        )}

        {!isLoading && !error && !content && (
          <div className="text-center text-gray-500">
            Privacy policy content is not available.
          </div>
        )}

        <div className="mt-12 text-center text-gray-500 text-sm border-t pt-8">
          &copy; {new Date().getFullYear()} O-Ber Aruba. All rights reserved.
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
