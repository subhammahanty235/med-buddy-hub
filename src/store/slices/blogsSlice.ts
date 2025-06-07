
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  publishedAt: string;
  readTime: string;
  category: string;
  image: string;
  tags: string[];
}

interface BlogsState {
  posts: BlogPost[];
  loading: boolean;
  error: string | null;
}

const initialState: BlogsState = {
  posts: [],
  loading: false,
  error: null,
};

const mockBlogPosts: BlogPost[] = [
  {
    id: '1',
    title: 'Understanding Heart Health: Prevention and Early Detection',
    excerpt: 'Learn about the latest advances in cardiovascular medicine and how to maintain a healthy heart through lifestyle changes.',
    content: 'Full article content would go here...',
    author: 'Dr. Sarah Johnson',
    publishedAt: '2024-01-10',
    readTime: '5 min read',
    category: 'Cardiology',
    image: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=600',
    tags: ['heart health', 'prevention', 'cardiology']
  },
  {
    id: '2',
    title: 'Skin Care Tips for Different Seasons',
    excerpt: 'Expert dermatologist advice on how to adapt your skincare routine throughout the year.',
    content: 'Full article content would go here...',
    author: 'Dr. Michael Chen',
    publishedAt: '2024-01-08',
    readTime: '3 min read',
    category: 'Dermatology',
    image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=600',
    tags: ['skincare', 'dermatology', 'seasons']
  },
  {
    id: '3',
    title: 'Managing Stress and Mental Health in Modern Life',
    excerpt: 'Practical strategies for maintaining mental wellness in our fast-paced world.',
    content: 'Full article content would go here...',
    author: 'Dr. Emily Rodriguez',
    publishedAt: '2024-01-05',
    readTime: '7 min read',
    category: 'Mental Health',
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600',
    tags: ['mental health', 'stress', 'wellness']
  }
];

export const fetchBlogs = createAsyncThunk(
  'blogs/fetchBlogs',
  async () => {
    await new Promise(resolve => setTimeout(resolve, 700));
    return mockBlogPosts;
  }
);

const blogsSlice = createSlice({
  name: 'blogs',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchBlogs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBlogs.fulfilled, (state, action) => {
        state.loading = false;
        state.posts = action.payload;
      })
      .addCase(fetchBlogs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch blog posts';
      });
  },
});

export default blogsSlice.reducer;
