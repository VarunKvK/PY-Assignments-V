"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PlaneIcon, Trash } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const formSchema = z.object({
  todo: z.string().min(2).max(50),
});

const page = () => {
  const [data, setData] = useState();
  const [todolist, setTodo] = useState([]);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: { todo: "" },
  });
  useEffect(() => {
    const data = window.localStorage.getItem("your_data_key");
    if (data) {
      const paresedData = JSON.parse(data);
      setData(paresedData);
    }
  }, []);

  function onSubmit(values) {
    setTodo([...todolist, values.todo]);
  }
  async function createTodo() {
    const response = await fetch("http://localhost:5000/createtodos", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ todo:todolist, data:data }),
    });

    console.log(await response.json())
  }
  if (!data) {
    return (
      <div className="h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }
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
      <div className="">
        {data ? (
          <div className="border border-1 border-black-50 rounded-xl p-6 h-auto flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <h1 className="text-6xl font-semibold">{data.name}</h1>
              <p className="text-black/50 text-sm font-regular text-center">
                {data.description}
              </p>
            </div>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <div className="flex items-center gap-1">
                <Input
                  id="todo"
                  {...form.register("todo")}
                  placeholder="Create you list"
                  className=""
                />
                <Button>
                  <PlaneIcon className="w-4" />
                </Button>
              </div>
            </form>
            {todolist.length > 0 && (
              <div className="flex flex-col gap-1">
                {todolist.map((t, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-center gap-1 bg-gray-50 p-2 border border-gray-200 rounded-md"
                  >
                    <p>{t}</p>
                    <Button
                      onClick={() =>
                        setTodo(todolist.filter((_, i) => i !== index))
                      }
                      variant="destructive"
                    >
                      <Trash className="w-4" />
                    </Button>
                  </div>
                ))}
                <Button onClick={createTodo}>Lets do it!</Button>
              </div>
            )}
          </div>
        ) : (
          <h1 className="">Need to create a name</h1>
        )}
      </div>
    </main>
  );
};

export default page;
