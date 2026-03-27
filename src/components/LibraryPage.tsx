import { useState } from "react";
import { Search, Settings, Clock } from "lucide-react";

const filters = ["All", "Eyes", "Jawline", "Cheeks", "Forehead", "Neck"];

const categories = [
  {
    title: "Eyes & Upper Face",
    routines: [
      {
        image: "https://images.pexels.com/photos/4465121/pexels-photo-4465121.jpeg?auto=compress&cs=tinysrgb&w=400",
        difficulty: "Beginner",
        name: "Orbital Lift",
        duration: "8 min",
      },
      {
        image: "https://images.pexels.com/photos/5483244/pexels-photo-5483244.jpeg?auto=compress&cs=tinysrgb&w=400",
        difficulty: "Advanced",
        name: "Brow Smoother",
        duration: "12 min",
      },
    ],
  },
  {
    title: "Jawline & Structure",
    routines: [
      {
        image: "https://images.pexels.com/photos/5938367/pexels-photo-5938367.jpeg?auto=compress&cs=tinysrgb&w=400",
        difficulty: "Intermediate",
        name: "Sculpt & Define",
        duration: "15 min",
      },
      {
        image: "https://images.pexels.com/photos/5128057/pexels-photo-5128057.jpeg?auto=compress&cs=tinysrgb&w=400",
        difficulty: "Beginner",
        name: "Neck Tension Release",
        duration: "10 min",
      },
    ],
  },
  {
    title: "Cheeks & Glow",
    routines: [
      {
        image: "https://images.pexels.com/photos/6621245/pexels-photo-6621245.jpeg?auto=compress&cs=tinysrgb&w=400",
        difficulty: "Intermediate",
        name: "Apple Lift",
        duration: "7 min",
      },
      {
        image: "https://images.pexels.com/photos/6663292/pexels-photo-6663292.jpeg?auto=compress&cs=tinysrgb&w=400",
        difficulty: "Beginner",
        name: "Morning Glow",
        duration: "5 min",
      },
    ],
  },
];

const LibraryPage = () => {
  const [activeFilter, setActiveFilter] = useState("All");
  const [searchValue, setSearchValue] = useState("");

  const filteredCategories = categories
    .map((cat) => ({
      ...cat,
      routines: cat.routines.filter(
        (r) => !searchValue || r.name.toLowerCase().includes(searchValue.toLowerCase())
      ),
    }))
    .filter((cat) => {
      if (activeFilter === "All") return cat.routines.length > 0;
      return cat.title.toLowerCase().includes(activeFilter.toLowerCase()) && cat.routines.length > 0;
    });

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <header className="px-6 pt-8 pb-4 sticky top-0 bg-background/90 backdrop-blur-xl z-40">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold tracking-tight">Library</h1>
          <button className="bg-transparent border-none cursor-pointer text-foreground p-1">
            <Settings className="w-6 h-6" />
          </button>
        </div>

        {/* Search */}
        <div className="bg-surface rounded-lg px-4 py-3 flex items-center gap-2.5 mb-4">
          <Search className="w-[18px] h-[18px] text-muted-foreground" />
          <input
            type="text"
            placeholder="Search routines..."
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            className="border-none bg-transparent text-sm text-foreground w-full outline-none placeholder:text-muted-foreground font-sans"
          />
        </div>

        {/* Filter Chips */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
          {filters.map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-4 py-2 rounded-full text-[13px] font-medium whitespace-nowrap transition-all cursor-pointer border-none ${
                activeFilter === filter
                  ? "bg-primary text-primary-foreground"
                  : "bg-surface-elevated text-muted-foreground hover:bg-surface-hover"
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
      </header>

      {/* Grid */}
      <div className="px-6 pb-8">
        {filteredCategories.map((category, idx) => (
          <div key={idx} className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-foreground">{category.title}</h2>
              <span className="text-[13px] text-primary font-semibold cursor-pointer">See all</span>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {category.routines.map((routine, i) => (
                <div
                  key={i}
                  className="bg-card rounded-lg overflow-hidden shadow-sm cursor-pointer group relative"
                >
                  <img
                    src={routine.image}
                    alt={routine.name}
                    className="w-full h-[120px] object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-2 left-2">
                    <span className="text-[9px] uppercase font-bold px-1.5 py-0.5 rounded bg-card/90 text-foreground tracking-wide">
                      {routine.difficulty}
                    </span>
                  </div>
                  <div className="p-3">
                    <h3 className="text-sm font-semibold mb-1 text-foreground">{routine.name}</h3>
                    <div className="text-[11px] text-muted-foreground flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {routine.duration}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LibraryPage;
