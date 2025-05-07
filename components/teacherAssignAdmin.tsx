"use client";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { env } from '../env.mjs';
export default function TeacherAssignmentModalAdmin({ courseId, open, onOpenChange,schoolId }) {
    const [teachers, setTeachers] = useState([]);
    const [selectedTeacher, setSelectedTeacher] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (open && courseId) {
            axios.get(env.NEXT_PUBLIC_API_BASE_URL+`/courses/${courseId}/available-teachers`, {
                headers: {
                  'schoolid': schoolId.toString(),
                }
              })
                .then(response => setTeachers(response.data))
                .catch(console.error);
        }
    }, [open, courseId, schoolId]);

    const handleAssign = async () => {
        if (!selectedTeacher) return;
        
        setLoading(true);
        try {
            await axios.post(env.NEXT_PUBLIC_API_BASE_URL+`/courses/${courseId}/assign-teacher`, {
                teacherId: selectedTeacher
            });
            onOpenChange(false);
            // Optionally refresh course data
        } catch (error) {
            console.error('Assignment failed:', error);
            alert(error.response?.data?.error || 'Assignment failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Assign Teacher to Course</DialogTitle>
                </DialogHeader>
                
                <div className="space-y-4">
                    <div className="grid gap-2">
                        <label className="text-sm font-medium">Available Teachers</label>
                        <select
                            className="border rounded p-2"
                            value={selectedTeacher}
                            onChange={(e) => setSelectedTeacher(e.target.value)}
                            disabled={loading}
                        >
                            <option value="">Select a teacher</option>
                            {teachers.map(teacher => (
                                <option key={teacher.user_id} value={teacher.user_id}>
                                    {teacher.email} {teacher.last_name}
                                </option>
                            ))}
                        </select>
                    </div>
                    
                    <div className="flex justify-end gap-2">
                        <Button 
                            variant="outline" 
                            onClick={() => onOpenChange(false)}
                            disabled={loading}
                        >
                            Cancel
                        </Button>
                        <Button 
                            onClick={handleAssign}
                            disabled={!selectedTeacher || loading}
                        >
                            {loading ? 'Assigning...' : 'Assign Teacher'}
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}