import { Stack } from '@mui/material';
import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { blogApi } from '~/apis';
import { Post } from '~/apis/blog/blog.api.interface';

export default function BlogScreen() {
  const [blogResult, setBlogResult] = useState<Post[]>([]);
  const { lang } = useParams();

  useEffect(() => {
    const fetchApi = async () => {
      const result = await blogApi.getListBlog();
      setBlogResult(result.post);
    };
    fetchApi();
  }, []);

  // Lọc ngôn ngữ theo lang
  const lists =  useMemo(() => {
    return blogResult.filter((p) => p.language?.code === lang)
  }, [blogResult, lang])

  console.log(lists)

  return <Stack>
    {lists.map((blog) => (
      <div key={blog.id}>
        <div>{blog.title}</div>
        <div>{blog.content}</div>
      </div>
    ))}

  </Stack>;
}
