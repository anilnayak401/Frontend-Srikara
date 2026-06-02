import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, ArrowRight } from 'lucide-react';

const treatments = [
  'Ailments', 'Joint Replacement', 'Cardiac Care', 'Spine Surgery',
  'Cancer Treatment', 'Neurology', 'Gynecology', 'Urology', 'ENT', 'Diagnostics',
];

const departments = [
  'Select Departments', 'Orthopedics', 'Cardiology', 'Neurology',
  'Spine & Brain', 'Gynecology', 'Urology', 'ENT', 'Oncology',
  'Gastroenterology', 'Nephrology', 'Pediatrics', 'Diagnostics',
];

const tabs = ['Find Department & Doctors', 'Booking Assistance'];

export function DepartmentSearch() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(0);
  const [treatment, setTreatment] = useState(treatments[0]);
  const [department, setDepartment] = useState(departments[0]);

  const handleSearch = () => {
    const dept = department !== 'Select Departments' ? department : '';
    navigate(`/doctors${dept ? `?dept=${encodeURIComponent(dept)}` : ''}`);
  };

  return (
    <div className="bg-[#F5F5F5] border-b border-[#E2E8F0]">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-8">

        {/* Tabs */}
        <div className="flex gap-0 border-b border-[#E2E8F0]">
          {tabs.map((tab, i) => (
            <button
              key={i}
              onClick={() => setActiveTab(i)}
              className={`px-4 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm font-semibold transition-all relative ${
                activeTab === i
                  ? 'text-[#1A202C]'
                  : 'text-[#4A4A4A]/50 hover:text-[#4A4A4A]'
              }`}
            >
              {tab}
              {activeTab === i && (
                <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#1A202C] rounded-full" />
              )}
            </button>
          ))}
        </div>

        {/* Search bar */}
        <div className="py-3 sm:py-5 flex flex-col sm:flex-row items-stretch sm:items-end gap-3 sm:gap-4">
          {activeTab === 0 ? (
            <>
              {/* Row of dropdowns */}
              <div className="flex flex-row gap-2 sm:gap-4 w-full sm:w-auto flex-1">
                {/* Treatment dropdown */}
                <div className="flex flex-col gap-1 sm:gap-1.5 flex-1 sm:min-w-[180px]">
                  <label className="text-[10px] sm:text-xs font-semibold text-[#4A4A4A]/60 uppercase tracking-wider">Treatment</label>
                  <div className="relative">
                    <select
                      value={treatment}
                      onChange={e => setTreatment(e.target.value)}
                      className="w-full appearance-none bg-white border border-[#E2E8F0] rounded-full px-3 py-2 sm:px-5 sm:py-3 text-xs sm:text-sm font-medium text-[#1A202C] pr-8 sm:pr-10 focus:outline-none focus:border-[#8B1A4A] cursor-pointer"
                    >
                      {treatments.map(t => <option key={t}>{t}</option>)}
                    </select>
                    <span className="pointer-events-none absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 text-[#4A4A4A]/40 text-xs sm:text-sm">▾</span>
                  </div>
                </div>

                {/* Department dropdown */}
                <div className="flex flex-col gap-1 sm:gap-1.5 flex-1 sm:min-w-[200px]">
                  <label className="text-[10px] sm:text-xs font-semibold text-[#4A4A4A]/60 uppercase tracking-wider">Department</label>
                  <div className="relative">
                    <select
                      value={department}
                      onChange={e => setDepartment(e.target.value)}
                      className="w-full appearance-none bg-white border border-[#E2E8F0] rounded-full px-3 py-2 sm:px-5 sm:py-3 text-xs sm:text-sm font-medium text-[#1A202C] pr-8 sm:pr-10 focus:outline-none focus:border-[#8B1A4A] cursor-pointer"
                    >
                      {departments.map(d => <option key={d}>{d}</option>)}
                    </select>
                    <span className="pointer-events-none absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 text-[#4A4A4A]/40 text-xs sm:text-sm">▾</span>
                  </div>
                </div>
              </div>

              {/* Row of buttons */}
              <div className="flex flex-row items-center gap-3 sm:gap-4 w-full sm:w-auto justify-between sm:justify-start">
                {/* Search button */}
                <button
                  onClick={handleSearch}
                  className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 sm:gap-2 bg-[#6B2D8B] text-white px-5 py-2 sm:px-8 sm:py-3 rounded-full font-semibold text-xs sm:text-sm hover:bg-[#5a2475] transition-all shadow-sm whitespace-nowrap"
                >
                  <Search size={14} className="sm:w-4 sm:h-4" /> Search
                </button>

                {/* View all */}
                <button
                  onClick={() => navigate('/specialties')}
                  className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-[#1A202C] hover:text-[#8B1A4A] transition-colors whitespace-nowrap"
                >
                  View all Specialities
                  <span className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-[#1A202C] text-white flex items-center justify-center hover:bg-[#8B1A4A] transition-colors">
                    <ArrowRight size={12} className="sm:w-[14px] sm:h-[14px]" />
                  </span>
                </button>
              </div>
            </>
          ) : (
            /* Booking Assistance tab */
            <div className="flex flex-col sm:flex-row items-stretch sm:items-end gap-3 sm:gap-4 w-full">
              {/* Row of inputs */}
              <div className="flex flex-row gap-2 sm:gap-4 w-full sm:w-auto flex-1">
                <div className="flex flex-col gap-1 sm:gap-1.5 flex-1">
                  <label className="text-[10px] sm:text-xs font-semibold text-[#4A4A4A]/60 uppercase tracking-wider">Your Name</label>
                  <input
                    type="text"
                    placeholder="Enter your name"
                    className="w-full bg-white border border-[#E2E8F0] rounded-full px-3 py-2 sm:px-5 sm:py-3 text-xs sm:text-sm font-medium text-[#1A202C] focus:outline-none focus:border-[#8B1A4A]"
                  />
                </div>
                <div className="flex flex-col gap-1 sm:gap-1.5 flex-1">
                  <label className="text-[10px] sm:text-xs font-semibold text-[#4A4A4A]/60 uppercase tracking-wider">Phone Number</label>
                  <input
                    type="tel"
                    placeholder="+91 00000 00000"
                    className="w-full bg-white border border-[#E2E8F0] rounded-full px-3 py-2 sm:px-5 sm:py-3 text-xs sm:text-sm font-medium text-[#1A202C] focus:outline-none focus:border-[#8B1A4A]"
                  />
                </div>
              </div>
              
              <button
                onClick={() => navigate('/book')}
                className="flex items-center justify-center gap-1.5 sm:gap-2 bg-[#6B2D8B] text-white px-5 py-2 sm:px-8 sm:py-3 rounded-full font-semibold text-xs sm:text-sm hover:bg-[#5a2475] transition-all shadow-sm w-full sm:w-auto whitespace-nowrap"
              >
                <Search size={14} className="sm:w-4 sm:h-4" /> Book Now
              </button>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
