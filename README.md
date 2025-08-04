# DiwTube - Video Streaming Platform

DiwTube is a modern video streaming platform that allows users to upload, manage, and view videos. It leverages cutting-edge web technologies to deliver a seamless and scalable user experience.

Explore the live application [here](https://www.diwtube.com/).

## Technologies Used

### Frontend
- **Next.js**: Server-side rendering and routing.
- **React**: Component-based UI development.
- **Tailwind CSS**: Utility-first styling.
- **Shadcn**: Accessible and customizable UI components.

### Backend
- **tRPC**: Type-safe API development.
- **Drizzle ORM**: Database schema management and query building.
- **PostgreSQL**: Relational database for storing user and video data.
- **Mux**: Video processing, hosting, and subtitle generation.
- **Clerk**: Authentication and authorization.
- **Upstash Workflow**: Background job processing.

### DevOps & Deployment
- **Vercel**: Hosting and deployment.
- **Bun**: Package manager for efficient dependency management.
- **ESLint & Prettier**: Code quality and formatting.

### Other Tools
- **React Query**: State management and server-side data fetching.
- **SuperJSON**: Serialization for complex data structures.
- **UploadThing**: Simplified file uploads.
- **OpenAI API**: AI-powered features for video metadata.

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/diwas-rai/diwtube.git
   ```

2. Install dependencies:
   ```bash
   bun install
   ```

3. Set up environment variables:
   Create a `.env` file in the root directory and populate it using the `example.env` file as a reference:
   ```env
   DATABASE_URL=your_postgresql_url
   MUX_API_KEY=your_mux_api_key
   CLERK_API_KEY=your_clerk_api_key
   OPENAI_API_KEY=your_openai_api_key
   ```

4. Run the development server:
   ```bash
   bun run dev:all
   ```

5. Open your browser and navigate to `http://localhost:3000`.

## Deployment

The project is deployed on **Vercel**. To deploy your own version:
1. Push your code to a GitHub repository.
2. Connect the repository to Vercel.
3. Set up environment variables in the Vercel dashboard.
4. Deploy the application.

## Acknowledgments

- [Mux](https://mux.com) for video processing and hosting.
- [Clerk](https://clerk.dev) for authentication.
- [OpenAI](https://openai.com) for AI-powered features.
- [Vercel](https://vercel.com) for deployment.
- [Shadcn](https://ui.shadcn.com/) for UI components.

---