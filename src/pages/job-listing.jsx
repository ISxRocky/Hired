import { getCompanies } from '@/api/apiCompanies'
import { getJobs } from '@/api/apiJobs'
import JobCard from '@/components/job-card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination'
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import useFetch from '@/hooks/use-fetch'
import { useUser } from '@clerk/clerk-react'
import React, { useEffect, useState } from 'react'
import { BarLoader } from 'react-spinners'


const JobListing = () => {
  const [searchQuery, setSearchQuery] = useState("")
  const [company_id, setCompany_id] = useState("")
  const { isLoaded} = useUser()
  const [page, setPage] = useState(1); // State for pagination
  const jobsPerPage = 6; // Jobs per page
  const {
    fn: fnCompanies,
    data: companies,
  } = useFetch(getCompanies)

  const {
    fn: fnJobs,
    data: jobs,
    loading: loadingJobs,
  } = useFetch(getJobs, {
    company_id,
    searchQuery,
  })


  useEffect(() =>{
    if(isLoaded) fnCompanies()
  }, [isLoaded])

  useEffect(() =>{
    if(isLoaded) fnJobs()
  }, [isLoaded, company_id, searchQuery])

  const handleSearch = (e) => {
    e.preventDefault()
    let formData = new FormData(e.target)

    const query = formData.get("search-query")
    if (query) setSearchQuery(query)
  }

  const clearFilters = () => {
    setSearchQuery("");
    setCompany_id("");
  };

  const handlePageChange = (newPage) => {
    if(
      newPage >=1 &&
      newPage <= totalPages &&
      newPage !== page
    )
    setPage(newPage);
  };
  // Calculate the total number of pages
  const totalPages = Math.ceil((jobs?.length || 0) / jobsPerPage);

  if(!isLoaded){
    return <BarLoader className='mb-4' width={"100%"} color="#36d7b7" />
  }


  return (
    <div className="jobs-container">
      <h1 className='gradient-title font-extrabold text-6xl sm:text-7xl text-center pb-8 '>
          Latest Jobs
        </h1>

        {/*Add filters here*/}
        <form onSubmit={handleSearch} className='h-14 flex w-full gap-2 items-center mb-3 '>
          <Input type="text" 
          placeholder="Search Jobs by Title.." 
          name="search-query"
          className="h-full flex-1 px-4 text-md"
          />
          <Button type="submit" className="h-full sm:w-28" variant="blue">
            Search
          </Button>
        </form>

        <div className="flex flex-col sm:flex-row gap-2">
        <Select
          value={company_id}
          onValueChange={(value) => setCompany_id(value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Filter by Company" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {companies?.map(({ name, id }) => {
                return (
                  <SelectItem key={name} value={id}>
                    {name}
                  </SelectItem>
                );
              })}
            </SelectGroup>
          </SelectContent>
        </Select>

        <Button
          className="sm:w-1/2"
          variant="destructive"
          onClick={clearFilters}
        >
          Clear Filters
        </Button>
      </div>

        {loadingJobs && (
          <BarLoader className='mb-4' width={"100%"} color="#36d7b7" />
        )}

        {loadingJobs === false && (
          <div className='jobs-list mt-8 grid md:grid-cols-2 lg:grid-cols-3 gap-4' >
            {jobs?.length?(
              jobs.slice((page - 1) * jobsPerPage, page * jobsPerPage).map((job) => {
                return <JobCard 
                key={job.id} 
                job={job}
                savedInit = {job?.saved?.length > 0}
                />
              })
            ):(
              <div> No Jobs Found</div>
            )}
          </div>
        )}
        <div className='pagination-wrapper'>
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
  )
}

export default JobListing