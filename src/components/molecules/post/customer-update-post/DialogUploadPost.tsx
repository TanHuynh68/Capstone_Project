import { UpdatePostFormValues } from "@/schemas/updatePostSchema";
import type React from "react";
import CreateUpdatePostDialog from "../customer-upload-post-dialog/CreateUpdatePostDialog";


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
    <CreateUpdatePostDialog
      isUpdateMode={true}
      updateData={data}
      projectPostId={projectPostId}
      fetchPosts={fetchPosts}
    >
      {children}
    </CreateUpdatePostDialog>
  );
}
