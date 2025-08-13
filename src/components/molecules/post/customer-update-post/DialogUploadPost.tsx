import { UpdatePostForm } from "@/components/atoms/post/customer-update-post/UpdatePostForm";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { UpdatePostFormValues } from "@/schemas/updatePostSchema";
import { useState } from "react";
interface DialogUpdatePostProps {
  children: React.ReactNode;
  data: UpdatePostFormValues;
  projectPostId: string;
  fetchPosts: any;
}
export function DialogUpdatePost({
  children,
  data,
  projectPostId,
  fetchPosts,
}: DialogUpdatePostProps) {
  const [open, setOpen] = useState<boolean>(false);
  return (
    <Dialog open={open} onOpenChange={()=>setOpen(!open)}>
      <DialogTrigger>
        <div onClick={() => setOpen(true)}>{children}</div>
      </DialogTrigger>
      <DialogContent className="min-w-[500px]">
        <DialogHeader>
          <DialogTitle>Cập nhật bài đăng</DialogTitle>
        </DialogHeader>
        <UpdatePostForm
          setOpen={setOpen}
          fetchPosts={fetchPosts}
          projectPostId={projectPostId}
          data={data}
        />
      </DialogContent>
    </Dialog>
  );
}
