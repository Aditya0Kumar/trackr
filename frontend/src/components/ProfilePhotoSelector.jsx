import React, { useRef, useState } from "react";
import { FaCamera } from "react-icons/fa";
import { MdDelete } from "react-icons/md";

const ProfilePhotoSelector = ({ image, setImage }) => {
    const inputRef = useRef(null);
    const [previewUrl, setPreviewUrl] = useState(null);

    const handleImageChange = (event) => {
        const file = event.target.files[0];
        if (!file) return;

        setImage(file);
        setPreviewUrl(URL.createObjectURL(file));
    };

    const handleRemoveImage = () => {
        setImage(null);
        setPreviewUrl(null);
    };

    return (
        <div className="flex flex-col items-center">
            <div className="relative mb-4">
                <div
                    onClick={() => inputRef.current.click()}
                    className="
            w-24 h-24 rounded-full bg-gray-800 border border-gray-700
            flex items-center justify-center cursor-pointer overflow-hidden
            hover:border-gray-500 transition
          "
                >
                    {previewUrl ? (
                        <img
                            src={previewUrl}
                            alt="profile"
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <FaCamera className="text-gray-500 text-3xl" />
                    )}
                </div>

                {!image ? (
                    <button
                        type="button"
                        onClick={() => inputRef.current.click()}
                        className="absolute -bottom-2 -right-2 bg-gray-800 border border-gray-700 text-gray-300 p-2 rounded-full hover:bg-gray-700 transition"
                    >
                        <FaCamera className="text-xs" />
                    </button>
                ) : (
                    <button
                        type="button"
                        onClick={handleRemoveImage}
                        className="absolute -bottom-2 -right-2 bg-red-600 text-white p-2 rounded-full hover:bg-red-700 transition"
                    >
                        <MdDelete className="text-xs" />
                    </button>
                )}
            </div>

            <input
                type="file"
                ref={inputRef}
                className="hidden"
                accept="image/*"
                onChange={handleImageChange}
            />
        </div>
    );
};

export default ProfilePhotoSelector;
