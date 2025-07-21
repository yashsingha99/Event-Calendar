"use client";

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import React, { useEffect, useState } from "react";
import { Minus, Plus} from "lucide-react";
import { v4 as uuidv4 } from "uuid";
import { toast } from "sonner";
import { SidebarMenuButton } from "./ui/sidebar";
export function NewCalendarModal({ isOpen, onClose, onOpen }) {
    const [formData, setFormData] = useState({
        id: "",
        name: "",
        items: [{ id: uuidv4(), name: "", active: true }],
    });

    const handleClose = () => {
        onClose();
        setFormData({
            id: "",
            name: "",
            items: [{ id: uuidv4(), name: "" }],
        });
    };

    const handleSave = (e) => {
        e.preventDefault();
        if (!formData.name.trim()) {
            toast.error("Calendar name is required.");
            return;
        }

        if (formData.items.length === 0) {
            toast.error("At least one item is required.");
            return;
        }
        if (typeof window !== "undefined") {
            const existing = localStorage.getItem("calendars");
            const prevCalendars = existing ? JSON.parse(existing) : [];
            const newCalendar = {...formData, id: formData.id || uuidv4() };
            const updatedCalendars = [...prevCalendars, newCalendar];
            localStorage.setItem("calendars", JSON.stringify(updatedCalendars));
        }
        handleClose();
    };

    // const handleDelete = (e) => {
    //     e.preventDefault();
        
    //     handleClose();
    // };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            {/* <DialogTrigger asChild> */}
                <Button onClick={onOpen} variant={"outline"}>
                    <Plus />
                    <span>New Calendar</span>
                </Button>
            {/* </DialogTrigger> */}
            <DialogContent className={`sm:max-w-[500px]`}>
                <DialogHeader>
                    <DialogTitle>Add Calendar</DialogTitle>
                </DialogHeader>

                <Input
                    placeholder="Calendar Name"
                    className="mb-2"
                    value={formData.name}
                    onChange={(e) => {
                        setFormData({ ...formData, name: e.target.value });
                    }}
                />

                <div className="flex flex-col w-full justify-between">
                    {formData.items?.map((item, index) => (
                        <div key={item.id} className="flex items-center justify-between gap-2 mb-2">
                            <Input
                                type="text"
                                placeholder="Add item"
                                value={item.name}
                                onChange={(e) => {
                                    setFormData({
                                        ...formData,
                                        items: formData.items.map((i, idx) =>
                                            idx === index ? { ...i, name: e.target.value } : i
                                        ),
                                    });
                                }}
                                className="bg-background w-[80%] focus:ring-0"
                            />
                            <Button
                                variant="outline"
                                size="icon"
                                onClick={() => {
                                    setFormData({
                                        ...formData,
                                        items: [
                                            ...formData.items,
                                            {
                                                id: uuidv4(),
                                                name: "",
                                                active: false,
                                            },
                                        ],
                                    });
                                }}
                            >
                                {" "}
                                <Plus />{" "}
                            </Button>
                            <Button
                                variant="outline"
                                size="icon"
                                onClick={() => {
                                    if(formData.items.length <= 1) {
                                        toast.error("At least one item is required.");
                                        return;
                                    }
                                    setFormData({
                                        ...formData,
                                        items: formData.items.filter((_, idx) => idx !== index),
                                    });
                                }}
                            >
                                {" "}
                                <Minus />{" "}
                            </Button>

                        </div>
                    ))}
                </div>

                <div>
                    {/* {event?.id && (
            <Button
              onClick={handleDelete}
              variant={event?.id ? "outline" : "default"}
              className={`w-full mt-4 ${
                event?.id && "border hover:bg-gray-300 border-black bg-gray-200"
              }`}
            >
              Delete
            </Button>
          )} */}
                    <Button onClick={handleSave} className="w-full mt-4">
                        {/* {event?.id ? "Save changes" : "Save"} */}
                        Save
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
