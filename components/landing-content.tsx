"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const testimonials = [
  {
    name: "Eva",
    avatar: "E",
    title: "Full-Stack Web Developer",
    description: "This is the best application I've used! Really helpful to improve my skills."
  },
  {
    name: "Kevin",
    avatar: "K",
    title: "Software Engineer",
    description: "Great application! I like the idea behind it."
  },
  {
    name: "Devan",
    avatar: "E",
    title: "Product Manager",
    description: "This is a amazing. I always use it to find some sources for my products."
  },
  {
    name: "Johan",
    avatar: "J",
    title: "Operation Manager",
    description: "Incredible stuff! You can use 5 awesome tools and there are a customer service who always ready to help you!"
  }
]

export const LandingContent = () => {
  return (
    <div className='px-10 pb-20'>
      <h2 className='text-center text-4xl text-white font-extrabold mb-10'>
        Testimonials
      </h2>

      <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4'>
        {testimonials.map((item) => (
          <Card
            key={item.description}
            className="bg-[#192339] border-none text-white"
          >
            <CardHeader>
              <CardTitle className="flex items-center gap-x-2">
                <div>
                  <p className="text-lg">{item.name}</p>
                  <p className="text-zinc-400 text-sm">{item.title}</p>
                </div>
              </CardTitle>
              <CardContent className="pt-4 px-0">
                {item.description}
              </CardContent>
            </CardHeader>
          </Card>
        ))}
      </div>
    </div>
  )
}

