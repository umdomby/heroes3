"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Sheet,
    SheetContent,
    SheetFooter,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";
import { User } from "@prisma/client";
import React, { useState, useEffect } from "react";
import { chatUsers, chatUsersGet } from "@/app/actions";

interface PointsUserProps {
    user: User;
}

export const SheetChat: React.FC<PointsUserProps> = ({ user }) => {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");

    useEffect(() => {
        // Function to fetch messages
        console.log("1111111111111111111111")
        async function fetchMessages() {
            try {
                const fetchedMessages = await chatUsersGet();
                setMessages(fetchedMessages);
            } catch (error) {
                console.error('Error fetching messages:', error);
            }
        }

        // Fetch messages initially
        fetchMessages();

        // Set interval to fetch messages every 5 seconds
        const intervalId = setInterval(fetchMessages, 5000);

        // Clear interval on component unmount
        return () => clearInterval(intervalId);
    }, []);

    const handleSendMessage = async () => {
        if (newMessage.trim() === "") return;

        try {
            // Send new message
            await chatUsers(user.id, newMessage);
            setNewMessage("");

            // Fetch updated messages
            const updatedMessages = await chatUsersGet();
            setMessages(updatedMessages);
        } catch (error) {
            console.error('Error sending message:', error);
        }
    };

    return (
        <div className="absolute right-1 flex justify-center items-center py-2 z-50 transform -translate-y-9">
            <Sheet>
                <SheetTrigger className='h-5 w-19' asChild>
                    <Button variant="outline">Chat {user.fullName}</Button>
                </SheetTrigger>
                <SheetContent className="flex flex-col h-full">
                    <SheetHeader>
                        <SheetTitle>Chat</SheetTitle>
                    </SheetHeader>
                    <div className="flex-grow p-4 overflow-y-auto flex flex-col-reverse">
                        {messages.map((msg, index) => (
                            <div key={index} className="mb-2">
                                <strong>{msg.userEmail}:</strong> {msg.chatText}
                            </div>
                        ))}
                    </div>
                    <SheetFooter className="flex items-center p-4 border-t">
                        <Input
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            placeholder="Type your message..."
                            className="flex-grow mr-2"
                        />
                        <Button onClick={handleSendMessage}>Send</Button>
                    </SheetFooter>
                </SheetContent>
            </Sheet>
        </div>
    );
};
