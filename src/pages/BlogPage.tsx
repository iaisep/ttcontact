
import React from "react";
import { useLanguage } from "@/context/LanguageContext";
import HelpCenterLayout from "@/components/help-center/HelpCenterLayout";
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarIcon, Clock, ArrowRight, Facebook, Linkedin, Twitter } from "lucide-react";
import { Button } from "@/components/ui/button";

const BlogPage = () => {
  const { t } = useLanguage();
  
  const categories = [
    { id: "all", label: "All" },
    { id: "agent-building", label: "Agent Building" },
    { id: "security", label: "Security" },
    { id: "comparison", label: "Comparison" },
    { id: "features", label: "Features" },
    { id: "industry-insight", label: "Industry Insight" },
    { id: "use-cases", label: "Use cases" },
    { id: "company-news", label: "Company News" },
  ];

  const featuredPost = {
    id: "ai-voice-agents-2025",
    title: "AI Voice Agents in 2025 (and What You Need to Know)",
    excerpt: "Explore our comprehensive guide on AI voice agents, and how they are transforming and modernizing businesses' inbound and outbound call operations in 2025.",
    image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158",
    author: "Bing",
    authorTitle: "Co-founder & CEO",
    readTime: "6 Min",
    date: "Mar 27, 2025",
    category: "featured"
  };

  const blogPosts = [
    {
      id: "top-5-ai-call-mistakes",
      title: "The 5 Most Costly Mistakes Enterprises Make with AI Call Rollouts (& How to Recover)",
      excerpt: "Avoid the costliest AI call rollout pitfalls by learning what slows down enterprise AI calling rollouts. Explore how to recover.",
      image: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b",
      readTime: "8 Min",
      date: "May 21, 2025",
      category: "industry-insight"
    },
    {
      id: "connect-retell-mcp",
      title: "How To Connect Retell AI Voice Agent MCP Server To Your Favorite AI Assistant (like ChatGPT, Claude, etc.)",
      excerpt: "Learn how to connect AI voice agents to assistants like ChatGPT or Claude to unlock true AI automation with enhanced capabilities.",
      image: "https://images.unsplash.com/photo-1649972904349-6e44c42644a7",
      readTime: "6 Min",
      date: "May 13, 2025",
      category: "agent-building"
    },
    {
      id: "vapi-pricing",
      title: "Revealing Vapi AI's Hidden Pricing (so You Don't Have To)",
      excerpt: "Uncover the real costs of Vapi AI's fragmented pricing. Learn why transparency matters for scaling AI phone solutions.",
      image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085",
      readTime: "4 Min",
      date: "May 9, 2025",
      category: "comparison"
    }
  ];

  return (
    <HelpCenterLayout>
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Blog Header */}
        <div className="text-center mb-12">
          <div className="inline-block px-3 py-1 text-sm font-medium text-indigo-700 bg-indigo-100 rounded-full mb-4">
            UISEP Blogs
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Discover <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">Articles</span> To Help You Build Better
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            News, guides, resources from UISEP to help you get the most out of our platform
          </p>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap gap-2 mb-8 justify-center">
          {categories.map((category) => (
            <Button
              key={category.id}
              variant={category.id === "all" ? "default" : "outline"}
              size="sm"
              className="rounded-full"
            >
              {category.label}
            </Button>
          ))}
        </div>

        {/* Featured Post */}
        <div className="mb-12">
          <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm overflow-hidden border border-gray-200 dark:border-gray-800">
            <div className="flex flex-col lg:flex-row">
              <div className="lg:w-1/2">
                <div className="h-64 lg:h-full bg-gradient-to-br from-blue-400 via-purple-400 to-indigo-500 relative">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="p-8 text-white">
                      <h2 className="text-3xl md:text-4xl font-bold mb-2">AI Voice Agents in 2025</h2>
                      <div className="border-2 border-white w-24 mb-8"></div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="lg:w-1/2 p-6 lg:p-10 flex flex-col justify-between">
                <div>
                  <div className="inline-block px-3 py-1 text-xs font-medium text-indigo-700 bg-indigo-100 rounded-full mb-4">
                    FEATURED
                  </div>
                  <h2 className="text-2xl font-bold mb-4">{featuredPost.title}</h2>
                  <p className="text-muted-foreground mb-6">{featuredPost.excerpt}</p>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="h-10 w-10 rounded-full bg-gray-200 mr-3"></div>
                    <div>
                      <p className="font-medium">{featuredPost.author}</p>
                      <p className="text-sm text-muted-foreground">{featuredPost.authorTitle}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Clock className="mr-1 h-4 w-4" />
                    <span className="mr-3">{featuredPost.readTime}</span>
                    <CalendarIcon className="mr-1 h-4 w-4" />
                    <span>{featuredPost.date}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Blog Posts Grid */}
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 mb-12">
          {blogPosts.map((post) => (
            <Card key={post.id} className="overflow-hidden transition-all hover:shadow-md">
              <div className="aspect-video w-full overflow-hidden bg-gray-100 dark:bg-gray-800">
                <div className="h-full w-full bg-gradient-to-br from-indigo-300 via-purple-300 to-pink-300"></div>
              </div>
              <CardHeader>
                <CardTitle className="line-clamp-2 hover:text-indigo-600 transition-colors">
                  <Link to={`/blog/${post.id}`}>{post.title}</Link>
                </CardTitle>
                <CardDescription className="line-clamp-3">{post.excerpt}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div>
                    <Link 
                      to={`/blog/${post.id}`}
                      className="flex items-center text-indigo-600 dark:text-indigo-400 font-medium hover:underline"
                    >
                      {t("read_more")} <ArrowRight className="ml-1 h-4 w-4" />
                    </Link>
                  </div>
                  
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Clock className="mr-1 h-4 w-4" />
                    <span className="mr-2">{post.readTime}</span>
                    <span className="text-xs">{post.date}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Newsletter */}
        <div className="bg-gradient-to-r from-indigo-100 to-purple-100 dark:from-indigo-950 dark:to-purple-950 p-8 rounded-xl text-center mb-12">
          <h3 className="text-2xl font-bold mb-4">Subscribe to Our Newsletter</h3>
          <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
            Get the latest articles, updates and news delivered straight to your inbox. No spam, just valuable content.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input 
              type="email" 
              placeholder="Your email address" 
              className="flex-1 px-4 py-2 rounded-md border border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <Button>Subscribe</Button>
          </div>
        </div>

        {/* Social Share */}
        <div className="text-center">
          <p className="text-lg font-medium mb-4">Share Our Blog</p>
          <div className="flex justify-center gap-4">
            <Button variant="outline" size="icon" className="rounded-full">
              <Twitter className="h-5 w-5" />
            </Button>
            <Button variant="outline" size="icon" className="rounded-full">
              <Facebook className="h-5 w-5" />
            </Button>
            <Button variant="outline" size="icon" className="rounded-full">
              <Linkedin className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </HelpCenterLayout>
  );
};

export default BlogPage;
