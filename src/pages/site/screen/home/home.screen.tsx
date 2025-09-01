import axios from "axios";
import { useEffect, useState } from "react"

interface Post {
    userId: number;
    id: number;
    title: string;
    body: string;
}

export default function HomeScreen() {
    const [posts, setPosts] = useState<Post[]>([]);

    useEffect(() => {

        axios.get('https://jsonplaceholder.typicode.com/posts')
            .then((res) => {
                // console.log(res)
                setPosts(res.data);
            })
    }, []);

    return <>
        {posts.map((post) => (
            <p key={post.id}>{post.title}</p>
        ))}
    </>
}