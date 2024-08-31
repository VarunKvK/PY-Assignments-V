"use client";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import Link from "next/link";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
  useEffect(()=>{
    const fetchTodolist=async()=>{
      const response=await fetch("http://localhost:5000/gettodos",
        {
          method:"GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
      const data=await response.json()
      console.log(data)
    }

    fetchTodolist()
  },[])

  return (
    <main className="flex min-h-screen flex-col items-center gap-6 p-24">
      <div className="flex flex-col gap-2">
        <h1 className="text-black text-3xl font-semibold text-center">
          Think less,do more.
        </h1>
        <p className="text-black/50 text-sm font-regular text-center">
          Start with a task list
        </p>
      </div>
      <div className="flex items-center gap-4">
        <CreateTask />
        <Button variant="outline">Load Tasks</Button>
      </div>
      <div className="flex flex-col gap-4">
        <p className="text-sm font-medium text-center">
          Current task you created
        </p>
        <div className="flex items-center gap-2">
          <div className="p-8 border boreder-black rounded-xl">
            <h1 className="text-4xl font-semibold">Daily Task 001</h1>
            <p className="text-gray-400 p-1 text-sm">
              Lorem ipsum dolor sit amet.Lorem ipsum dolor sit amet.
            </p>
            <Separator />
            <TaskList tasks={"TASK"} />
          </div>
        </div>
      </div>
    </main>
  );
}

const TaskList = ({ tasks }) => {
  return (
    <div className="flex items-center gap-1 py-4 px-2">
      <Checkbox />
      <Label>Task</Label>
    </div>
  );
};

const formSchema = z.object({
  name: z.string().min(2).max(50),
  description: z.string().min(2).max(50),
});

const CreateTask = () => {
  const router = useRouter();
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
    },
  });

  function onSubmit(values) {
    const data = JSON.stringify({
      name: values.name,
      description: values.description,
    });
    window.localStorage.setItem("your_data_key", data);

    setTimeout(() => {
      router.push(`/createTask/${values.name}`);
    }, 1000);
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Create new task</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Give it a name</DialogTitle>
        </DialogHeader>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="grid gap-4 py-4"
        >
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              TaskName
            </Label>
            <Input
              id="name"
              placeholder="Task_for_Today"
              {...form.register("name")}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="description" className="text-right">
              Description
            </Label>
            <Input
              id="description"
              {...form.register("description")}
              placeholder="I need to complete today..."
              className="col-span-3"
            />
          </div>
          <DialogFooter>
            <Button type="submit">Start with it</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
