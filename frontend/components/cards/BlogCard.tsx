import Image from "next/image";
import Link from "next/link";

type BlogPost = {
  slug: string;
  title: string;
  excerpt: string;
  image: string;
  category: string;
  date: string;
  readTime?: string;
};

interface BlogCardProps {
  post: BlogPost;
}

export default function BlogCard({ post }: BlogCardProps) {
  return (
    <article className="group">
      {/* Image */}
      <Link
        href={`/blog/${post.slug}`}
        className="relative block aspect-[16/10] overflow-hidden rounded-[10px] bg-stone"
      >
        <Image
          src={post?.image}
          alt={post.title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
        />

        {/* Category */}
        {/* <span className="absolute left-4 top-4 rounded-[10px] bg-ivory px-3 py-1.5 font-body text-xs font-semibold text-charcoal">
          {post.category}
        </span> */}
      </Link>

      {/* Content */}
      <div className="pt-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 font-body text-xs text-text/50">
            <span>{post.date}</span>

            <span className="h-1 w-1 rounded-full bg-orange" />

            <span>{post.readTime}</span>
          </div>
          <div className="flex items-center gap-1 font-body text-xs text-text/50">
            <span className="h-1 w-1 rounded-full bg-orange" />

            <span>{post.category}</span>
          </div>
        </div>

        <Link href={`/blog/${post.slug}`}>
          <h3 className="mt-3 font-heading text-xl font-semibold leading-snug text-charcoal transition-colors group-hover:text-orange sm:text-2xl">
            {post.title}
          </h3>
        </Link>

        <p className="mt-3 line-clamp-2 font-body text-sm leading-6 text-text/65 sm:text-base">
          {post.excerpt}
        </p>

        <Link
          href={`/blog/${post.slug}`}
          className="mt-5 inline-flex items-center gap-2 font-body text-sm font-semibold text-charcoal transition-colors hover:text-orange"
        >
          Read Article
          <span className="transition-transform duration-200 group-hover:translate-x-1">
            →
          </span>
        </Link>
      </div>
    </article>
  );
}