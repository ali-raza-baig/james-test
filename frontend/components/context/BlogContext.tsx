import React, { createContext, useContext } from "react";

export const BlogContext = createContext<any | null>(null)

export const BlogProvider = ({ children }: { children: React.ReactNode }) => {
    // const [blogs , set]
    return (
        <BlogContext.Provider value={{}}>
            {children}
        </BlogContext.Provider>
    )
}

export const useBlog = () => {
    const context = useContext(BlogContext);

    if (!context) {
        throw new Error("useBlog must be used inside BlogContext");
    }

    return context;
}