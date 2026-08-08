import { useState } from "react";
import { AlertTriangle } from "lucide-react";
import UploadBox from "./UploadBox";

export default function BusinessDetailsFields({
  name,
  setName,
  description,
  setDescription,
  cats,
  toggleCat,
  categoriesData,
  catsLoading,
  contactName,
  setContactName,
  contactPhone,
  setContactPhone,
  contactEmail,
  setContactEmail,
  city,
  setCity,
  communities,
  businessAddress,
  setBusinessAddress,
  businessPhone,
  setBusinessPhone,
  businessHours,
  setBusinessHours,
  servingAreas,
  setServingAreas,
  instagram,
  setInstagram,
  facebook,
  setFacebook,
  otherSocialLink,
  setOtherSocialLink,
  servicesTags,
  setServicesTags,
  website,
  setWebsite,
  plan,
  planMeta,
  descOverLimit,
  galleryFiles,
  handleAddGallery,
  handleRemoveGallery,
  galleryWarning,
  promoVideoLink,
  setPromoVideoLink,
  flyerFiles,
  setFlyerFiles,
  bannerFiles,
  setBannerFiles,
  submitError,
  handleSubmit,
  submitting,
  uploadingImages,
  tokenizing,
  inputCls,
}) {
  return (
    <>
      <div>
        <label className="block text-[13px] font-semibold mb-1.5">
          Business Name <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          placeholder="Enter your business name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className={inputCls}
        />
      </div>

      <div>
        <label className="block text-[13px] font-semibold mb-2.5">
          Categories <span className="text-red-500">*</span>
        </label>
        <div className="flex flex-wrap gap-2 mb-1.5">
          {catsLoading && (
            <div className="w-full h-8 rounded-full bg-gray-100 animate-pulse" />
          )}
          {(categoriesData ?? []).map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => toggleCat(cat)}
              className={`px-4 py-2 rounded-full text-[12.5px] border-[1.5px] transition-colors ${
                cats.some((c) => c.id === cat.id)
                  ? "bg-green-900 border-green-900 text-white"
                  : "bg-white border-gray text-gray-900 hover:border-green-300"
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
        <div className="text-[11.5px] text-gray-500">Select all that apply</div>
      </div>

      <div className="grid md:grid-cols-2 gap-5">
        <div>
          <label className="block text-[13px] font-semibold mb-1.5">
            Contact name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            placeholder="Who should we reach out to?"
            value={contactName}
            onChange={(e) => setContactName(e.target.value)}
            className={inputCls}
          />
        </div>
        <div>
          <label className="block text-[13px] font-semibold mb-1.5">
            Contact phone <span className="text-red-500">*</span>
          </label>
          <input
            type="tel"
            placeholder="(000) 000-0000"
            value={contactPhone}
            onChange={(e) => setContactPhone(e.target.value)}
            className={inputCls}
          />
          <div className="text-[11.5px] text-gray-500 mt-1">
            For internal use only, will not be shown publicly
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-5">
        <div>
          <label className="block text-[13px] font-semibold mb-1.5">
            Email <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            placeholder="you@business.com"
            value={contactEmail}
            onChange={(e) => setContactEmail(e.target.value)}
            className={inputCls}
          />
        </div>
        <div>
          <label className="block text-[13px] font-semibold mb-1.5">
            City <span className="text-red-500">*</span>
          </label>
          <select
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className={`${inputCls} appearance-none cursor-pointer pr-10`}
          >
            <option value="">Select a city</option>
            {(communities ?? []).map((com) => (
              <option key={com.id} value={com.id}>
                {com.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-5">
        <div>
          <label className="block text-[13px] font-semibold mb-1.5">
            Business address <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            placeholder="Street address"
            value={businessAddress}
            onChange={(e) => setBusinessAddress(e.target.value)}
            className={inputCls}
          />
        </div>
        <div>
          <label className="block text-[13px] font-semibold mb-1.5">
            Business whatsapp number <span className="text-red-500">*</span>
          </label>
          <input
            type="tel"
            placeholder="(000) 000-0000"
            value={businessPhone}
            onChange={(e) => setBusinessPhone(e.target.value)}
            className={inputCls}
          />
          <div className="text-[11.5px] text-gray-500 mt-1">
            This number will be shown publicly
          </div>
        </div>
      </div>

      <div>
        <label className="block text-[13px] font-semibold mb-1.5">Business hours</label>
        <div className="bg-stone-50/80 p-4 rounded-xl border border-stone-200/80 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[12px] text-gray-500 font-medium">Selected Hours:</span>
            <span className="text-xs font-semibold text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full">
              {businessHours || "Not set"}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-2.5 pt-1">
            <div>
              <label className="text-[11px] font-medium text-stone-500 mb-1 block">Start Day</label>
              <select
                onChange={(e) => {
                  const sDay = e.target.value;
                  const currentParts = (businessHours || "Mon - Fri: 9:00 AM - 6:00 PM").split(":");
                  const timePart = currentParts[1] || " 9:00 AM - 6:00 PM";
                  const dayParts = (currentParts[0] || "Mon - Fri").split("-");
                  const endShort = dayParts[1]?.trim() || "Fri";
                  const startShort = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"][["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].indexOf(sDay)] || sDay.slice(0, 3);
                  setBusinessHours(`${startShort} - ${endShort}:${timePart}`);
                }}
                className="w-full rounded-lg border border-stone-200 bg-white px-2.5 py-2 text-xs text-stone-800 outline-none focus:border-emerald-600"
              >
                {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map((d) => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-[11px] font-medium text-stone-500 mb-1 block">End Day</label>
              <select
                onChange={(e) => {
                  const eDay = e.target.value;
                  const currentParts = (businessHours || "Mon - Fri: 9:00 AM - 6:00 PM").split(":");
                  const timePart = currentParts[1] || " 9:00 AM - 6:00 PM";
                  const dayParts = (currentParts[0] || "Mon - Fri").split("-");
                  const startShort = dayParts[0]?.trim() || "Mon";
                  if (eDay === "None") {
                    setBusinessHours(`${startShort}:${timePart}`);
                  } else {
                    const endShort = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"][["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].indexOf(eDay)] || eDay.slice(0, 3);
                    setBusinessHours(`${startShort} - ${endShort}:${timePart}`);
                  }
                }}
                className="w-full rounded-lg border border-stone-200 bg-white px-2.5 py-2 text-xs text-stone-800 outline-none focus:border-emerald-600"
              >
                <option value="None">Same Day Only</option>
                {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map((d) => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-[11px] font-medium text-stone-500 mb-1 block">Opening Time</label>
              <select
                onChange={(e) => {
                  const open = e.target.value;
                  const currentParts = (businessHours || "Mon - Fri: 9:00 AM - 6:00 PM").split(":");
                  const dayPart = currentParts[0] || "Mon - Fri";
                  const times = (currentParts[1] || "").split("-");
                  const closePart = times[1]?.trim() || "6:00 PM";
                  if (open === "Open 24 Hours") {
                    setBusinessHours(`${dayPart}: Open 24 Hours`);
                  } else {
                    setBusinessHours(`${dayPart}: ${open} - ${closePart}`);
                  }
                }}
                className="w-full rounded-lg border border-stone-200 bg-white px-2.5 py-2 text-xs text-stone-800 outline-none focus:border-emerald-600"
              >
                {["6:00 AM", "6:30 AM", "7:00 AM", "7:30 AM", "8:00 AM", "8:30 AM", "9:00 AM", "9:30 AM", "10:00 AM", "10:30 AM", "11:00 AM", "11:30 AM", "12:00 PM", "12:30 PM", "1:00 PM", "1:30 PM", "2:00 PM", "2:30 PM", "3:00 PM", "3:30 PM", "4:00 PM", "4:30 PM", "5:00 PM", "5:30 PM", "6:00 PM", "6:30 PM", "7:00 PM", "7:30 PM", "8:00 PM", "8:30 PM", "9:00 PM", "9:30 PM", "10:00 PM", "10:30 PM", "11:00 PM", "11:30 PM", "12:00 AM", "Open 24 Hours"].map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-[11px] font-medium text-stone-500 mb-1 block">Closing Time</label>
              <select
                onChange={(e) => {
                  const close = e.target.value;
                  const currentParts = (businessHours || "Mon - Fri: 9:00 AM - 6:00 PM").split(":");
                  const dayPart = currentParts[0] || "Mon - Fri";
                  const times = (currentParts[1] || "").split("-");
                  const openPart = times[0]?.trim() || "9:00 AM";
                  if (close === "Closed") {
                    setBusinessHours(`${dayPart}: Closed`);
                  } else if (close === "Open 24 Hours") {
                    setBusinessHours(`${dayPart}: Open 24 Hours`);
                  } else {
                    setBusinessHours(`${dayPart}: ${openPart} - ${close}`);
                  }
                }}
                className="w-full rounded-lg border border-stone-200 bg-white px-2.5 py-2 text-xs text-stone-800 outline-none focus:border-emerald-600"
              >
                {["4:00 PM", "4:30 PM", "5:00 PM", "5:30 PM", "6:00 PM", "6:30 PM", "7:00 PM", "7:30 PM", "8:00 PM", "8:30 PM", "9:00 PM", "9:30 PM", "10:00 PM", "10:30 PM", "11:00 PM", "11:30 PM", "12:00 AM", "Closed", "Open 24 Hours"].map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      <div>
        <label className="block text-[13px] font-semibold mb-1.5">
          Serving areas{" "}
          <span className="text-gray-500 font-normal text-[12px]">optional</span>
        </label>
        <input
          type="text"
          placeholder="e.g. New York, New Jersey"
          value={servingAreas}
          onChange={(e) => setServingAreas(e.target.value)}
          className={inputCls}
        />
      </div>

      <div className="grid md:grid-cols-2 gap-5">
        <div>
          <label className="block text-[13px] font-semibold mb-1.5">Instagram</label>
          <input
            type="text"
            placeholder="@yourbusiness"
            value={instagram}
            onChange={(e) => setInstagram(e.target.value)}
            className={inputCls}
          />
        </div>
        <div>
          <label className="block text-[13px] font-semibold mb-1.5">Facebook</label>
          <input
            type="text"
            placeholder="facebook.com/yourbusiness"
            value={facebook}
            onChange={(e) => setFacebook(e.target.value)}
            className={inputCls}
          />
        </div>
      </div>

      <div>
        <label className="block text-[13px] font-semibold mb-1.5">Uber Eats link</label>
        <input
          type="text"
          value={otherSocialLink}
          onChange={(e) => setOtherSocialLink(e.target.value)}
          className={inputCls}
        />
      </div>

      <div>
        <label className="block text-[13px] font-semibold mb-1.5">Services / tags</label>
        <input
          type="text"
          placeholder="comma separated, e.g. Catering, Bar Mitzvah, Kosher"
          value={servicesTags}
          onChange={(e) => setServicesTags(e.target.value)}
          className={inputCls}
        />
        <div className="text-[11.5px] text-gray-500 mt-1">
          This helps people find you when searching for specific services
        </div>
      </div>

      <div>
        <label className="block text-[13px] font-semibold mb-1.5">Website</label>
        <input
          type="text"
          value={website}
          onChange={(e) => setWebsite(e.target.value)}
          className={inputCls}
        />
      </div>

      <div>
        <label className="block text-[13px] font-semibold mb-1.5">
          Description <span className="text-red-500">*</span>
        </label>
        <textarea
          placeholder="What do you offer? Who is it for?"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className={`w-full min-h-[90px] px-3.5 py-3 rounded-xl border-[1.5px] ${
            descOverLimit ? "border-red-400" : "border-gray"
          } bg-white text-[13.5px] placeholder-gray-400 focus:outline-none focus:border-green-800`}
        />
        <div
          className={`text-[11.5px] mt-1 text-right font-medium ${
            descOverLimit ? "text-red-500" : "text-gray-500"
          }`}
        >
          {description.length} / {planMeta.maxDescChars}
        </div>
        {descOverLimit && (
          <div className="flex items-start gap-1.5 mt-1 text-red-500 text-[11.5px]">
            <AlertTriangle className="w-3.5 h-3.5 flex-shrink-0 mt-px" />
            {planMeta.name} allows up to {planMeta.maxDescChars} characters. Please shorten your description or upgrade your plan.
          </div>
        )}
      </div>

      {plan === "featured" && (
        <div>
          <label className="block text-[13px] font-semibold mb-1.5">
            Photo gallery{" "}
            <span className="text-gray-500 font-normal text-[12px]">
              (up to 5 photos — {galleryFiles.length} / 5 added)
            </span>
          </label>
          <UploadBox
            label="Click to upload photos (JPG or PNG)"
            multiple
            files={galleryFiles}
            onAdd={handleAddGallery}
            onRemove={handleRemoveGallery}
            warning={galleryWarning}
          />
        </div>
      )}

      {plan === "premium" && (
        <>
          <div>
            <label className="block text-[13px] font-semibold mb-1.5">
              Photo gallery{" "}
              <span className="text-gray-500 font-normal text-[12px]">
                (up to 10 photos — {galleryFiles.length} / 10 added)
              </span>
            </label>
            <UploadBox
              label="Click to upload photos (JPG or PNG)"
              multiple
              files={galleryFiles}
              onAdd={handleAddGallery}
              onRemove={handleRemoveGallery}
              warning={galleryWarning}
            />
          </div>
          <div>
            <label className="block text-[13px] font-semibold mb-1.5">
              Promo video URL{" "}
              <span className="text-gray-500 font-normal text-[12px]">
                optional — YouTube, Vimeo, etc.
              </span>
            </label>
            <input
              type="url"
              placeholder="https://youtube.com/..."
              value={promoVideoLink}
              onChange={(e) => setPromoVideoLink(e.target.value)}
              className={inputCls}
            />
          </div>
        </>
      )}

      <div>
        <label className="block text-[13px] font-semibold mb-1.5">
          Flyer image <span className="text-red-500">*</span>
        </label>
        <UploadBox
          label="Click to upload your flyer (JPG or PNG)"
          files={flyerFiles}
          onAdd={(newFiles) => setFlyerFiles(newFiles.slice(0, 1))}
          onRemove={() => setFlyerFiles([])}
        />
      </div>

      <div>
        <label className="block text-[13px] font-semibold mb-1.5">
          Banner image
        </label>
        <UploadBox
          label="Click to upload your banner (JPG or PNG)"
          files={bannerFiles}
          onAdd={(newFiles) => setBannerFiles(newFiles.slice(0, 1))}
          onRemove={() => setBannerFiles([])}
        />
      </div>

      {submitError && (
        <div className="flex items-start gap-2 bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-[12.5px] text-red-700">
          <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" />
          <span>{submitError}</span>
        </div>
      )}

      <div className="flex justify-end pt-1">
        <button
          type="button"
          onClick={handleSubmit}
          disabled={submitting || uploadingImages || tokenizing || descOverLimit}
          className="bg-green-900 text-white px-7 py-3 rounded-full font-bold text-[13.5px] hover:bg-green-800 disabled:opacity-60 disabled:cursor-not-allowed transition-opacity"
        >
          {tokenizing
            ? "Securing card…"
            : uploadingImages
            ? "Uploading images…"
            : submitting
            ? "Submitting…"
            : "Submit Business"}
        </button>
      </div>
    </>
  );
}
