import {
    fetchIssueList,
    getIssueAttachments,
    getIssueComments,
    getIssueDetail,
    getIssues
} from "@/src/services/issueService";
import { useEffect, useState } from 'react';

export function useIssue(id: number) {
  const [issue, setIssue] = useState<any>(null)
  const [loadingIssue, setLoadingIssue] = useState(true);
  const [issueComments, setIssueComments] = useState<any[]>([])
  const [loadingIssueComments, setLoadingIssueComments] = useState(true);
  const [issueAttachments, setIssueAttachments] = useState<any[]>([])
  const [loadingIssueAttachments, setLoadingIssueAttachments] = useState(true);

  const [loadingIssueCommentsMore, setLoadingIssueCommentsMore] = useState(false);
  const [currentIssueCommentsPage, setCurrentIssueCommentsPage] = useState(1);
  const [commentsHasNextPage, setCommentsHasNextPage] = useState(true);

  const [loadingIssueAttachmentsMore, setLoadingIssueAttachmentsMore] = useState(false);
  const [currentIssueAttachmentsPage, setCurrentIssueAttachmentsPage] = useState(1);
  const [attachmentsHasNextPage, setAttachmentsHasNextPage] = useState(true);

  useEffect(() => {
    getIssue(id);
    getIssueDetailAttachments(id);
    getIssueDetailComments(id);
  }, []);

  const getIssue = async (id: number) => {
      setLoadingIssue(true)
      try {
        const issueDetail = await getIssueDetail(id);
        setIssue(issueDetail);
      } catch (error) {
        console.error('Error loading issue:', error);
      } finally {
        setLoadingIssue(false);
      }
  }

  const getIssueDetailComments = async (id: number, page: number = 1) => {
      setLoadingIssueComments(true)
      try {
        const issueComments = await getIssueComments(id, page);
        setIssueComments(issueComments.results);
        setCommentsHasNextPage(!!issueComments.next);
      } catch (error) {
        console.error('Error loading issue comments:', error);
      } finally {
        setLoadingIssueComments(false);
      }
  }

  const getIssueDetailAttachments = async (id: number, page: number = 1) => {
      setLoadingIssueAttachments(true)
      try {
          const issueAttachments = await getIssueAttachments(id, page);
          setIssueAttachments(issueAttachments.results);
          setAttachmentsHasNextPage(!!issueAttachments.next);
      } catch (error) {
        console.error('Error loading issue attachments:', error);
      } finally {
        setLoadingIssueAttachments(false);
      }
  }

  const loadMoreIssueComments = async (id: number) => {
    if (loadingIssueCommentsMore || !commentsHasNextPage) return;

    setLoadingIssueCommentsMore(true);
    try {
      const nextPage = currentIssueCommentsPage + 1;
      const issueComments = await getIssueComments(id, nextPage);
      setIssueComments(prev => [...prev, ...(issueComments.results || issueComments)]);
      setCurrentIssueCommentsPage(nextPage);
      setCommentsHasNextPage(!!issueComments.next);
    } catch (error) {
      console.error('Error loading more issue comments:', error);
    } finally {
      setLoadingIssueCommentsMore(false);
    }
  }

  const refreshIssueComments = async (id: number) => {
    setLoadingIssueComments(true);
    setCurrentIssueCommentsPage(1);
    setCommentsHasNextPage(true);
    try {
      const issuesComments = await getIssueComments(id, 1);
      setIssueComments(issuesComments.results || issuesComments);
      setCommentsHasNextPage(!!issuesComments.next);
    } catch (error) {
      console.error('Error refreshing issue comments:', error);
    } finally {
      setLoadingIssueComments(false);
    }
  }


  const loadMoreIssueAttachments = async (id: number) => {
    if (loadingIssueAttachmentsMore || !attachmentsHasNextPage) return;

    setLoadingIssueAttachmentsMore(true);
    try {
      const nextPage = currentIssueAttachmentsPage + 1;
      const issueAttachments = await getIssueAttachments(id, nextPage);
      setIssueAttachments(prev => [...prev, ...(issueAttachments.results || issueAttachments)]);
      setCurrentIssueAttachmentsPage(nextPage);
      setAttachmentsHasNextPage(!!issueAttachments.next);
    } catch (error) {
      console.error('Error loading more issue attachments:', error);
    } finally {
      setLoadingIssueAttachmentsMore(false);
    }
  }

  const refreshIssueAttachments = async (id: number) => {
    setLoadingIssueAttachments(true);
    setCurrentIssueAttachmentsPage(1);
    setAttachmentsHasNextPage(true);
    try {
      const issuesAttachments = await getIssueAttachments(id, 1);
      setIssueComments(issuesAttachments.results || issuesAttachments);
      setCommentsHasNextPage(!!issuesAttachments.next);
    } catch (error) {
      console.error('Error refreshing issue attachments:', error);
    } finally {
      setLoadingIssueAttachments(false);
    }
  }

  return {
      issue,
      loadingIssue,
      issueComments,
      loadingIssueComments,
      issueAttachments,
      loadingIssueAttachments,
      loadMoreIssueComments,
      commentsHasNextPage,
      loadingIssueCommentsMore,
      refreshIssueComments,
      loadMoreIssueAttachments,
      refreshIssueAttachments,
      attachmentsHasNextPage
  }
}