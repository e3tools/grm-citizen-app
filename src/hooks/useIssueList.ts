import {fetchIssueList} from '@/src/services/issueService'
import {useEffect, useState} from 'react'

export function useIssueList() {
  const [issues, setIssues] = useState<any[]>([])
  const [loadingIssues, setLoadingIssues] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [nextPage, setNextPage] = useState(null)
  const [hasNextPage, setHasNextPage] = useState(true)

  useEffect(() => {
    getIssueList()
  }, [])

  const getIssueList = async () => {
    setLoadingIssues(true)
    try {
      const issuesList = await fetchIssueList()

      setIssues(issuesList.results || issuesList)
      setHasNextPage(!!issuesList.next)
      setNextPage(issuesList.next)
    } catch (error) {
      console.error('Error loading issues:', error)
    } finally {
      setLoadingIssues(false)
    }
  }

  const loadMoreIssues = async () => {
    if (loadingMore || !hasNextPage) return

    setLoadingMore(true)
    try {
      if (!nextPage) {
        setHasNextPage(false)
        setLoadingMore(false)
        return
      }
      const response = await fetchIssueList(nextPage)
      setIssues(prev => [...prev, ...(response.results || response)])
      setHasNextPage(!!response.next)
      setNextPage(response.next)
    } catch (error) {
      console.error('Error loading more issues:', error)
    } finally {
      setLoadingMore(false)
    }
  }

  const refreshIssues = async () => {
    setLoadingIssues(true)
    setNextPage(null)
    setHasNextPage(true)
    try {
      const issuesList = await fetchIssueList(1)
      setIssues(issuesList.results || issuesList)
      setHasNextPage(!!issuesList.next)
    } catch (error) {
      console.error('Error refreshing issues:', error)
    } finally {
      setLoadingIssues(false)
    }
  }

  return {
    issues,
    loadingIssues,
    loadingMore,
    hasNextPage,
    loadMoreIssues,
    refreshIssues,
  }
}
