'use client'
import React, { createContext, useContext, useEffect, useState } from "react";

export const AboutContext = createContext<any | null>(null)

export const AboutProvider = ({ children }: { children: React.ReactNode }) => {

    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [about, setAbout] = useState({
        yearsOfExperinces: 0,
        totalSoldProperties: 0,
        locations: 0
    })

    const [contact, setContact] = useState({
        email: '',
        phone: '',
        location: ''
    })

    const loadAdminProfile = async () => {
        setLoading(true)
        try {

            const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND}/admin/auth/about/${process.env.NEXT_PUBLIC_ADMIN_ID}`, {
                method: 'GET',
                headers: {
                    "Content-Type": "application/json"
                }
            });
            const response = await res.json()

            if (response.success && response.data) {
                const admin = response.data;

                setContact({
                    email: admin.email,
                    phone: admin.phone,
                    location: admin.location
                })

                setAbout({
                    locations: admin.locations || 0,
                    yearsOfExperinces: admin.yearsOfExperinces || 0,
                    totalSoldProperties: admin.totalSoldProperties || 0
                })
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to load profile");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {


        loadAdminProfile();
    }, [])

    return (
        <AboutContext.Provider value={{ about, loading, error, contact }}>
            {children}
        </AboutContext.Provider>
    )
}

export const useAbout = () => {
    const context = useContext(AboutContext);

    if (!context) {
        throw new Error("useAbout must be used inside AboutContext");
    }

    return context;
}