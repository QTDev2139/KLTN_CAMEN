import { axiosApi } from '~/common/until/request.until';

export const getData = async () => {
  try {
    const res = await axiosApi.get('posts');
    return res.data;
  } catch (error) {}
};

// export const getData = async (q:string, type = 'less') => {
//   try {
//     const res = await request.get('https://jsonplaceholder.typicode.com/posts', {
//       params: {
//         q,
//         type,
//       },
//     });
//     return res.data;
//   } catch (error) {}
// };
