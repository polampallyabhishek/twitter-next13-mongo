"use client";
import useEditModal from "@/hooks/use-edit-modal";
import useSession from "@/hooks/use-session";
import useUser from "@/hooks/use-user";
import axios from "axios";
import { useEffect, useMemo, useState } from "react";
import { toast } from "react-hot-toast";
import Input from "../input";
import Modal from "../modal";
import { Controller, useForm } from "react-hook-form";
import ImageUpload from "../image-upload";

type FormValues = {
  profileImage: string;
  coverImage: string;
  username: string;
  name: string;
  bio: string;
};

const EditModal = () => {
  const { control, handleSubmit, reset } = useForm<FormValues>();
  const { data: session } = useSession();
  const editModal = useEditModal();

  const { data: currentUser, mutate: mutateFetchedUser } = useUser(
    session?.user?.id
  );

  useEffect(() => {
    reset({
      profileImage: currentUser?.profileImage,
      coverImage: currentUser?.coverImage,
      name: currentUser?.name,
      username: currentUser?.username,
      bio: currentUser?.bio,
    });
  }, [reset, currentUser]);

  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = handleSubmit(async (values) => {
    try {
      setIsLoading(true);

      const { name, username, bio, profileImage, coverImage } = values;

      await axios.patch("/api/edit", {
        name,
        username,
        bio,
        profileImage,
        coverImage,
      });
      mutateFetchedUser();

      toast.success("Updated");

      editModal.onClose();
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  });

  const bodyContent = (
    <div className="flex flex-col gap-4">
      <Controller
        control={control}
        name="profileImage"
        render={({ field: { value, onChange } }) => (
          <ImageUpload
            value={value}
            disabled={isLoading}
            onChange={onChange}
            label="Upload profile image"
          />
        )}
      />
      <Controller
        control={control}
        name="coverImage"
        render={({ field: { value, onChange } }) => (
          <ImageUpload
            value={value}
            disabled={isLoading}
            onChange={onChange}
            label="Upload cover image"
          />
        )}
      />
      <Controller
        control={control}
        name="name"
        render={({ field }) => (
          <Input
            placeholder="Name"
            onChange={(e) => field.onChange(e.target.value)}
            value={field.value}
            disabled={isLoading}
          />
        )}
      />
      <Controller
        control={control}
        name="username"
        render={({ field }) => (
          <Input
            placeholder="Username"
            onChange={(e) => field.onChange(e.target.value)}
            value={field.value}
            disabled={isLoading}
          />
        )}
      />
      <Controller
        control={control}
        name="bio"
        render={({ field }) => (
          <Input
            placeholder="Bio"
            onChange={(e) => field.onChange(e.target.value)}
            value={field.value}
            disabled={isLoading}
          />
        )}
      />
    </div>
  );

  return (
    <Modal
      disabled={isLoading}
      isOpen={editModal.isOpen}
      title="Edit your profile"
      actionLabel="Save"
      onClose={editModal.onClose}
      onSubmit={onSubmit}
      body={bodyContent}
    />
  );
};

export default EditModal;
