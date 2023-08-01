"use client";
import React, { useCallback, useState } from "react";
import Input from "../input";
import Modal from "../modal";
import useRegisterModal from "@/hooks/use-register-modal";
import useLoginModal from "@/hooks/use-login-modal";
import axios from "axios";
import { Controller, useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { signIn } from "next-auth/react";

type FormValues = {
  email: string;
  password: string;
  username: string;
  name: string;
};

const RegisterModal = () => {
  const { control, handleSubmit, reset } = useForm<FormValues>({
    defaultValues: {
      email: "",
      password: "",
      username: "",
      name: "",
    },
  });
  const registerModal = useRegisterModal();
  const loginModal = useLoginModal();

  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = handleSubmit(async (values) => {
    try {
      setIsLoading(true);

      const { email, password, username, name } = values;

      await axios.post("/api/register", {
        email,
        password,
        username,
        name,
      });

      toast.success("Account created.");

      await signIn("credentials", {
        email,
        password,
      });

      reset();
      registerModal.onClose();
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  });

  const onToggle = useCallback(() => {
    if (isLoading) {
      return;
    }

    registerModal.onClose();
    loginModal.onOpen();
  }, [loginModal, registerModal, isLoading]);

  const bodyContent = (
    <div className="flex flex-col gap-4">
      <Controller
        control={control}
        name="email"
        render={({ field }) => (
          <Input
            placeholder="Email"
            onChange={(e) => field.onChange(e.target.value)}
            value={field.value}
            disabled={isLoading}
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
        name="password"
        render={({ field }) => (
          <Input
            placeholder="Password"
            type="password"
            onChange={(e) => field.onChange(e.target.value)}
            value={field.value}
            disabled={isLoading}
          />
        )}
      />
    </div>
  );

  const footerContent = (
    <div className="text-neutral-400 text-center mt-4">
      <p>
        Already have an account?
        <span
          onClick={onToggle}
          className="
              text-white
              cursor-pointer
              hover:underline
            "
        >
          {" "}
          Sign in
        </span>
      </p>
    </div>
  );

  return (
    <Modal
      disabled={isLoading}
      isOpen={registerModal.isOpen}
      title="Create an account"
      actionLabel="Register"
      onClose={registerModal.onClose}
      onSubmit={onSubmit}
      body={bodyContent}
      footer={footerContent}
    />
  );
};

export default RegisterModal;
