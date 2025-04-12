import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getSuggestions } from "../services/skillService";
import useSkillStore from "../store/skillStore";

const Suggestions = () => {
  const { suggestions, setSuggestions } = useSkillStore();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSuggestions = async () => {
      const data = await getSuggestions();
      setSuggestions(data);
    };
    fetchSuggestions();
  }, [setSuggestions]);

  if (suggestions.length === 0) {
    return null;
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <h2 className="text-xl font-bold text-gray-800 mb-4">Suggested Skills For You</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {suggestions.map((suggestion) => (
          <div 
            key={suggestion._id}
            className="bg-gray-50 rounded-lg p-4 border border-gray-200 cursor-pointer hover:bg-gray-100 transition-colors"
            onClick={() => navigate(`/course/${suggestion._id}`)}
          >
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center">
                {suggestion.name.charAt(0)}
              </div>
              <div>
                <h3 className="font-medium text-gray-800">{suggestion.name}</h3>
                <p className="text-xs text-gray-500">by {suggestion.user.name}</p>
              </div>
            </div>
            <p className="mt-2 text-sm text-gray-600 line-clamp-2">{suggestion.description}</p>
            <div className="mt-2 flex justify-between items-center">
              <span className="text-xs font-medium bg-primary-50 text-primary-700 px-2 py-1 rounded-full">
                {suggestion.timeCreditValue} credits
              </span>
              <span className="text-xs text-gray-500">{suggestion.availableHours} hours</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Suggestions;
