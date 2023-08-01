"use client";
import useLoginModal from "@/hooks/use-login-modal";
import React, { useCallback, useState } from "react";
import Input from "../input";
import Modal from "../modal";
import useRegisterModal from "@/hooks/use-register-modal";
import { signIn } from "next-auth/react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "react-hot-toast";

type FormValues = {
  email: string;
  password: string;
};

const LoginModal = () => {
  const { control, handleSubmit, reset } = useForm<FormValues>({});
  const loginModal = useLoginModal();
  const registerModal = useRegisterModal();

  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = handleSubmit(async (values) => {
    try {
      setIsLoading(true);

      const { email, password } = values;

      await signIn("credentials", {
        email,
        password,
      });

      loginModal.onClose();
      reset();
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

    loginModal.onClose();
    registerModal.onOpen();
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
        First time using Twitter?
        <span
          onClick={onToggle}
          className="
              text-white
              cursor-pointer
              hover:underline
            "
        >
          {" "}
          Create an account
        </span>
      </p>
    </div>
  );

  return (
    <Modal
      disabled={isLoading}
      isOpen={loginModal.isOpen}
      title="Login"
      actionLabel="Sign in"
      onClose={loginModal.onClose}
      onSubmit={onSubmit}
      body={bodyContent}
      footer={footerContent}
    />
  );
};

export default LoginModal;
