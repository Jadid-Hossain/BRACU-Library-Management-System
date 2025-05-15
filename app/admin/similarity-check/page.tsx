"use client";

import { useState, useEffect } from "react";
import PDFViewer from "@/components/admin/PDFViewer";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

interface SimilaritySubmission {
  id: number;
  service: string;
  file_name: string;
  file_path: string;
  email: string;
  status: 'pending' | 'completed' | 'rejected';
  created_at: string;
}

export default function SimilarityCheckPage() {
  const [submissions, setSubmissions] = useState<SimilaritySubmission[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedSubmission, setSelectedSubmission] = useState<SimilaritySubmission | null>(null);

  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        const response = await fetch('/api/admin/similarity-submissions');
        
        if (!response.ok) {
          throw new Error('Failed to fetch similarity submissions');
        }
        
        const data = await response.json();
        setSubmissions(data);
      } catch (error) {
        console.error('Error fetching similarity submissions:', error);
        toast.error('Failed to load similarity submissions');
      } finally {
        setIsLoading(false);
      }
    };

    fetchSubmissions();
  }, []);

  const handleStatusUpdate = async (id: number, newStatus: 'completed' | 'rejected') => {
    try {
      const response = await fetch(`/api/admin/similarity-submissions/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) {
        throw new Error('Failed to update status');
      }

      // Update local state
      setSubmissions(prevSubmissions => 
        prevSubmissions.map(sub => 
          sub.id === id ? { ...sub, status: newStatus } : sub
        )
      );

      if (selectedSubmission?.id === id) {
        setSelectedSubmission(prev => prev ? { ...prev, status: newStatus } : null);
      }

      toast.success(`Submission marked as ${newStatus}`);
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error('Failed to update submission status');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="container mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle>Similarity Check Submissions</CardTitle>
          <CardDescription>
            View and manage similarity check submissions from users
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="w-full overflow-auto">
              {isLoading ? (
                <div className="flex justify-center items-center h-64">
                  <p>Loading similarity check submissions...</p>
                </div>
              ) : submissions.length === 0 ? (
                <div className="flex justify-center items-center h-64">
                  <p>No similarity check submissions found.</p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>File</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {submissions.map((submission) => (
                      <TableRow key={submission.id}>
                        <TableCell>{submission.id}</TableCell>
                        <TableCell>{submission.email}</TableCell>
                        <TableCell className="max-w-[200px] truncate">
                          {submission.file_name}
                        </TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(submission.status)}>
                            {submission.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {new Date(submission.created_at).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => setSelectedSubmission(submission)}
                          >
                            View
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </div>

            <div className="w-full">
              {selectedSubmission ? (
                <div className="flex flex-col gap-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-medium">Submission Details</h3>
                    <div className="flex gap-2">
                      {selectedSubmission.status === 'pending' && (
                        <>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleStatusUpdate(selectedSubmission.id, 'completed')}
                          >
                            Mark Completed
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            className="text-red-500"
                            onClick={() => handleStatusUpdate(selectedSubmission.id, 'rejected')}
                          >
                            Reject
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <p className="text-sm font-medium">Email:</p>
                      <p>{selectedSubmission.email}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Service Type:</p>
                      <p>{selectedSubmission.service}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Date Submitted:</p>
                      <p>{new Date(selectedSubmission.created_at).toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Status:</p>
                      <Badge className={getStatusColor(selectedSubmission.status)}>
                        {selectedSubmission.status}
                      </Badge>
                    </div>
                  </div>
                  
                  {selectedSubmission.file_path && (
                    <PDFViewer 
                      filePath={selectedSubmission.file_path} 
                      fileName={selectedSubmission.file_name} 
                    />
                  )}
                </div>
              ) : (
                <div className="flex justify-center items-center h-64 border rounded-md">
                  <p className="text-gray-500">Select a submission to view details</p>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 