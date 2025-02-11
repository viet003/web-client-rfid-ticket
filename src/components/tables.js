import { FaSort, FaSortUp, FaSortDown, FaSearch } from "react-icons/fa";
import { useState } from "react";
import Spinner from "./spinner";
import { getStatusColor } from "../ultils/color";

const Sectiontable = ({ isOpen, setIsOpen, data, isLoading, setIsLoading }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: null });
  const [searchTerm, setSearchTerm] = useState("");

  console.log(data);
  const itemsPerPage = 6;

  const handleSort = (key) => {
    let direction = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  const getSortedData = () => {
    if (!sortConfig.key) return data;

    return [...data].sort((a, b) => {
      let aValue, bValue;

      // Lấy giá trị cần sắp xếp tùy thuộc vào cột
      if (sortConfig.key === "user_name") {
        aValue = a.card.users[0]?.user_name || "";
        bValue = b.card.users[0]?.user_name || "";
      } else if (sortConfig.key === "type") {
        aValue = a.card?.type;
        bValue = b.card?.type;
      } else {
        aValue = a[sortConfig.key];
        bValue = b[sortConfig.key];
      }

      // Sắp xếp theo loại dữ liệu
      if (typeof aValue === "string") {
        return sortConfig.direction === "ascending"
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }
      return sortConfig.direction === "ascending" ? aValue - bValue : bValue - aValue;
    });
  };

  const filteredData = getSortedData().filter((entry) => {
    return (
      entry.card_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.status.toString().includes(searchTerm) ||
      entry.time.includes(searchTerm) ||
      (entry.card && entry.card.users[0]?.user_name.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  });

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  const getSortIcon = (columnName) => {
    if (sortConfig.key !== columnName) {
      return <FaSort className="inline ml-1" />;
    }
    return sortConfig.direction === "ascending" ? (
      <FaSortUp className="inline ml-1" />
    ) : (
      <FaSortDown className="inline ml-1" />
    );
  };

  const getCurrentPageData = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredData.slice(startIndex, startIndex + itemsPerPage);
  };

  return (
    <div className="min-h-screen px-4 py-8 bg-gray-100 sm:px-6 lg:px-8">
      <Spinner
        isOpen={isLoading}
        onClose={() => setIsLoading(false)}
        message="Loading....."
      />
      <div className="mx-auto max-w-7xl">
        <div className="overflow-hidden bg-white rounded-lg shadow-lg">
          <div className="p-6">
            <div className="flex flex-col items-center justify-between mb-6 sm:flex-row">
              <h1 className="mb-4 text-3xl font-bold text-gray-900 sm:mb-0">
                Lịch sử quẹt thẻ
              </h1>
              <div className="relative w-full sm:w-64">
                <input
                  type="text"
                  placeholder="Tìm kiếm theo mã thẻ hoặc user_name..."
                  className="w-full py-2 pl-10 pr-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <FaSearch className="absolute text-gray-400 left-3 top-3" />
              </div>
              <label className="inline-flex items-center pt-3 cursor-pointer">
                <span className="pr-3 text-sm font-medium text-gray-700 ms-3">Trạng thái</span>
                <input
                  type="checkbox"
                  checked={isOpen}
                  onChange={() => setIsOpen((prev) => !prev)}
                  className="sr-only peer"
                />
                <div className="relative w-14 h-7 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
              </label>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full table-auto">
                <thead>
                  <tr className="bg-gray-50">
                    <th
                      className="px-6 py-3 text-sm font-semibold text-left text-gray-600 cursor-pointer hover:bg-gray-100"
                      onClick={() => handleSort("card_id")}
                    >
                      Mã thẻ {getSortIcon("card_id")}
                    </th>
                    <th
                      className="px-6 py-3 text-sm font-semibold text-left text-gray-600 cursor-pointer hover:bg-gray-100"
                      onClick={() => handleSort("user_name")}
                    >
                      Tên người dùng {getSortIcon("user_name")}
                    </th>
                    <th
                      className="px-6 py-3 text-sm font-semibold text-left text-gray-600 cursor-pointer hover:bg-gray-100"
                      onClick={() => handleSort("status")}
                    >
                      Trạng thái {getSortIcon("status")}
                    </th>
                    <th
                      className="px-6 py-3 text-sm font-semibold text-left text-gray-600 cursor-pointer hover:bg-gray-100"
                      onClick={() => handleSort("time")}
                    >
                      Thời gian {getSortIcon("time")}
                    </th>
                    <th
                      className="px-6 py-3 text-sm font-semibold text-left text-gray-600 cursor-pointer hover:bg-gray-100"
                      onClick={() => handleSort("type")}
                    >
                      Loại thẻ {getSortIcon("type")}
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {getCurrentPageData().map((entry) => (
                    <tr
                      key={entry.id}
                      className="transition-colors duration-200 hover:bg-gray-50"
                    >
                      <td className="px-6 py-4 text-sm text-gray-700 whitespace-nowrap">
                        {entry.card_id}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700 whitespace-nowrap">
                        {entry.card?.users[0]?.user_name || "Khách"}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700 whitespace-nowrap">
                        <span className={`px-3 py-1 text-xs font-medium rounded-full border ${getStatusColor(entry.status)}`}>
                          {entry.status === 0 ? "Xe vào" : "Xe ra"}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700 whitespace-nowrap">
                        {new Date(entry.time).toLocaleString()}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700 whitespace-nowrap">
                        {entry.card?.type === 0 ? "Thẻ tháng" : "Thẻ lượt"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex items-center justify-between mt-6">
              <div className="text-sm text-gray-500">
                Hiển thị {Math.min(filteredData.length, itemsPerPage)} / {filteredData.length} trường dữ liệu
              </div>
              <div className="flex items-center space-x-2">
                <button
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                >
                  Trước
                </button>
                <span className="text-sm text-gray-600">
                  Trang {currentPage} / {totalPages}
                </span>
                <button
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                  onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                >
                  Tiếp theo
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sectiontable;
