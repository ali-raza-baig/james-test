"use client";

import { useEffect, useState } from "react";
import ModalBox from "../cards/ModalBox";
import BookAppointment from "./BookAppointment";
import EnquiryForm from "./EnquiryForm";

export default function ContactPopup() {
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsOpen(true);
        }, 1500); // popup after 1 second

        return () => clearTimeout(timer);
    }, []);

    return (

        <ModalBox
            isOpen={isOpen}
            onClose={() => setIsOpen(false)}
            title=""
        >
            <EnquiryForm />
        </ModalBox>
    );
}