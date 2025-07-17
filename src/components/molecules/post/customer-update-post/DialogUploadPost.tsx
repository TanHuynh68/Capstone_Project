import { UpdatePostForm } from "@/components/atoms/post/customer-update-post/UpdatePostForm";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { UpdatePostFormValues } from "@/schemas/report/updatePostSchema";

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
  return (
    <Dialog>
      <DialogTrigger>{children}</DialogTrigger>
      <DialogContent className="min-w-[500px]">
        <DialogHeader>
          <DialogTitle>Cập nhật bài đăng</DialogTitle>
        </DialogHeader>
        <UpdatePostForm
          fetchPosts={fetchPosts}
          projectPostId={projectPostId}
          data={data}
        />
      </DialogContent>
    </Dialog>
  );
}
