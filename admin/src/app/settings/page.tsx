"use client";

import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui";
import { useAuth } from "@/context/AuthContext";
import { fetchAdminProfile, updateAdminProfile } from "@/services/admin";
import { validateFile } from "@/utils/fileValidation";
import { useToast } from "@/hooks/useToast";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";

export default function SettingsPage() {
  const { token, refreshProfile } = useAuth();
  const toast = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [isEditingPersonalInfo, setIsEditingPersonalInfo] = useState(false);
  const [isEditingBio, setIsEditingBio] = useState(false);
  const [isEditingLocation, setIsEditingLocation] = useState(false);

  const [personalInfo, setPersonalInfo] = useState({
    name: "",
    email: "",
    phone: "",
  });
  const [isEditingAboutInfo, setIsEditingAboutlInfo] = useState(false);
  const [aboutInfo, setAboutInfo] = useState({
    yearsOfExperinces: 0,
    totalSoldProperties: 0,
    locations: 0
  })
  const [location, setLocation] = useState("");
  const [bio, setBio] = useState("");
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [profileImageFile, setProfileImageFile] = useState<File | null>(null);
  const [isSavingProfileImage, setIsSavingProfileImage] = useState(false);

  // Fetch admin profile on mount
  useEffect(() => {
    const loadAdminProfile = async () => {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const response = await fetchAdminProfile(token);
        if (response.success && response.data) {
          const admin = response.data;
          setPersonalInfo({
            name: admin.name || "",
            email: admin.email || "",
            phone: admin.phone || "",
          });
          setAboutInfo({
            locations: admin.locations || 0,
            yearsOfExperinces: admin.yearsOfExperinces || 0,
            totalSoldProperties: admin.totalSoldProperties || 0
          })
          setLocation(admin.location || "");
          setBio(admin.bio || "");
          setProfileImage(admin.profileImage || null);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load profile");
      } finally {
        setLoading(false);
      }
    };

    loadAdminProfile();
  }, [token]);

  const handlePersonalInfoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPersonalInfo((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAboutInfoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setAboutInfo((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSavePersonalInfo = async () => {
    if (!token) return;

    // Validation - name and email are required
    if (!personalInfo.name.trim() || !personalInfo.email.trim()) {
      setError("Name and email are required fields");
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(personalInfo.email)) {
      setError("Please enter a valid email address");
      return;
    }

    try {
      setSaving(true);
      setError(null);
      setSuccess(null);

      const response = await updateAdminProfile(token, {
        name: personalInfo.name.trim(),
        email: personalInfo.email.trim(),
        phone: personalInfo.phone.trim() || undefined,
        location: location.trim() || undefined,
        bio: bio.trim() || undefined,
        profileImage: profileImageFile,
        yearsOfExperinces: aboutInfo.yearsOfExperinces,
        totalSoldProperties: aboutInfo.totalSoldProperties,
        locations: aboutInfo.locations

      });

      if (response.success) {
        const successMessage = "Profile updated successfully!";
        setSuccess(successMessage);
        toast.success(successMessage);
        setIsEditingPersonalInfo(false);
        setIsEditingBio(false);
        setIsEditingLocation(false);
        setProfileImageFile(null);
        setIsEditingAboutlInfo(false)
        // Update profile image if it was uploaded
        if (response.data.profileImage) {
          setProfileImage(response.data.profileImage);
        }
        // Refresh profile in AuthContext to update Navbar immediately
        setTimeout(async () => {
          await refreshProfile();
        }, 500); // Small delay to ensure backend has processed the update
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to update profile";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setSaving(false);
    }
  };

  const handleSaveBio = async () => {
    await handleSavePersonalInfo();
  };

  const handleSaveLocation = async () => {
    await handleSavePersonalInfo();
  };

  const handleCancelLocation = () => {
    setIsEditingLocation(false);
  };

  const handleProfileImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) {
      return;
    }

    // Validate file using the validation utility
    const validationResult = validateFile(file, ['image']);

    if (!validationResult.isValid) {
      setError(validationResult.error || "Invalid file");
      toast.error(validationResult.error || "Invalid file");
      // Reset input
      e.target.value = '';
      return;
    }

    // Clear any previous errors
    setError(null);
    setSuccess(null);

    // Set the file immediately
    setProfileImageFile(file);

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      if (reader.result) {
        setProfileImage(reader.result as string);
        toast.info("Image selected. Click 'Save Photo' to upload.");
      }
    };
    reader.onerror = () => {
      setError("Failed to read image file");
      toast.error("Failed to read image file");
      setProfileImageFile(null);
    };
    reader.readAsDataURL(file);
  };

  const handleSaveProfileImage = async () => {
    if (!token) return;

    if (!profileImageFile) {
      setError("Please select an image to upload");
      return;
    }

    try {
      setIsSavingProfileImage(true);
      setError(null);
      setSuccess(null);

      const response = await updateAdminProfile(token, {
        name: personalInfo.name.trim(),
        email: personalInfo.email.trim(),
        phone: personalInfo.phone.trim() || undefined,
        location: location.trim() || undefined,
        bio: bio.trim() || undefined,
        profileImage: profileImageFile,
        yearsOfExperinces: aboutInfo.yearsOfExperinces,
        totalSoldProperties: aboutInfo.totalSoldProperties,
        locations: aboutInfo.locations

      });

      if (response.success) {
        const successMessage = "Profile image updated successfully!";
        setSuccess(successMessage);
        toast.success(successMessage);
        setProfileImageFile(null);
        // Update profile image URL
        if (response.data.profileImage) {
          setProfileImage(response.data.profileImage);
        }
        // Refresh profile in AuthContext to update Navbar immediately
        setTimeout(async () => {
          await refreshProfile();
        }, 500); // Small delay to ensure backend has processed the update
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to update profile image";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsSavingProfileImage(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-ivory py-10 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
        <LoadingSpinner text="Loading profile..." size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone/25 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-charcoal mb-8">Settings</h1>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
            {error}
          </div>
        )}

        {/* Success Message */}
        {success && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg text-green-700">
            {success}
          </div>
        )}

        {/* Profile Picture Section */}
        <div className="bg-ivory rounded-lg p-6 mb-6">
          <div className="flex items-center gap-6">
            <div className="relative w-32 h-32 rounded-full bg-teal-200 flex items-center justify-center flex-shrink-0 overflow-hidden">
              {profileImage ? (
                <img
                  src={profileImage}
                  alt="Profile"
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                <svg
                  className="w-16 h-16 text-teal-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
              )}
              {/* Loading Overlay */}
              {isSavingProfileImage && (
                <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center">
                  <div className="w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
                </div>
              )}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <button
                  type="button"
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors font-medium"
                  onClick={() => document.getElementById("profile-upload")?.click()}
                >
                  {profileImageFile ? "Change Photo" : "Upload New Photo"}
                </button>
                {profileImageFile && (
                  <button
                    type="button"
                    onClick={handleSaveProfileImage}
                    disabled={isSavingProfileImage}
                    className="px-4 py-2 bg-charcoal text-white rounded-lg hover:bg-charcoal/90 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSavingProfileImage ? "Saving..." : "Save Photo"}
                  </button>
                )}
              </div>
              <input
                id="profile-upload"
                type="file"
                accept="image/jpeg,image/png,image/jpg,image/webp"
                className="hidden"
                onChange={handleProfileImageChange}
                onClick={(e) => {
                  // Reset value so onChange fires even if same file is selected
                  (e.target as HTMLInputElement).value = '';
                }}
              />
              <p className="text-sm text-gray-500">At least 800x800 recommended</p>
              <p className="text-sm text-gray-500">JPG, PNG, or WEBP only (Max 10MB)</p>
              {profileImageFile && (
                <p className="text-sm text-charcoal font-medium mt-1">
                  New image selected. Click "Save Photo" to update.
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Personal Info Section */}
        <div className="bg-ivory rounded-lg p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-charcoal">Personal Info</h2>
            {!isEditingPersonalInfo ? (
              <button
                type="button"
                onClick={() => setIsEditingPersonalInfo(true)}
                className="px-4 py-2 bg-charcoal text-white rounded-lg hover:bg-charcoal/90 transition-colors font-medium"
              >
                Edit
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSavePersonalInfo}
                disabled={saving}
                className="px-4 py-2 bg-charcoal text-white rounded-lg hover:bg-charcoal/90 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saving ? "Saving..." : "Save"}
              </button>
            )}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm text-gray-500 mb-1">
                Full Name <span className="text-red-500">*</span>
              </label>
              {isEditingPersonalInfo ? (
                <Input
                  name="name"
                  value={personalInfo.name}
                  onChange={handlePersonalInfoChange}
                  className="w-full"
                  required
                />
              ) : (
                <p className="text-base font-semibold text-gray-700">
                  {personalInfo.name || "Not set"}
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm text-gray-500 mb-1">
                Email <span className="text-red-500">*</span>
              </label>
              {isEditingPersonalInfo ? (
                <Input
                  name="email"
                  type="email"
                  value={personalInfo.email}
                  onChange={handlePersonalInfoChange}
                  className="w-full"
                  required
                />
              ) : (
                <p className="text-base font-semibold text-gray-700">
                  {personalInfo.email || "Not set"}
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm text-gray-500 mb-1">Phone</label>
              {isEditingPersonalInfo ? (
                <Input
                  name="phone"
                  value={personalInfo.phone}
                  onChange={handlePersonalInfoChange}
                  className="w-full"
                  placeholder="Optional"
                />
              ) : (
                <p className="text-base font-semibold text-gray-700">
                  {personalInfo.phone || "Not set"}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* About Info Section */}
        <div className="bg-ivory rounded-lg p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-charcoal">About Info</h2>
            {!isEditingAboutInfo ? (
              <button
                type="button"
                onClick={() => setIsEditingAboutlInfo(true)}
                className="px-4 py-2 bg-charcoal text-white rounded-lg hover:bg-charcoal/90 transition-colors font-medium"
              >
                Edit
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSavePersonalInfo}
                disabled={saving}
                className="px-4 py-2 bg-charcoal text-white rounded-lg hover:bg-charcoal/90 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saving ? "Saving..." : "Save"}
              </button>
            )}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm text-gray-500 mb-1">
                Years Of Experince <span className="text-red-500">*</span>
              </label>
              {isEditingAboutInfo ? (
                <Input
                  name="yearsOfExperinces"
                  type="number"
                  value={aboutInfo.yearsOfExperinces}
                  onChange={handleAboutInfoChange}
                  className="w-full"
                  required
                />
              ) : (
                <p className="text-base font-semibold text-gray-700">
                  {aboutInfo.yearsOfExperinces || "Not set"}
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm text-gray-500 mb-1">
                Total Properties <span className="text-red-500">*</span>
              </label>
              {isEditingAboutInfo ? (
                <Input
                  name="totalSoldProperties"
                  type="number"
                  value={aboutInfo.totalSoldProperties}
                  onChange={handleAboutInfoChange}
                  className="w-full"
                  required
                />
              ) : (
                <p className="text-base font-semibold text-gray-700">
                  {aboutInfo.totalSoldProperties || "Not set"}
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm text-gray-500 mb-1">No. of Locations</label>
              {isEditingAboutInfo ? (
                <Input
                  name="locations"
                  type="number"
                  value={aboutInfo.locations}
                  onChange={handleAboutInfoChange}
                  className="w-full"
                  placeholder="Optional"
                />
              ) : (
                <p className="text-base font-semibold text-gray-700">
                  {aboutInfo.locations || "Not set"}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Location Section */}
        <div className="bg-ivory rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold text-charcoal mb-4">Location</h2>
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <Input
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Enter location (optional)"
                onFocus={() => setIsEditingLocation(true)}
              />
            </div>
            {isEditingLocation && (
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={handleCancelLocation}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSaveLocation}
                  disabled={saving}
                  className="px-4 py-2 bg-charcoal text-white rounded-lg hover:bg-charcoal/90 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {saving ? "Saving..." : "Save Changes"}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Bio Section */}
        <div className="bg-ivory rounded-lg p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-charcoal">Bio</h2>
            {!isEditingBio ? (
              <button
                type="button"
                onClick={() => setIsEditingBio(true)}
                className="px-4 py-2 bg-charcoal text-white rounded-lg hover:bg-charcoal/90 transition-colors font-medium"
              >
                Edit
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSaveBio}
                disabled={saving}
                className="px-4 py-2 bg-charcoal text-white rounded-lg hover:bg-charcoal/90 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saving ? "Saving..." : "Save"}
              </button>
            )}
          </div>
          {isEditingBio ? (
            <div>
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#002F45] focus:border-transparent min-h-[100px]"
                placeholder="Enter your bio (optional, max 1000 characters)"
                maxLength={1000}
              />
              {bio.length > 0 && (
                <p className="mt-1 text-xs text-gray-500">{bio.length}/1000 characters</p>
              )}
            </div>
          ) : (
            <p className="text-base text-gray-700 leading-relaxed">{bio || "No bio added yet"}</p>
          )}
        </div>

        {/* Looking for something else? Section */}
        <div className="bg-ivory rounded-lg p-6">
          <h2 className="text-xl font-semibold text-charcoal mb-4">
            Looking for something else?
          </h2>
          <div className="space-y-3">
            <button
              type="button"
              className="w-full flex items-center justify-between p-4 bg-white rounded-lg hover:bg-gray-50 transition-colors text-left"
            >
              <div className="flex items-center gap-3">
                <svg
                  className="w-5 h-5 text-charcoal"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
                <span className="text-gray-700 font-medium">
                  Search Mary Homes Account
                </span>
              </div>
              <svg
                className="w-5 h-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>

            <button
              type="button"
              className="w-full flex items-center justify-between p-4 bg-white rounded-lg hover:bg-gray-50 transition-colors text-left"
            >
              <div className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full border-2 border-[#002F45] flex items-center justify-center">
                  <span className="text-charcoal text-xs font-bold">?</span>
                </div>
                <span className="text-gray-700 font-medium">See Help Options</span>
              </div>
              <svg
                className="w-5 h-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>

            <button
              type="button"
              className="w-full flex items-center justify-between p-4 bg-white rounded-lg hover:bg-gray-50 transition-colors text-left"
            >
              <div className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full border-2 border-[#002F45] flex items-center justify-center">
                  <span className="text-charcoal text-xs font-bold">!</span>
                </div>
                <span className="text-gray-700 font-medium">Send Feedback</span>
              </div>
              <svg
                className="w-5 h-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

