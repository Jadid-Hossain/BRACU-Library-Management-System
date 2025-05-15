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

interface ResearchRequest {
  id: number;
  service: string;
  file_name: string;
  file_path: string;
  email: string;
  status: 'pending' | 'completed' | 'rejected';
  created_at: string;
}

export default function ResearchQueriesPage() {
  const [requests, setRequests] = useState<ResearchRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedRequest, setSelectedRequest] = useState<ResearchRequest | null>(null);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const response = await fetch('/api/admin/research-requests');
        
        if (!response.ok) {
          throw new Error('Failed to fetch research requests');
        }
        
        const data = await response.json();
        setRequests(data);
      } catch (error) {
        console.error('Error fetching research requests:', error);
        toast.error('Failed to load research requests');
      } finally {
        setIsLoading(false);
      }
    };

    fetchRequests();
  }, []);

  const handleStatusUpdate = async (id: number, newStatus: 'completed' | 'rejected') => {
    try {
      const response = await fetch(`/api/admin/research-requests/${id}`, {
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
      setRequests(prevRequests => 
        prevRequests.map(req => 
          req.id === id ? { ...req, status: newStatus } : req
        )
      );

      if (selectedRequest?.id === id) {
        setSelectedRequest(prev => prev ? { ...prev, status: newStatus } : null);
      }

      toast.success(`Request marked as ${newStatus}`);
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error('Failed to update request status');
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
          <CardTitle>Research Help Requests</CardTitle>
          <CardDescription>
            View and manage research help requests from users
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="w-full overflow-auto">
              {isLoading ? (
                <div className="flex justify-center items-center h-64">
                  <p>Loading research requests...</p>
                </div>
              ) : requests.length === 0 ? (
                <div className="flex justify-center items-center h-64">
                  <p>No research requests found.</p>
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
                    {requests.map((request) => (
                      <TableRow key={request.id}>
                        <TableCell>{request.id}</TableCell>
                        <TableCell>{request.email}</TableCell>
                        <TableCell className="max-w-[200px] truncate">
                          {request.file_name}
                        </TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(request.status)}>
                            {request.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {new Date(request.created_at).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => setSelectedRequest(request)}
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
              {selectedRequest ? (
                <div className="flex flex-col gap-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-medium">Request Details</h3>
                    <div className="flex gap-2">
                      {selectedRequest.status === 'pending' && (
                        <>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleStatusUpdate(selectedRequest.id, 'completed')}
                          >
                            Mark Completed
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            className="text-red-500"
                            onClick={() => handleStatusUpdate(selectedRequest.id, 'rejected')}
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
                      <p>{selectedRequest.email}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Service Type:</p>
                      <p>{selectedRequest.service}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Date Submitted:</p>
                      <p>{new Date(selectedRequest.created_at).toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Status:</p>
                      <Badge className={getStatusColor(selectedRequest.status)}>
                        {selectedRequest.status}
                      </Badge>
                    </div>
                  </div>
                  
                  {selectedRequest.file_path && (
                    <PDFViewer 
                      filePath={selectedRequest.file_path} 
                      fileName={selectedRequest.file_name} 
                    />
                  )}
                </div>
              ) : (
                <div className="flex justify-center items-center h-64 border rounded-md">
                  <p className="text-gray-500">Select a request to view details</p>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 