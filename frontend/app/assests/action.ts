const base_url = process.env.NEXT_PUBLIC_BACKEND || 'http://localhost:5000/api'

export const getBlogsPosts = async () => {
    try {
        const res = await fetch(`${base_url}/blogs`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            },
        })

        if (!res.ok) {
            console.log(`Error in getting blogs posts`)
            throw new Error(`Error in getting blogs posts`)
        }
        const data = await res.json()
        return data;

    } catch (error) {
        console.log(`Error in Geting blog posts`)
        throw error;
    }
}

export const getBlogsPostsFeatured = async () => {
    try {
        const res = await fetch(`${base_url}/blogs/featured`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            },
        })

        if (!res.ok) {
            console.log(`Error in getting blogs posts`)
            throw new Error(`Error in getting blogs posts`)
        }
        const data = await res.json()
        return data;

    } catch (error) {
        console.log(`Error in Geting blog posts`)
        throw error;
    }
}

export const getBlogsPostSingle = async (slug: string) => {
    try {
        const res = await fetch(`${base_url}/blogs/${slug}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            },
        })

        if (!res.ok) {
            console.log(`Error in getting blogs posts`)
            throw new Error(`Error in getting blogs posts`)
        }
        const data = await res.json()
        return data;

    } catch (error) {
        console.log(`Error in Geting blog posts`)
        throw error;
    }
}

export const getProperties = async (query?: string) => {
    try {
        const res = await fetch(`${base_url}/properties/?${query}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            },
        })

        if (!res.ok) {
            console.log(`Error in getting properties`)
            throw new Error(`Error in getting properties`)
        }
        const data = await res.json()
        return data;

    } catch (error) {
        console.log(`Error in Geting properties`)
        throw error;
    }
}

export const getSimilarProperties = async (id: string, type: string) => {
    try {

        const res = await fetch(`${base_url}/properties/similar/${id}/${type}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            },
        })

        if (!res.ok) {
            console.log(`Error in getting properties`)
            throw new Error(`Error in getting properties`)
        }
        const data = await res.json()
        return data;

    } catch (error) {
        console.log(`Error in Geting properties`)
        throw error;
    }
}

export const getSingleProperty = async (slug: string) => {
    try {

        const res = await fetch(`${base_url}/properties/slug/${slug}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            },
        })

        if (!res.ok) {
            console.log(`Error in getting properties`)
            throw new Error(`Error in getting properties`)
        }
        const data = await res.json()
        return data;

    } catch (error) {
        console.log(`Error in Geting properties`)
        throw error;
    }
}

export const submitEnquiry = async (form: {}) => {
    try {

        const res = await fetch(`${base_url}/enquiries`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ ...form })
        })

        if (!res.ok) {
            console.log(`Error in getting properties`)
            throw new Error(`Error in getting properties`)
        }
        const data = await res.json()
        return data;

    } catch (error) {
        console.log(`Error in Geting properties`)
        throw error;
    }
}