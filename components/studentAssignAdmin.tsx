"use client";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { env } from '../env.mjs';
interface StudentEnrollmentModalAdminProps {
    courseId: number | string[] | undefined | string;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onEnroll: (studentId: string) => Promise<void>;
    schoolId: number| null;
}

export default function StudentEnrollmentModalAdmin({ courseId, open, onOpenChange, onEnroll, schoolId }: StudentEnrollmentModalAdminProps) {
    interface Student {
        user_id: string;
        email: string;
        last_name: string;
    }

    const [students, setStudents] = useState<Student[]>([]);
    const [selectedStudent, setSelectedStudent] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (open && courseId) {
            axios.get(env.NEXT_PUBLIC_API_BASE_URL+`/courses/${courseId}/available-students`, {
                headers: {
                  'schoolid': schoolId ? schoolId.toString() : '',
                }
              })
                .then(response => setStudents(response.data))
                .catch(console.error);
                console.log(students);
        }
    }, [open, courseId, schoolId, students]);

    const handleEnroll = async () => {
        if (!selectedStudent) return;
        setLoading(true);
        try {
            await onEnroll(selectedStudent);
            onOpenChange(false);
        } catch (error) {
            console.error('Enrollment failed:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Enroll Student</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                    <div className="grid gap-2">
                        <label className="text-sm font-medium">Available Students</label>
                        <select
                            className="border rounded p-2"
                            value={selectedStudent}
                            onChange={(e) => setSelectedStudent(e.target.value)}
                            disabled={loading}
                        >
                            <option value="">Select a student</option>
                            {students.map(student => (
                                <option key={student.user_id} value={student.user_id}>
                                    {student.email} {student.last_name}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="flex justify-end gap-2">
                        <Button variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>
                            Cancel
                        </Button>
                        <Button onClick={handleEnroll} disabled={!selectedStudent || loading}>
                            {loading ? 'Enrolling...' : 'Enroll Student'}
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}