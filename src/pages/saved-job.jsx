import { getSavedJobs } from "@/api/apiJobs";
import JobCard from "@/components/job-card";
import useFetch from "@/hooks/use-fetch";
import { useUser } from "@clerk/clerk-react";
import { useEffect, useState } from "react";
import { BarLoader } from "react-spinners";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination'

const SavedJobs = () => {
  const { isLoaded } = useUser();
  const [page, setPage] = useState(1); // State for pagination
  const savedJobsPerPage = 6; // Saved Jobs per page

  const {
    loading: loadingSavedJobs,
    data: savedJobs,
    fn: fnSavedJobs,
  } = useFetch(getSavedJobs);

  useEffect(() => {
    if (isLoaded) {
      fnSavedJobs();
    }
  }, [isLoaded]);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages && newPage !== page) {
      setPage(newPage);
    }
  };

  if (!isLoaded || loadingSavedJobs) {
    return <BarLoader className="mb-4" width={"100%"} color="#36d7b7" />;
  }

  // Calculate the total number of pages
  const totalPages = Math.ceil((savedJobs?.length || 0) / savedJobsPerPage);

  return (
    <div className="saved-jobs-container">
      <h1 className="gradient-title font-extrabold text-6xl sm:text-7xl text-center pb-8">
        Saved Jobs
      </h1>

      {loadingSavedJobs === false && (
        <div className="jobs-list mt-8 grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {savedJobs?.length ? (
            savedJobs
              .slice((page - 1) * savedJobsPerPage, page * savedJobsPerPage)
              .map((saved) => (
                <JobCard
                  key={saved.id}
                  job={saved?.job}
                  onJobAction={fnSavedJobs}
                  savedInit={true}
                />
              ))
          ) : (
            <div>No Saved Jobs 👀</div>
          )}
        </div>
      )}
      <div className="pagination-wrapper">
        {/* Pagination */}
        <Pagination className="mt-7">
          <PaginationPrevious
            onClick={() => handlePageChange(page - 1)}
            className={page > 1 ? "" : "opacity-0"}
            aria-label="Previous page"
          >
            Previous
          </PaginationPrevious>
          <PaginationContent>
            {[...Array(totalPages).keys()].map((p) => (
              <PaginationItem key={p}>
                <PaginationLink
                  active={page === p + 1}
                  onClick={() => handlePageChange(p + 1)}
                  className={page === p + 1 ? "bg-white text-black" : ""}
                  aria-label={`Go to page ${p + 1}`}
                >
                  {p + 1}
                </PaginationLink>
              </PaginationItem>
            ))}
          </PaginationContent>
          <PaginationNext
            onClick={() => handlePageChange(page + 1)}
            className={page < totalPages ? "" : "opacity-0"}
            aria-label="Next page"
          >
            Next
          </PaginationNext>
        </Pagination>
      </div>
    </div>
  );
};

export default SavedJobs;
