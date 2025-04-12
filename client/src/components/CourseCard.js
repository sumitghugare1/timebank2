import React from "react";

const CourseCard = ({ course }) => {
  return (
    <div className="bg-white shadow-lg rounded-lg overflow-hidden transform transition-all duration-300 hover:shadow-xl hover:scale-105">
      {course.thumbnail ? (
        <img
          src={course.thumbnail}
          alt={course.name}
          className="w-full h-48 object-cover"
        />
      ) : (
        <div className="w-full h-48 bg-gradient-to-br from-primary-500 to-secondary-600 flex items-center justify-center">
          <span className="text-4xl font-bold text-white">{course.name.charAt(0)}</span>
        </div>
      )}
      <div className="p-5 space-y-3">
        <div className="flex justify-between items-center">
          <h4 className="text-xl font-semibold text-gray-800">{course.name}</h4>
          <span className="bg-primary-100 text-primary-700 px-2 py-1 rounded-full text-sm font-medium">
            {course.timeCreditValue} credits
          </span>
        </div>
        <p className="text-gray-600 text-sm line-clamp-2">{course.description}</p>
        <div className="pt-3 border-t border-gray-100 flex justify-between items-center">
          <p className="text-sm text-gray-500">
            <span className="font-medium">{course.availableHours}</span> hours available
          </p>
          <div className="flex items-center text-sm text-gray-600">
            <span className="flex-shrink-0 rounded-full overflow-hidden bg-gray-100 h-6 w-6 flex items-center justify-center">
              {course.user?.name?.charAt(0) || "?"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseCard;