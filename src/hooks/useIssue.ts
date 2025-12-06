import { fetchIssueList } from "@/src/services/issueService";
import { useEffect, useState } from 'react';

export function useIssue() {
  const [issues, setIssues] = useState<any[]>([])
  const [loadingIssues, setLoadingIssues] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(true);
    
  useEffect(() => {
    getIssueList();
  }, []);
    
  const getIssueList = async () => {
      setLoadingIssues(true)
      try {
        const issuesList = await fetchIssueList(1)
        setIssues(issuesList.results || issuesList);
        setHasNextPage(!!issuesList.next);
      } catch (error) {
        console.error('Error loading issues:', error);
      } finally {
        setLoadingIssues(false);
      }
    }

  const loadMoreIssues = async () => {
    if (loadingMore || !hasNextPage) return;
    
    setLoadingMore(true);
    try {
      const nextPage = currentPage + 1;
      const issuesList = await fetchIssueList(nextPage);
      setIssues(prev => [...prev, ...(issuesList.results || issuesList)]);
      setCurrentPage(nextPage);
      setHasNextPage(!!issuesList.next);
    } catch (error) {
      console.error('Error loading more issues:', error);
    } finally {
      setLoadingMore(false);
    }
  }

  const refreshIssues = async () => {
    setLoadingIssues(true);
    setCurrentPage(1);
    setHasNextPage(true);
    try {
      const issuesList = await fetchIssueList(1);
      setIssues(issuesList.results || issuesList);
      setHasNextPage(!!issuesList.next);
    } catch (error) {
      console.error('Error refreshing issues:', error);
    } finally {
      setLoadingIssues(false);
    }
  }
    
  return { 
    issues, 
    loadingIssues, 
    loadingMore, 
    hasNextPage, 
    loadMoreIssues, 
    refreshIssues 
  }
}