import React, { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ApiService } from "../config/api";

const ListPost: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const pageSizeRef = useRef<HTMLDivElement>(null);
  const sortRef = useRef<HTMLDivElement>(null);

  // Constants
  const PAGE_SIZE_OPTIONS = [10, 20, 50];
  const SORT_OPTIONS = [
    { label: "Newest", value: "Newest" },
    { label: "Oldest", value: "Oldest" },
  ];
  const DEFAULT_IMAGE =
    "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=400&q=80";
  const MONTHS = [
    "Januari",
    "Februari",
    "Maret",
    "April",
    "Mei",
    "Juni",
    "Juli",
    "Agustus",
    "September",
    "Oktober",
    "November",
    "Desember",
  ];

  // URL params management
  const getUrlParams = useCallback(() => {
    const params = new URLSearchParams(location.search);
    return {
      page: parseInt(params.get("page") || "1"),
      pageSize: parseInt(params.get("pageSize") || "10"),
      sort: params.get("sort") || "Newest",
    };
  }, [location.search]);

  const updateUrl = useCallback(
    (page: number, pageSize: number, sort: string) => {
      const params = new URLSearchParams({
        page: page.toString(),
        pageSize: pageSize.toString(),
        sort,
      });
      navigate(`${location.pathname}?${params.toString()}`, { replace: true });
    },
    [navigate, location.pathname]
  );

  // State
  const urlParams = getUrlParams();
  const [page, setPage] = useState(urlParams.page);
  const [pageSize, setPageSize] = useState(urlParams.pageSize);
  const [sort, setSort] = useState(urlParams.sort);
  const [posts, setPosts] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPageSizeOpen, setIsPageSizeOpen] = useState(false);
  const [isSortOpen, setIsSortOpen] = useState(false);

  const totalPages = Math.ceil(total / pageSize);

  // Sync state with URL
  useEffect(() => {
    const urlParams = getUrlParams();
    setPage(urlParams.page);
    setPageSize(urlParams.pageSize);
    setSort(urlParams.sort);
  }, [getUrlParams]);

  // API fetch using ApiService
  const fetchPosts = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await ApiService.getIdeas({
        page,
        pageSize,
        sort,
      });

      setPosts(data.data || []);
      setTotal(data.meta?.total || 0);
    } catch (err) {
      console.error("Fetch error:", err);
      setError(
        err instanceof Error
          ? err.message
          : "Network error occurred. Please try again."
      );
      setPosts([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  }, [page, pageSize, sort]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  // Event handlers
  const handlePageSizeChange = useCallback(
    (newPageSize: number) => {
      setPageSize(newPageSize);
      setPage(1);
      updateUrl(1, newPageSize, sort);
      setIsPageSizeOpen(false);
    },
    [sort, updateUrl]
  );

  const handleSortChange = useCallback(
    (newSort: string) => {
      setSort(newSort);
      setPage(1);
      updateUrl(1, pageSize, newSort);
      setIsSortOpen(false);
    },
    [pageSize, updateUrl]
  );

  const handlePageChange = useCallback(
    (newPage: number) => {
      setPage(newPage);
      updateUrl(newPage, pageSize, sort);
    },
    [pageSize, sort, updateUrl]
  );

  // Close dropdowns
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        isPageSizeOpen &&
        pageSizeRef.current &&
        !pageSizeRef.current.contains(event.target as Node)
      ) {
        setIsPageSizeOpen(false);
      }
      if (
        isSortOpen &&
        sortRef.current &&
        !sortRef.current.contains(event.target as Node)
      ) {
        setIsSortOpen(false);
      }
    };

    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsPageSizeOpen(false);
        setIsSortOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscKey);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscKey);
    };
  }, [isPageSizeOpen, isSortOpen]);

  // Helper functions
  const formatDate = (dateStr: string) => {
    if (!dateStr) return "-";
    const d = new Date(dateStr);
    return `${d.getDate()} ${MONTHS[d.getMonth()]} ${d.getFullYear()}`;
  };

  const getPageNumbers = () => {
    let start = Math.max(1, page - 2);
    let end = Math.min(totalPages, start + 4);
    if (end - start < 4) start = Math.max(1, end - 4);
    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  };

  const getItemsStatus = () => {
    if (posts.length === 0) return { start: 0, end: 0, total: 0 };
    return {
      start: (page - 1) * pageSize + 1,
      end: Math.min(page * pageSize, total),
      total,
    };
  };

  const itemsStatus = getItemsStatus();

  return (
    <div className="w-full max-w-[1440px] mx-auto px-4 md:px-8 py-8">
      {/* Top controls */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <span className="text-sm md:text-base font-semibold text-gray-700">
          Showing {itemsStatus.start} - {itemsStatus.end} of {itemsStatus.total}
        </span>
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
          {/* Page Size Control */}
          <label className="text-sm md:text-base font-semibold text-gray-700 flex flex-col sm:flex-row sm:items-center gap-1">
            <span className="whitespace-nowrap">Show per page:</span>
            <div className="relative" ref={pageSizeRef}>
              <button
                type="button"
                className="appearance-none border rounded-full px-4 py-2 text-sm md:text-base font-semibold bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-300 hover:border-orange-500 cursor-pointer min-w-[100px] flex items-center justify-between"
                onClick={() => {
                  setIsSortOpen(false);
                  setIsPageSizeOpen((prev) => !prev);
                }}
                aria-label="Show per page"
              >
                <span>{pageSize.toString()}</span>
                <span className="text-gray-700 ml-14">▼</span>
              </button>
              {isPageSizeOpen && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white border-2 border-gray-200 rounded-2xl shadow-xl z-50 overflow-hidden">
                  {PAGE_SIZE_OPTIONS.map((option) => (
                    <button
                      key={option}
                      type="button"
                      className={`w-full px-4 py-3 text-left text-sm md:text-base font-medium transition-all duration-150 ${
                        pageSize === option
                          ? "bg-orange-500 text-white"
                          : "bg-white text-gray-700 hover:bg-orange-50 hover:text-orange-600"
                      } first:rounded-t-xl last:rounded-b-xl`}
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handlePageSizeChange(option);
                      }}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </label>

          {/* Sort Control */}
          <label className="text-sm md:text-base font-semibold text-gray-700 flex flex-col sm:flex-row sm:items-center gap-1">
            <span className="whitespace-nowrap">Sort by:</span>
            <div className="relative" ref={sortRef}>
              <button
                type="button"
                className="appearance-none border rounded-full px-4 py-2 text-sm md:text-base font-semibold bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-300 hover:border-orange-500 cursor-pointer min-w-[100px] flex items-center justify-between"
                onClick={() => {
                  setIsPageSizeOpen(false);
                  setIsSortOpen((prev) => !prev);
                }}
                aria-label="Sort by"
              >
                <span>
                  {SORT_OPTIONS.find((opt) => opt.value === sort)?.label ||
                    sort}
                </span>
                <span className="text-gray-700 ml-14">▼</span>
              </button>
              {isSortOpen && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white border-2 border-gray-200 rounded-2xl shadow-xl z-50 overflow-hidden">
                  {SORT_OPTIONS.map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      className={`w-full px-4 py-3 text-left text-sm md:text-base font-medium transition-all duration-150 ${
                        sort === option.value
                          ? "bg-orange-500 text-white"
                          : "bg-white text-gray-700 hover:bg-orange-50 hover:text-orange-600"
                      } first:rounded-t-xl last:rounded-b-xl`}
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleSortChange(option.value);
                      }}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </label>
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <div
          className="flex flex-col items-center justify-center py-16"
          role="status"
          aria-live="polite"
        >
          <svg
            className="animate-spin h-12 w-12 text-orange-500 mb-4"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
            ></path>
          </svg>
          <span className="text-orange-500 text-lg font-semibold">
            Loading posts...
          </span>
        </div>
      ) : error ? (
        <div
          className="flex flex-col items-center justify-center py-16"
          role="alert"
        >
          <div className="text-red-500 text-lg font-semibold mb-4">{error}</div>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
          >
            Try Again
          </button>
        </div>
      ) : posts.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16">
          <div className="text-gray-500 text-lg font-semibold mb-2">
            No posts found
          </div>
          <p className="text-gray-400">
            There are no posts available at the moment.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
          {posts.map((post: any) => (
            <article
              key={post.id}
              className="bg-white rounded-xl shadow-lg overflow-hidden flex flex-col transition-all duration-200 hover:shadow-2xl hover:-translate-y-1 cursor-pointer group focus-within:ring-2 focus-within:ring-orange-300"
              onClick={() => navigate(`/ideas/${post.id}`)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  navigate(`/ideas/${post.id}`);
                }
              }}
              tabIndex={0}
              role="button"
              aria-label={`Read article: ${post.title}`}
            >
              <div className="aspect-[4/3] w-full bg-gray-100 relative overflow-hidden">
                <img
                  src={
                    post.small_image?.[0]?.url ||
                    post.medium_image?.[0]?.url ||
                    DEFAULT_IMAGE
                  }
                  alt={post.title || "Article thumbnail"}
                  loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  onError={(e) => {
                    const target = e.currentTarget as HTMLImageElement;
                    if (target.src !== DEFAULT_IMAGE)
                      target.src = DEFAULT_IMAGE;
                  }}
                />
              </div>
              <div className="p-4 flex-1 flex flex-col">
                <time className="mt-4 text-base font-bold text-gray-400 uppercase tracking-wide">
                  {formatDate(post.published_at)}
                </time>
                <h3
                  className="mt-2 text-lg font-bold text-gray-900 leading-snug overflow-hidden text-ellipsis line-clamp-3"
                  title={post.title}
                >
                  {post.title}
                </h3>
              </div>
            </article>
          ))}
        </div>
      )}

      {/* Pagination */}
      {!loading && !error && totalPages > 1 && (
        <nav
          className="flex justify-center items-center gap-2 mt-8 overflow-x-auto"
          aria-label="Pagination"
        >
          {/* First Page */}
          <button
            type="button"
            className={`px-2 py-1 text-xl md:text-2xl font-bold transition-colors ${
              page === 1
                ? "text-gray-300 cursor-not-allowed"
                : "text-gray-700 hover:text-orange-500"
            }`}
            disabled={page === 1}
            onClick={() => handlePageChange(1)}
            aria-label="Go to first page"
          >
            «
          </button>

          {/* Previous Page */}
          <button
            type="button"
            className={`px-2 py-1 text-xl md:text-2xl font-bold transition-colors ${
              page === 1
                ? "text-gray-300 cursor-not-allowed"
                : "text-gray-700 hover:text-orange-500"
            }`}
            disabled={page === 1}
            onClick={() => handlePageChange(page - 1)}
            aria-label="Go to previous page"
          >
            ‹
          </button>

          {/* Page Numbers */}
          <div className="flex gap-2">
            {getPageNumbers().map((pageNum) => (
              <button
                key={pageNum}
                type="button"
                className={`px-3 py-1 rounded text-base md:text-lg font-semibold transition-colors ${
                  page === pageNum
                    ? "bg-orange-500 text-white"
                    : "bg-white text-gray-700 hover:bg-orange-50"
                }`}
                onClick={() => handlePageChange(pageNum)}
                aria-label={`Go to page ${pageNum}`}
                aria-current={page === pageNum ? "page" : undefined}
              >
                {pageNum}
              </button>
            ))}
          </div>

          {/* Next Page */}
          <button
            type="button"
            className={`px-2 py-1 text-xl md:text-2xl font-bold transition-colors ${
              page === totalPages
                ? "text-gray-300 cursor-not-allowed"
                : "text-gray-700 hover:text-orange-500"
            }`}
            disabled={page === totalPages}
            onClick={() => handlePageChange(page + 1)}
            aria-label="Go to next page"
          >
            ›
          </button>

          {/* Last Page */}
          <button
            type="button"
            className={`px-2 py-1 text-xl md:text-2xl font-bold transition-colors ${
              page === totalPages
                ? "text-gray-300 cursor-not-allowed"
                : "text-gray-700 hover:text-orange-500"
            }`}
            disabled={page === totalPages}
            onClick={() => handlePageChange(totalPages)}
            aria-label="Go to last page"
          >
            »
          </button>
        </nav>
      )}
    </div>
  );
};

export default ListPost;
